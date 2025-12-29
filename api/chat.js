import axios from 'axios';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

async function generateContent(prompt) {
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return response.data.candidates[0].content.parts[0].text;
    }

    return 'Sorry, I could not generate a response. Please try again.';
  } catch (error) {
    console.error('Gemini API error:', error.response?.status, error.response?.data);
    
    // Fallback mock responses for development
    const prompt_lower = prompt.toLowerCase();
    if (prompt_lower.includes('hello') || prompt_lower.includes('hi')) {
      return 'Hello! How can I help you today? 👋';
    }
    if (prompt_lower.includes('thanks') || prompt_lower.includes('thank you')) {
      return "You're welcome! Feel free to ask me anything else. 😊";
    }
    if (prompt_lower.includes('exam') || prompt_lower.includes('test')) {
      return 'I can help you prepare for exams! What topic would you like to study? 📚';
    }
    
    return 'I encountered an error processing your request. Please check your API key and try again.';
  }
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (message.length > 10000) {
      return res.status(400).json({ error: 'Message is too long (max 10000 characters)' });
    }

    const response = await generateContent(message);

    return res.status(200).json({
      success: true,
      message: response,
    });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
