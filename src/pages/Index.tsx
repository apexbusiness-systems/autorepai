import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Car, CheckCircle } from 'lucide-react';
import AIChatWidget from '../components/Chat/AIChatWidget';

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-brand-500/10 blur-[100px] rounded-full pointer-events-none" />

      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 relative z-10">
        <div className="flex items-center gap-2">
          {/* Simple logo placeholder - could be an image or icon */}
          <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
            <span className="text-xs font-bold text-white">AR</span>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">AutoRepAi</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/inventory" className="hover:text-white transition-colors">Inventory</Link>
          <Link to="/quotes" className="hover:text-white transition-colors">Quotes</Link>
          <Link to="/clients" className="hover:text-white transition-colors">Clients</Link>
          <Link to="/app" className="hover:text-white transition-colors">Dashboard</Link>
          <Link to="/settings" className="hover:text-white transition-colors">Settings</Link>
        </nav>
        <Button asChild variant="outline" className="border-slate-800 bg-slate-900/50 text-white hover:bg-slate-800 backdrop-blur-sm">
          <Link to="/auth">Install App</Link>
        </Button>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center pb-32 pt-20 relative z-10">

        <div className="mb-10 animate-fade-in-up">
           <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-500 shadow-[0_0_20px_-5px_rgba(239,68,68,0.3)]">
             <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
             </span>
             AI-Powered Dealership Platform
           </div>
        </div>

        {/* Hero Graphic / Logo Circle */}
        <div className="mb-10 relative group cursor-pointer">
           <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-brand-500 to-red-600 opacity-75 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200 animate-tilt"></div>
           <div className="relative h-48 w-48 flex items-center justify-center rounded-full border border-slate-800 bg-slate-950 shadow-2xl">
              <div className="absolute inset-0 rounded-full border border-slate-800/50"></div>
              {/* Central Graphic Placeholder */}
              <div className="flex flex-col items-center justify-center gap-2">
                 <Car className="h-16 w-16 text-slate-500/50" strokeWidth={1} />
                 <span className="text-[10px] tracking-[0.2em] text-slate-600 font-bold uppercase">AutoAi</span>
              </div>
           </div>
        </div>

        <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl mb-6">
          <span className="text-white">Close More Deals.</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-red-600">Work Less.</span>
        </h1>

        <p className="max-w-2xl text-lg text-slate-400 mb-10 leading-relaxed">
          Transform your dealership with AI that automates leads, quotes, and
          credit applications while ensuring enterprise-grade compliance.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center w-full max-w-md mx-auto sm:max-w-none">
          <Button asChild size="lg" className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 h-14 text-base shadow-lg shadow-brand-500/25 transition-all hover:scale-105 active:scale-95">
            <Link to="/auth">Start Free Trial →</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-slate-700 bg-white text-slate-900 hover:bg-slate-100 font-semibold px-8 h-14 text-base transition-all hover:scale-105 active:scale-95">
            <Link to="/demo" className="flex items-center gap-2">
              View Live Demo
              <Car className="h-5 w-5 ml-1 text-brand-500" />
            </Link>
          </Button>
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-brand-500/80" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-brand-500/80" />
            <span>Setup in 5 minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-brand-500/80" />
            <span>Cancel anytime</span>
          </div>
        </div>
      </main>

      {/* Re-add the Widget explicitly if it wasn't in layout */}
      <AIChatWidget />
    </div>
  );
};

export default Index;
