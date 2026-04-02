import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { Car, Search, SlidersHorizontal, PackageX } from 'lucide-react';
import { Input } from '../components/ui/Input';

const fetchInventory = async () => {
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
     return [
       { id: '1', year: 2024, make: 'Ford', model: 'F-150 Lariat', price: 65000, status: 'available', vin: '1FTFW1ED3P...' },
       { id: '2', year: 2023, make: 'Toyota', model: 'RAV4 Hybrid', price: 42000, status: 'available', vin: '2T3R1RFV8P...' },
       { id: '3', year: 2024, make: 'Honda', model: 'Civic Touring', price: 34500, status: 'pending', vin: '2HGFC2F62P...' }
     ];
  }

  const { data, error } = await supabase.from('inventory').select('*').order('created_at', { ascending: false }).limit(10);
  if (error) throw error;
  return data;
};

const Inventory = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: fetchInventory
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white tracking-tight">Inventory Intelligence</h1>
          <p className="text-sm text-brand-400 mt-1 uppercase tracking-widest font-bold">Track VINs, pricing, and multi-source sync.</p>
        </div>
        <div className="flex gap-3">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
             <Input placeholder="Search VIN, Make, Model..." className="pl-9 w-full sm:w-64 bg-slate-900 border-slate-800" />
           </div>
           <button className="h-10 px-4 rounded-md border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-brand-500 transition-colors flex items-center gap-2">
             <SlidersHorizontal className="h-4 w-4 text-brand-500" />
             <span className="hidden sm:inline">Filters</span>
           </button>
        </div>
      </header>

      <div className="rounded-xl border border-brand-500/30 bg-brand-500/5 px-6 py-4 flex items-center justify-between shadow-[0_0_15px_-3px_rgba(212,175,55,0.15)]">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse-slow"></div>
          <span className="text-sm text-slate-300">
            Live vAuto sync active · Next refresh in <span className="font-mono text-white">04:12</span>
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
           [...Array(6)].map((_, i) => (
              <div key={i} className="h-48 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse"></div>
           ))
        ) : data?.length === 0 ? (
           <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-500 border border-slate-800 border-dashed rounded-2xl">
             <PackageX className="h-12 w-12 mb-3 text-slate-700" />
             <p>No vehicles in inventory.</p>
             <p className="text-sm mt-1">Syncing from DMS...</p>
           </div>
        ) : (
           data?.map((vehicle) => (
              <div key={vehicle.id} className="group rounded-2xl border border-slate-800 bg-slate-900 hover:border-brand-500/50 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-brand-500/10">
                 <div className="h-32 bg-gradient-to-br from-slate-800 to-black flex items-center justify-center border-b border-slate-800">
                   <Car className="h-12 w-12 text-slate-700 group-hover:text-brand-500/50 transition-colors" />
                 </div>
                 <div className="p-5">
                   <div className="flex justify-between items-start mb-2">
                     <h3 className="font-bold text-white text-lg leading-tight group-hover:text-brand-400 transition-colors">
                       {vehicle.year} {vehicle.make} {vehicle.model}
                     </h3>
                     <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                        vehicle.status === 'available' ? 'bg-green-500/20 text-green-400' :
                        vehicle.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-slate-800 text-slate-400'
                     }`}>
                       {vehicle.status}
                     </span>
                   </div>
                   <div className="flex justify-between items-end mt-4">
                     <div className="text-xs text-slate-400 font-mono">VIN: {vehicle.vin}</div>
                     <div className="text-xl font-black text-white">${vehicle.price.toLocaleString()}</div>
                   </div>
                 </div>
              </div>
           ))
        )}
      </div>
    </div>
  );
};

export default Inventory;
