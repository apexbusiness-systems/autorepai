const Inventory = () => {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Inventory</h1>
        <p className="text-sm text-slate-400">Track VINs, pricing, and multi-source sync.</p>
      </header>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-sm text-slate-300">
        Inventory sync status: <span className="text-brand-500">vAuto feed connected</span> ·
        Next refresh in 12 minutes.
      </div>
    </div>
  );
};

export default Inventory;
