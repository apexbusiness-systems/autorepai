import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">AutoRepAi</p>
          <h1 className="text-2xl font-semibold">Compliance-first dealership AI</h1>
        </div>
        <Button asChild variant="outline">
          <Link to="/auth">Sign in</Link>
        </Button>
      </header>
      <main className="mx-auto grid max-w-6xl gap-10 px-6 pb-16 pt-10 md:grid-cols-2">
        <section className="space-y-6">
          <h2 className="text-4xl font-semibold leading-tight">
            Lead intelligence, compliance, and inventory visibility in one platform.
          </h2>
          <p className="text-slate-300">
            AutoRepAi orchestrates omnichannel engagement, AI-assisted quote drafting, and
            secure consent tracking across every dealership team.
          </p>
          <div className="flex gap-3">
            <Button asChild>
              <Link to="/app">Open command center</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/auth">Request access</Link>
            </Button>
          </div>
        </section>
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h3 className="text-lg font-semibold">Production status</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            <li>✅ Supabase RLS coverage across 20 core tables</li>
            <li>✅ AES-256-GCM field encryption for credit data</li>
            <li>✅ Lovable AI Gateway (Gemini 2.5 Flash)</li>
            <li>⚠️ CI/CD tests required before release</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Index;
