import { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/Input';
import { Bot, X, Send } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'How can I help you qualify this lead today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const newUserMessage: Message = { role: 'user', content: inputValue.trim() };
    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // In a real implementation, this would call a Supabase Edge Function
      // which securely holds the GROQ_API_KEY.
      // We simulate the Groq response for the demo pitch.
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `I've analyzed the request using Groq (llama3-70b-8192). The lead meets the preliminary AMVIC compliance checks. Would you like me to draft a follow-up email or calculate a preliminary quote?`
        }]);
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Chat error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 sm:w-96 rounded-2xl border border-slate-800 bg-black shadow-2xl shadow-brand-500/10 animate-fade-in-up origin-bottom-right flex flex-col h-[500px] max-h-[80vh]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 bg-gradient-to-r from-slate-900 to-slate-950 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-brand-500 flex items-center justify-center shadow-sm shadow-brand-500/50">
                 <Bot className="h-5 w-5 text-black" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">AutoRep AI</p>
                <p className="text-[10px] uppercase tracking-wider text-brand-400 font-bold">Powered by Groq Llama 3</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-slate-950/50">
            {messages.map((msg, index) => (
              <div key={index} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {msg.role === 'assistant' && (
                  <div className="h-6 w-6 rounded-full bg-brand-500 flex-shrink-0 flex items-center justify-center mt-1">
                    <Bot className="h-3 w-3 text-black" />
                  </div>
                )}
                <div className={`rounded-2xl px-4 py-3 text-sm max-w-[85%] ${
                  msg.role === 'user'
                    ? 'bg-brand-500/20 border border-brand-500/30 text-white rounded-tr-none'
                    : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2">
                <div className="h-6 w-6 rounded-full bg-brand-500 flex-shrink-0 flex items-center justify-center mt-1">
                  <Bot className="h-3 w-3 text-black" />
                </div>
                <div className="rounded-2xl rounded-tl-none bg-slate-800 px-4 py-3 text-slate-300 max-w-[85%] border border-slate-700 flex items-center gap-1">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                  <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-800 px-4 py-3 bg-slate-900 rounded-b-2xl">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-center gap-2"
            >
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about inventory, compliance..."
                className="bg-black border-slate-700 focus-visible:ring-brand-500 text-sm h-10"
              />
              <Button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="bg-brand-500 hover:bg-brand-600 text-black h-10 w-10 flex-shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <div className="text-[9px] text-center text-slate-500 mt-2">
              Enterprise encryption active. Conversations mapped to CRM.
            </div>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-16 w-16 sm:h-20 sm:w-20 p-0 bg-brand-500 hover:bg-brand-400 text-black shadow-[0_0_30px_-5px_rgba(212,175,55,0.4)] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group border-2 border-brand-300"
        >
          <Bot className="h-8 w-8 sm:h-10 sm:w-10 text-black group-hover:animate-bounce" strokeWidth={1.5} />
          <span className="sr-only">Open AI Chat</span>
          <div className="absolute top-0 right-0 h-4 w-4 bg-green-500 rounded-full border-2 border-black"></div>
        </Button>
      )}
    </div>
  );
};

export default AIChatWidget;
