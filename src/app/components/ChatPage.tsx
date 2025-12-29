import React, { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { chatService } from '../../utils/chatService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    setError('');
    setLoading(true);

    try {
      const response = await chatService.sendMessage(input);

      if (response.success && response.reply) {
        setMessages(chatService.getHistory());
        setInput('');
      } else {
        setError(response.error || 'حدث خطأ في إرسال الرسالة');
      }
    } catch (err) {
      setError('خطأ في الاتصال مع الخادم');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    chatService.clearHistory();
    setMessages([]);
    setError('');
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-50 p-4">
        <Card className="w-full max-w-2xl h-[600px] flex flex-col shadow-2xl border-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h1 className="text-2xl font-bold">AI Chat Assistant 🤖</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearChat}
              className="hover:bg-blue-700 text-white"
            >
              مسح المحادثة
            </Button>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4 overflow-hidden">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center w-full text-gray-400">
                <p className="text-lg mb-2">👋 ابدأ محادثة مع الـ AI</p>
                <p className="text-sm">أرسل رسالة للبدء</p>
              </div>
            ) : (
              <div className="space-y-4 w-full">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-gray-200 text-gray-900 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {msg.content}
                      </p>
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(msg.timestamp).toLocaleTimeString('ar-EG')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 mx-4">
              {error}
            </div>
          )}

          {/* Input Area */}
          <div className="border-t p-4 bg-white rounded-b-lg space-y-3">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="اكتب رسالتك هنا..."
                value={input}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                onKeyPress={(e: KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={loading}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={loading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? '⏳ جاري...' : '📤 إرسال'}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              💡 الرسائل تُحفظ في المتصفح فقط
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
}