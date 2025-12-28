import QuoteCalculator from '../components/Quote/QuoteCalculator';

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm text-slate-400">Welcome back</p>
        <h1 className="text-3xl font-semibold">Dealership performance overview</h1>
      </header>
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-lg font-semibold">Lead pipeline</h2>
          <p className="mt-2 text-sm text-slate-400">
            120 active leads · 34 high-intent · 8 awaiting compliance review
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              { label: 'Inbound chat', value: 28 },
              { label: 'Website forms', value: 41 },
              { label: 'Marketplace feeds', value: 19 },
              { label: 'Referrals', value: 12 }
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm text-slate-400">{item.label}</p>
                <p className="text-2xl font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </section>
        <QuoteCalculator />
      </div>
    </div>
  );
};

export default Dashboard;
