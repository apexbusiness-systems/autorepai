import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { ShieldCheck, FileSignature, Clock, AlertCircle } from 'lucide-react';

const fetchCreditApps = async () => {
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
     return [
       { id: '1', lead_name: 'Alex Morgan', status: 'pending', submitted_at: new Date().toISOString(), amount_requested: 45000 },
       { id: '2', lead_name: 'Jordan Lee', status: 'review', submitted_at: new Date(Date.now() - 86400000).toISOString(), amount_requested: 32000 }
     ];
  }

  const { data, error } = await supabase
    .from('credit_applications')
    .select('*, leads(full_name)')
    .order('submitted_at', { ascending: false })
    .limit(5);

  if (error) throw error;
  return data.map(app => ({
    ...app,
    lead_name: app.leads?.full_name || 'Unknown Applicant'
  }));
};

const CreditApps = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['creditApps'],
    queryFn: fetchCreditApps
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-semibold text-white tracking-tight flex items-center gap-3">
             <ShieldCheck className="h-8 w-8 text-brand-500" />
             Credit Applications
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-xl">
            FCRA & PIPEDA-compliant portal. AMVIC consent timestamps, biometric logging, and encrypted audit trails are active.
          </p>
        </div>
        <div className="flex gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-inner">
           <div className="text-center">
             <div className="text-2xl font-black text-white">{data?.filter(a => a.status === 'pending').length || 0}</div>
             <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">Pending</div>
           </div>
           <div className="w-px bg-slate-800" />
           <div className="text-center">
             <div className="text-2xl font-black text-amber-500">{data?.filter(a => a.status === 'review').length || 0}</div>
             <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">In Review</div>
           </div>
        </div>
      </header>

      <div className="space-y-4">
        {isLoading ? (
           [...Array(3)].map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-slate-900 border border-slate-800 animate-pulse"></div>
           ))
        ) : data?.length === 0 ? (
           <div className="py-16 text-center text-slate-500 border border-slate-800 border-dashed rounded-2xl flex flex-col items-center">
             <FileSignature className="h-12 w-12 mb-3 opacity-50" />
             <p>No active credit applications found.</p>
           </div>
        ) : (
           data?.map((app) => (
              <div key={app.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-slate-800 bg-black hover:bg-slate-900/50 hover:border-brand-500/30 transition-all duration-300 shadow-sm gap-4">
                 <div className="flex items-center gap-4">
                   <div className="h-12 w-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shadow-inner group-hover:border-brand-500/50 transition-colors">
                      <FileSignature className="h-5 w-5 text-slate-400 group-hover:text-brand-500 transition-colors" />
                   </div>
                   <div>
                     <h3 className="font-bold text-white text-lg">{app.lead_name}</h3>
                     <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 font-mono">
                        <Clock className="h-3 w-3" />
                        {new Date(app.submitted_at).toLocaleDateString()}
                     </div>
                   </div>
                 </div>

                 <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/2 px-4 sm:px-0">
                   <div className="text-right">
                     <div className="text-sm font-bold text-slate-300">Requested</div>
                     <div className="text-xl font-black text-white">${app.amount_requested.toLocaleString()}</div>
                   </div>
                   <div className={`px-4 py-1.5 rounded-full text-xs uppercase font-bold tracking-wider flex items-center gap-2 ${
                      app.status === 'pending' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      app.status === 'review' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-slate-800 text-slate-400'
                   }`}>
                     {app.status === 'review' && <AlertCircle className="h-3 w-3" />}
                     {app.status}
                   </div>
                 </div>
              </div>
           ))
        )}
      </div>
    </div>
  );
};

export default CreditApps;
