import { useState } from 'react';
import { Button } from '../ui/button';
import { Bot, X } from 'lucide-react';

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 rounded-2xl border border-slate-800 bg-slate-900 shadow-xl animate-fade-in-up origin-bottom-right">
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 bg-brand-500/5">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-brand-500 flex items-center justify-center">
                 <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">AI Assistant</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-400">Gemini 2.5 Flash</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close Chat"
              className="h-6 w-6 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3 px-4 py-4 text-sm text-slate-200 min-h-[200px] flex flex-col justify-end">
            <div className="flex gap-2">
               <div className="h-6 w-6 rounded-full bg-brand-500 flex-shrink-0 flex items-center justify-center mt-1">
                  <Bot className="h-3 w-3 text-white" />
               </div>
               <p className="rounded-2xl rounded-tl-none bg-slate-800 px-4 py-3 text-slate-300 max-w-[85%]">
                 How can I help you qualify this lead today?
               </p>
            </div>
            <div className="text-[10px] text-center text-slate-500 mt-2">
              Chat history will sync via /functions/v1/ai-chat
            </div>
          </div>
          <div className="border-t border-slate-800 px-4 py-3 bg-slate-950/50">
            <Button className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium" size="sm">
              Start a new conversation
            </Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-24 w-24 p-0 bg-brand-500 hover:bg-brand-600 text-white shadow-[0_0_40px_-10px_rgba(239,68,68,0.5)] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group"
        >
          <Bot className="h-12 w-12 text-white group-hover:animate-bounce" strokeWidth={1.5} />
          <span className="sr-only">Open AI Chat</span>
          <div className="absolute top-0 right-0 h-6 w-6 bg-green-500 rounded-full border-4 border-slate-950"></div>
        </Button>
      )}
    </div>
  );
};

export default AIChatWidget;
