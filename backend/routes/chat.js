import express from 'express';
import axios from 'axios';

const router = express.Router();

// الـ API key محفوظ في Server فقط!
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent';

// Middleware للتحقق من الـ API key
if (!GEMINI_API_KEY) {
  console.error('⚠️ تحذير: GEMINI_API_KEY غير معرف في .env');
}

// Route: إرسال رسالة للـ Gemini
router.post('/', async (req, res) => {
  try {
    const { message, history } = req.body;

    // التحقق من الرسالة
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'رسالة غير صحيحة' });
    }

    if (message.length > 2000) {
      return res.status(400).json({ error: 'الرسالة طويلة جداً (حد أقصى 2000 حرف)' });
    }

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'API key غير متاح' });
    }

    try {
      // بناء السياق من السجل السابق
      let conversationContext = '';
      if (history && Array.isArray(history)) {
        conversationContext = history
          .slice(-5) // آخر 5 رسائل فقط لتجنب token limit
          .map((msg) => `${msg.role === 'user' ? 'المستخدم' : 'المساعد'}: ${msg.content}`)
          .join('\n');
      }

      // بناء الطلب للـ Gemini
      const prompt = conversationContext
        ? `السياق السابق:\n${conversationContext}\n\nالمستخدم: ${message}`
        : message;

      const response = await axios.post(
        GEMINI_API_URL,
        {
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': GEMINI_API_KEY,
          },
          timeout: 30000,
        }
      );

      // استخراج الرد
      if (
        response.data.candidates &&
        response.data.candidates[0] &&
        response.data.candidates[0].content &&
        response.data.candidates[0].content.parts &&
        response.data.candidates[0].content.parts[0]
      ) {
        const reply = response.data.candidates[0].content.parts[0].text;

        return res.json({
          success: true,
          reply,
        });
      } else {
        return res.status(500).json({
          error: 'لم نتمكن من الحصول على رد من الـ API',
        });
      }
    } catch (apiError) {
      console.error('Gemini API error:', apiError.message);

      // في حالة خطأ API، نرسل رد وهمي للـ testing
      if (process.env.NODE_ENV === 'development') {
        console.log('⚠️ Using mock response in development mode');
        return res.json({
          success: true,
          reply: `تم استلام رسالتك: "${message}"\n\nهذا رد تجريبي لأن الـ API لم تتصل بنجاح. تأكد من صحة الـ API key.`,
        });
      }

      // في production، ارجع خطأ
      if (apiError.response?.status === 429) {
        return res.status(429).json({
          error: 'عدد الطلبات كثير. حاول لاحقاً',
        });
      }

      if (apiError.code === 'ECONNABORTED') {
        return res.status(504).json({
          error: 'انتهت مهلة الانتظار. حاول مجدداً',
        });
      }

      return res.status(500).json({
        error: 'خطأ في معالجة الطلب',
      });
    }
  } catch (error) {
    console.error('Request error:', error);
    return res.status(500).json({
      error: 'خطأ في معالجة الطلب',
    });
  }
});

export default router;
