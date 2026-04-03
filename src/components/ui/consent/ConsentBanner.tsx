import { useState, useEffect } from 'react';
import { Button } from '../button';

export const ConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('autorepai_consent_marketing');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('autorepai_consent_marketing', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('autorepai_consent_marketing', 'false');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-800 p-4 shadow-lg animate-fade-in-up">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-slate-300">
          <p className="font-semibold text-white">We value your privacy</p>
          <p>
            We use cookies and similar technologies to provide, protect, and improve our services.
            You can choose to accept or decline marketing communications.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={handleDecline}>
            Decline
          </Button>
          <Button size="sm" className="bg-brand-500 text-black hover:bg-brand-400" onClick={handleAccept}>
            Accept All
          </Button>
        </div>
      </div>
    </div>
  );
};
