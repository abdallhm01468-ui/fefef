// AI Chat Service - آمن 100%
// API key موجود في Backend فقط!

// Define API_URL - will default to backend if VITE_API_URL not set
declare global {
  interface ImportMeta {
    env: {
      VITE_API_URL?: string;
    };
  }
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatResponse {
  success: boolean;
  reply?: string;
  error?: string;
}

class ChatService {
  private conversationHistory: Message[] = [];

  // إضافة رسالة للـ history
  addMessage(role: 'user' | 'assistant', content: string) {
    const message: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
    };
    this.conversationHistory.push(message);
    return message;
  }

  // الحصول على السجل كاملاً
  getHistory(): Message[] {
    return this.conversationHistory;
  }

  // مسح السجل
  clearHistory() {
    this.conversationHistory = [];
  }

  // إرسال رسالة للـ Backend (الذي يتصل بـ Gemini)
  async sendMessage(userMessage: string): Promise<ChatResponse> {
    try {
      // إضافة رسالة المستخدم للـ history
      this.addMessage('user', userMessage);

      // إرسال للـ Backend
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          history: this.conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.reply) {
        // إضافة رد الـ AI للـ history
        this.addMessage('assistant', data.reply);
        return {
          success: true,
          reply: data.reply,
        };
      }

      return {
        success: false,
        error: data.error || 'لم نتمكن من الحصول على رد',
      };
    } catch (error) {
      console.error('Chat error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'خطأ في الاتصال',
      };
    }
  }
}

export const chatService = new ChatService();
