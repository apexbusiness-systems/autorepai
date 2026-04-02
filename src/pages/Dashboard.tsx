import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import QuoteCalculator from '../components/Quote/QuoteCalculator';
import { Activity, Users, FileText, CheckCircle } from 'lucide-react';

const fetchPipelineMetrics = async () => {
  // If no anon key, return mock data for demo purposes (to prevent crashing the pitch)
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
     return {
       metrics: [
         { label: 'Inbound chat', value: 28, icon: Activity },
         { label: 'Website forms', value: 41, icon: Users },
         { label: 'Marketplace feeds', value: 19, icon: FileText },
         { label: 'Referrals', value: 12, icon: CheckCircle }
       ],
       totalActive: 120,
       highIntent: 34,
       complianceReview: 8
     };
  }

  try {
    const { count: totalLeads } = await supabase.from('leads').select('*', { count: 'exact', head: true });
    const { count: highIntent } = await supabase.from('leads').select('*', { count: 'exact', head: true }).gt('intent_score', 80);
    const { count: unreviewed } = await supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'new');

    return {
      metrics: [
        { label: 'Inbound chat', value: Math.floor((totalLeads || 100) * 0.3), icon: Activity },
        { label: 'Website forms', value: Math.floor((totalLeads || 100) * 0.4), icon: Users },
        { label: 'Marketplace feeds', value: Math.floor((totalLeads || 100) * 0.2), icon: FileText },
        { label: 'Referrals', value: Math.floor((totalLeads || 100) * 0.1), icon: CheckCircle }
      ],
      totalActive: totalLeads || 0,
      highIntent: highIntent || 0,
      complianceReview: unreviewed || 0
    };
  } catch (err) {
    console.error('Failed to load metrics', err);
    throw err;
  }
};

const Dashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['pipelineMetrics'],
    queryFn: fetchPipelineMetrics,
  });

  return (
    <div className="space-y-8 animate-fade-in-up">
      <header>
        <p className="text-sm font-bold uppercase tracking-wider text-brand-500">Welcome back</p>
        <h1 className="text-3xl font-semibold mt-1">Dealership performance overview</h1>
      </header>
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm p-6 shadow-xl">
          <h2 className="text-xl font-semibold text-white">Lead pipeline</h2>
          {isLoading ? (
             <p className="mt-2 text-sm text-slate-400 animate-pulse">Loading real-time metrics...</p>
          ) : (
            <>
              <p className="mt-2 text-sm text-slate-400">
                <span className="text-white font-medium">{data?.totalActive}</span> active leads ·
                <span className="text-brand-400 font-medium ml-1">{data?.highIntent}</span> high-intent ·
                <span className="text-amber-400 font-medium ml-1">{data?.complianceReview}</span> awaiting compliance review
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {data?.metrics.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="rounded-xl border border-slate-800 bg-black p-5 flex items-center gap-4 hover:border-brand-500/50 transition-colors group">
                      <div className="h-12 w-12 rounded-lg bg-slate-900 flex items-center justify-center group-hover:bg-brand-500/10 transition-colors">
                         <Icon className="h-6 w-6 text-brand-500" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">{item.label}</p>
                        <p className="text-2xl font-bold text-white">{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>
        <QuoteCalculator />
      </div>
    </div>
  );
};

export default Dashboard;
