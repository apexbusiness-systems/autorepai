import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import AIChatWidget from '../Chat/AIChatWidget';
import { Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../../integrations/supabase/client';


const navItems = [
  { label: 'Dashboard', to: '/app' },
  { label: 'Leads', to: '/app/leads' },
  { label: 'Inventory', to: '/app/inventory' },
  { label: 'Quotes', to: '/app/quotes' },
  { label: 'Credit Apps', to: '/app/credit-apps' },
  { label: 'Inbox', to: '/app/inbox' },
  { label: 'Settings', to: '/app/settings' }
];

const AppLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans">
      <div className="flex min-h-screen lg:grid lg:grid-cols-[240px_1fr]">

        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 z-40 flex items-center justify-between px-4">
          <img src="/AUTOREPAI-LOGO.png" alt="AutoRepAi Logo" className="h-8 w-auto" />
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-300 hover:text-white">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900/90 backdrop-blur-md border-r border-slate-800 px-6 py-8 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="mb-8 hidden lg:block">
            <img src="/AUTOREPAI-LOGO.png" alt="AutoRepAi Logo" className="h-10 w-auto mb-2" />
            <h1 className="text-lg font-semibold text-slate-300">Command Center</h1>
          </div>
          <div className="mb-8 lg:hidden mt-8">
            <p className="text-sm uppercase tracking-[0.2em] text-brand-500 font-bold">Menu</p>
          </div>
          <nav className="flex flex-col gap-2 text-sm">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 transition ${
                    isActive ? 'bg-brand-500/20 text-brand-400 font-semibold border border-brand-500/30' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="absolute bottom-8 left-6 right-6">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
        )}

        {/* Main Content */}
        <main className="flex-1 relative px-4 sm:px-8 py-20 lg:py-10 min-w-0">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
          <AIChatWidget />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
