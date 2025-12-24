import { useState } from 'react';
import { Button } from '../ui/button';

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6">
      {isOpen ? (
        <div className="w-80 rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
            <div>
              <p className="text-sm font-semibold">AI Assistant</p>
              <p className="text-xs text-slate-400">Gemini 2.5 Flash</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Close
            </button>
          </div>
          <div className="space-y-3 px-4 py-4 text-sm text-slate-200">
            <p className="rounded-lg bg-slate-800/60 px-3 py-2">
              How can I help you qualify this lead today?
            </p>
            <div className="rounded-lg border border-slate-800 px-3 py-2 text-slate-400">
              Chat history will sync via /functions/v1/ai-chat.
            </div>
          </div>
          <div className="border-t border-slate-800 px-4 py-3">
            <Button className="w-full" size="sm">
              Start a new conversation
            </Button>
          </div>
        </div>
      ) : (
        <Button onClick={() => setIsOpen(true)} className="rounded-full px-5">
          AI Chat
        </Button>
      )}
    </div>
  );
};

export default AIChatWidget;
