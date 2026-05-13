import LeadCaptureForm from '../components/Forms/LeadCaptureForm';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { Users, Activity, CheckCircle } from 'lucide-react';

const fetchLeads = async () => {
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
     return [
       { id: '1', full_name: 'Jessica Reynolds', email: 'jessica.r@example.com', status: 'new', intent_score: 92, created_at: new Date().toISOString() },
       { id: '2', full_name: 'Marcus Thorne', email: 'm.thorne@company.org', status: 'contacted', intent_score: 45, created_at: new Date(Date.now() - 3600000).toISOString() }
     ];
  }

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) throw error;
  return data;
};

const Leads = () => {
  const { data: leads, isLoading } = useQuery({
    queryKey: ['leadsList'],
    queryFn: fetchLeads,
    refetchInterval: 5000 // Poll for new leads during pitch
  });

  return (
    <div className="space-y-8 animate-fade-in-up">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-semibold text-white tracking-tight flex items-center gap-3">
             <Users className="h-8 w-8 text-brand-500" />
             Lead Intelligence
          </h1>
          <p className="text-sm text-brand-400 mt-2 max-w-xl uppercase tracking-widest font-bold">
            Capture, score, and assign leads with compliance-first consent tracking.
          </p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <section className="rounded-2xl border border-slate-800 bg-black p-6 shadow-xl shadow-brand-500/5 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 blur-[80px] rounded-full pointer-events-none -mt-10 -mr-10"></div>

          <h2 className="text-xl font-semibold text-white mb-2 relative z-10">Intelligent Capture</h2>
          <p className="text-xs text-slate-400 font-mono tracking-tight mb-6 relative z-10 flex items-center gap-2">
            <CheckCircle className="h-3 w-3 text-green-500" />
            Consent logged to consent_logs
          </p>
          <div className="relative z-10">
            <LeadCaptureForm />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-black p-6 shadow-xl relative overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
             <h2 className="text-xl font-semibold text-white flex items-center gap-2">
               <Activity className="h-5 w-5 text-brand-500" />
               Recent Activity
             </h2>
             <div className="flex gap-4 text-xs font-mono uppercase tracking-widest text-slate-500 font-bold">
               <span>Total: {leads?.length || 0}</span>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 -mx-2 px-2">
            {isLoading ? (
               [...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 rounded-xl bg-slate-900 border border-slate-800 animate-pulse"></div>
               ))
            ) : leads?.length === 0 ? (
               <div className="py-12 flex flex-col items-center justify-center text-slate-500 border border-slate-800 border-dashed rounded-xl h-full">
                 <Users className="h-10 w-10 mb-3 opacity-50 text-slate-600" />
                 <p className="text-sm">No recent leads.</p>
               </div>
            ) : (
               leads?.map((lead) => (
                  <div key={lead.id} className="group rounded-xl border border-slate-800 bg-slate-900/50 p-4 hover:border-brand-500/30 hover:bg-slate-900 transition-all duration-300 flex items-center justify-between shadow-sm">
                     <div className="flex items-center gap-4">
                       <div className="h-10 w-10 rounded-full bg-black border border-slate-800 flex items-center justify-center">
                          <span className="text-brand-500 font-bold text-sm">{(lead.full_name as string).charAt(0)}</span>
                       </div>
                       <div>
                         <p className="font-bold text-white text-sm">{lead.full_name}</p>
                         <p className="text-xs text-slate-500 font-mono mt-0.5">{lead.email}</p>
                       </div>
                     </div>
                     <div className="flex items-center gap-6">
                       <div className="text-right hidden sm:block">
                         <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Intent</div>
                         <div className="flex items-center gap-2">
                           <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                             <svg className="w-full h-full">
                               <rect
                                 className={`${lead.intent_score > 70 ? 'fill-green-500' : lead.intent_score > 40 ? 'fill-amber-500' : 'fill-red-500'}`}
                                 width={`${lead.intent_score}%`}
                                 height="100%"
                               />
                             </svg>
                           </div>
                           <span className="text-xs font-mono text-white">{lead.intent_score}</span>
                         </div>
                       </div>
                       <div className={`px-3 py-1 rounded text-[10px] uppercase font-bold tracking-widest ${
                          lead.status === 'new' ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20' :
                          lead.status === 'contacted' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          'bg-slate-800 text-slate-400'
                       }`}>
                         {lead.status}
                       </div>
                     </div>
                  </div>
               ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Leads;
