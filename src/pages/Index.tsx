import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Car, CheckCircle, Sparkles, Rocket, Download, ArrowRight } from 'lucide-react';
import AIChatWidget from '../components/Chat/AIChatWidget';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans">

      {/* Navbar Section - White Background */}
      <header className="w-full bg-white border-b-4 border-brand-500 relative z-50">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 shadow-sm">
              <Car className="h-5 w-5 text-brand-500" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">AutoRepAi</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link to="/" className="hover:text-brand-500 transition-colors">Home</Link>
            <Link to="/inventory" className="hover:text-brand-500 transition-colors">Inventory</Link>
            <Link to="/quotes" className="hover:text-brand-500 transition-colors">Quotes</Link>
            <Link to="/clients" className="hover:text-brand-500 transition-colors">Clients</Link>
            <Link to="/app" className="hover:text-brand-500 transition-colors">Dashboard</Link>
            <Link to="/settings" className="hover:text-brand-500 transition-colors">Settings</Link>
          </nav>

          <Button asChild variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-brand-500 gap-2">
            <Link to="/auth">
              <Download className="h-4 w-4" />
              Install App
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero Section - Black Background */}
      <main className="flex-1 bg-black text-white flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">

        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-96 bg-brand-500/5 blur-[120px] rounded-full pointer-events-none" />

        {/* AI Badge */}
        <div className="mb-12 animate-fade-in-up">
           <div className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-brand-500/20">
             <Sparkles className="h-3.5 w-3.5 fill-white" />
             AI-Powered Dealership Platform
           </div>
        </div>

        {/* Central Graphic / Logo Circle */}
        <div className="mb-12 relative group cursor-pointer">
           {/* Outer Glow Ring */}
           <div className="absolute -inset-1 rounded-full bg-brand-500/20 blur-md transition duration-1000 group-hover:bg-brand-500/40 group-hover:duration-200 animate-pulse-slow"></div>

           {/* Main Circle Container */}
           <div className="relative h-48 w-48 flex items-center justify-center rounded-full border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800/50 via-slate-900 to-black opacity-80"></div>

              {/* Inner Content */}
              <div className="relative flex flex-col items-center justify-center z-10">
                 {/* Car Icon with Red Stroke */}
                 <Car className="h-16 w-16 text-brand-500 mb-2" strokeWidth={1.5} />

                 {/* Text Overlay */}
                 <div className="flex flex-col items-center">
                    <span className="text-[10px] tracking-[0.3em] text-slate-400 font-bold uppercase">AUTO</span>
                    <span className="text-xs font-bold text-white tracking-widest mt-0.5 border-t border-brand-500/50 pt-1 px-2 w-full text-center">AI</span>
                 </div>
              </div>

              {/* Decorative Tech Rings */}
              <div className="absolute inset-2 rounded-full border border-slate-700/30 border-dashed animate-spin-slow"></div>
              <div className="absolute inset-4 rounded-full border border-slate-800/50"></div>
           </div>
        </div>

        <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl mb-6 text-center leading-tight">
          <span className="text-white block sm:inline">Close More Deals.</span>
          <span className="hidden sm:inline"> </span>
          <br className="sm:hidden" />
          <span className="text-brand-500 block sm:inline">Work Less.</span>
        </h1>

        <p className="max-w-2xl text-lg text-slate-400 mb-10 text-center leading-relaxed">
          Transform your dealership with AI that automates leads, quotes, and
          credit applications while ensuring enterprise-grade compliance.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center w-full max-w-md mx-auto sm:max-w-none mb-16">
          <Button asChild size="lg" className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-8 h-14 text-base shadow-lg shadow-brand-500/25 transition-all hover:scale-105 active:scale-95 gap-2">
            <Link to="/auth">
              Start Free Trial
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="bg-white border-white text-slate-900 hover:bg-slate-100 font-semibold px-8 h-14 text-base transition-all hover:scale-105 active:scale-95 gap-2">
            <Link to="/demo">
              View Live Demo
              <Rocket className="h-5 w-5 text-brand-500" />
            </Link>
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-brand-500/10 p-0.5">
              <CheckCircle className="h-4 w-4 text-brand-500" />
            </div>
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-brand-500/10 p-0.5">
              <CheckCircle className="h-4 w-4 text-brand-500" />
            </div>
            <span>Setup in 5 minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-brand-500/10 p-0.5">
              <CheckCircle className="h-4 w-4 text-brand-500" />
            </div>
            <span>Cancel anytime</span>
          </div>
        </div>
      </main>

      {/* Explicitly positioned Widget */}
      <AIChatWidget />
    </div>
  );
};

export default Index;
