import LeadCaptureForm from '../components/Forms/LeadCaptureForm';

const Leads = () => {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Leads</h1>
        <p className="text-sm text-slate-400">
          Capture, score, and assign leads with compliance-first consent tracking.
        </p>
      </header>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-lg font-semibold">Lead capture</h2>
          <p className="mt-2 text-sm text-slate-400">
            All consent logs are recorded in the consents and consent_logs tables.
          </p>
          <div className="mt-4">
            <LeadCaptureForm />
          </div>
        </section>
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-lg font-semibold">Scoring summary</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li>High intent leads: 18</li>
            <li>Respond within 5 minutes: 62%</li>
            <li>AI-assisted follow-ups enabled</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Leads;
