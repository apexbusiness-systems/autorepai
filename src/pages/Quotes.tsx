import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { FileText, Plus, Calculator, Banknote, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const fetchQuotes = async () => {
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
     return [
       { id: '1', lead_name: 'Sarah Jenkins', vehicle: '2024 Ford F-150', total: 72450.50, created_at: new Date().toISOString(), status: 'sent' },
       { id: '2', lead_name: 'David Chen', vehicle: '2023 Toyota RAV4', total: 47250.00, created_at: new Date(Date.now() - 172800000).toISOString(), status: 'draft' }
     ];
  }

  const { data, error } = await supabase
    .from('quotes')
    .select('*, leads(full_name), inventory(year, make, model)')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) throw error;
  return data.map(q => ({
    ...q,
    lead_name: q.leads?.full_name || 'Walk-in',
    vehicle: q.inventory ? `${q.inventory.year} ${q.inventory.make} ${q.inventory.model}` : 'Custom Vehicle'
  }));
};

const Quotes = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['quotes'],
    queryFn: fetchQuotes
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-semibold text-white tracking-tight flex items-center gap-3">
             <Calculator className="h-8 w-8 text-brand-500" />
             Active Quotes
          </h1>
          <p className="text-sm text-brand-400 mt-2 max-w-xl uppercase tracking-widest font-bold">
            Tax-verified quoting engine.
          </p>
        </div>
        <Link
          to="/app/quotes/new"
          className="bg-brand-500 hover:bg-brand-400 text-black font-bold h-10 px-4 rounded-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-brand-500/20"
        >
          <Plus className="h-4 w-4" />
          Build Quote
        </Link>
      </header>

      <div className="space-y-4">
        {isLoading ? (
           [...Array(4)].map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-slate-900 border border-slate-800 animate-pulse"></div>
           ))
        ) : data?.length === 0 ? (
           <div className="py-16 text-center text-slate-500 border border-slate-800 border-dashed rounded-2xl flex flex-col items-center">
             <FileText className="h-12 w-12 mb-3 opacity-50" />
             <p>No active quotes found.</p>
           </div>
        ) : (
           data?.map((quote) => (
              <div key={quote.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-800 bg-black hover:bg-slate-900/50 hover:border-brand-500/30 transition-all duration-300 gap-4">
                 <div className="flex items-center gap-4">
                   <div className="h-10 w-10 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500">
                      <Banknote className="h-4 w-4" />
                   </div>
                   <div>
                     <h3 className="font-bold text-white text-md">{quote.lead_name}</h3>
                     <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1 text-xs text-slate-400 font-mono">
                        <span className="text-brand-400">{quote.vehicle}</span>
                        <span className="hidden sm:inline text-slate-700">•</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(quote.created_at).toLocaleDateString()}</span>
                     </div>
                   </div>
                 </div>

                 <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/3 px-2 sm:px-0">
                   <div className="text-right">
                     <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">Total</div>
                     <div className="text-lg font-black text-white">${quote.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                   </div>
                   <div className={`px-3 py-1 rounded-md text-[10px] uppercase font-bold tracking-widest ${
                      quote.status === 'sent' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      quote.status === 'draft' ? 'bg-slate-800 text-slate-400 border border-slate-700' :
                      'bg-slate-800 text-slate-400'
                   }`}>
                     {quote.status}
                   </div>
                 </div>
              </div>
           ))
        )}
      </div>
    </div>
  );
};

export default Quotes;
