import { NavLink, Outlet } from 'react-router-dom';
import AIChatWidget from '../Chat/AIChatWidget';

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
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="grid min-h-screen grid-cols-[240px_1fr]">
        <aside className="border-r border-slate-800 bg-slate-900/60 px-6 py-8">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">AutoRepAi</p>
            <h1 className="text-xl font-semibold">Command Center</h1>
          </div>
          <nav className="flex flex-col gap-2 text-sm">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 transition ${
                    isActive ? 'bg-brand-500/20 text-brand-50' : 'text-slate-300 hover:bg-slate-800'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="relative px-8 py-10">
          <Outlet />
          <AIChatWidget />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
