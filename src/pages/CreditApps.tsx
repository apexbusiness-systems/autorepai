const CreditApps = () => {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Credit Applications</h1>
        <p className="text-sm text-slate-400">
          FCRA-compliant applications with consent timestamps and audit trails.
        </p>
      </header>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-sm text-slate-300">
        4 pending applications · 2 awaiting manager review.
      </div>
    </div>
  );
};

export default CreditApps;
