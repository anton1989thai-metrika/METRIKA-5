'use client';

import { useState, useEffect, useRef } from 'react';
import { Bot, User } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const newMsg: Message = { role: 'user', content: input };
    const nextMessages = [...messages, newMsg];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.ok) {
        throw new Error('Не удалось отправить сообщение');
      }

      if (!res.body) {
        throw new Error('Ответ сервера пустой');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      const reply: Message = { role: 'assistant', content: '' };
      setMessages((p) => [...p, reply]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        reply.content += chunk;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { ...reply };
          return updated;
        });
      }
    } catch (error) {
      console.error('Chat send error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans relative">
      {messages.length === 0 && (
        <>
          {/* Фоновое видео - только когда нет сообщений */}
          <video 
            autoPlay
            loop
            muted
            playsInline
            className="fixed inset-0 w-full h-full object-cover"
            style={{ zIndex: 0 }}
          >
            <source src="/videos/back1.mp4" type="video/mp4" />
          </video>
          
          {/* Белый затемняющий слой 80% */}
          <div 
            className="fixed inset-0 bg-white"
            style={{ 
              zIndex: 1, 
              opacity: 0.8 
            }}
          ></div>
        </>
      )}
      
      {/* Абсолютно белый фон когда есть сообщения */}
      {messages.length > 0 && (
        <div className="fixed inset-0 bg-white" style={{ zIndex: 0 }}></div>
      )}
      
      <style jsx global>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      {/* Scrollable chat area */}
      <div className="flex-1 overflow-y-auto hide-scrollbar px-4 md:px-0 md:w-[820px] mx-auto py-6 space-y-4 relative z-10">
        {/* Initial welcome message and suggestions when no messages */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-8">
            <h1 className="text-4xl font-medium text-gray-900" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>МЕТРИКА GPT</h1>
            <p className="text-gray-400 text-center">Метрика — умная нейросеть, которая знает всё о недвижимости.</p>
            <div className="w-full max-w-2xl">
              <div className="flex items-center gap-2 mb-3">
                <button className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-black text-xl font-thin">
                  +
                </button>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Спросите что-нибудь..."
                  className="flex-1 bg-white border border-gray-300 text-black p-3 rounded-xl outline-none focus:ring-1 focus:ring-gray-400 placeholder-gray-400"
                />
              </div>
              
              {/* Suggestion buttons */}
              <div className="flex flex-wrap gap-2 justify-center px-12">
                <button 
                  onClick={() => setInput('Составить договор')}
                  className="bg-gray-50 border border-gray-300 hover:bg-gray-100 text-gray-400 px-3 py-1.5 rounded-full text-xs transition-colors"
                >
                  Составить договор
                </button>
                <button 
                  onClick={() => setInput('Проверить договор')}
                  className="bg-gray-50 border border-gray-300 hover:bg-gray-100 text-gray-400 px-3 py-1.5 rounded-full text-xs transition-colors"
                >
                  Проверить договор
                </button>
                <button 
                  onClick={() => setInput('Сравнить объекты')}
                  className="bg-gray-50 border border-gray-300 hover:bg-gray-100 text-gray-400 px-3 py-1.5 rounded-full text-xs transition-colors"
                >
                  Сравнить объекты
                </button>
              </div>
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 items-start max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {m.role === 'user' ? (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              ) : (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-gray-600" />
                </div>
              )}
              <div
                className={`px-4 py-3 rounded-2xl leading-relaxed shadow-sm border border-gray-300 whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-gray-100 text-black'
                    : 'bg-white text-black'
                }`}
              >
                {m.content}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-gray-600 text-center italic animate-pulse">Нейросеть печатает…</div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input area - only show when there are messages */}
      {messages.length > 0 && (
        <div className="w-full border-t border-gray-300 py-4 px-4 md:px-0 flex justify-center bg-white relative z-10">
          <div className="flex items-center gap-2 w-full md:w-[820px]">
            <button className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-black text-xl font-thin">
              +
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Спросите что-нибудь..."
              className="flex-1 bg-white border border-gray-300 text-black p-3 rounded-xl outline-none focus:ring-1 focus:ring-gray-400 placeholder-gray-400"
            />
          </div>
        </div>
      )}
    </div>
  );
}
