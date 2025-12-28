const Settings = () => {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-slate-400">
          Configure organizations, compliance jurisdictions, and security settings.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-sm text-slate-300">
          <p className="font-semibold text-slate-100">Security</p>
          <p className="mt-2">RLS enabled · MFA rollout scheduled</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-sm text-slate-300">
          <p className="font-semibold text-slate-100">Compliance</p>
          <p className="mt-2">CASL + TCPA audit logs active</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
