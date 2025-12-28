const Inbox = () => {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Omnichannel Inbox</h1>
        <p className="text-sm text-slate-400">
          Manage chat, SMS, WhatsApp, and email in a single workspace.
        </p>
      </header>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-sm text-slate-300">
        Unified inbox is ready. Connect Twilio and SendGrid to enable live messaging.
      </div>
    </div>
  );
};

export default Inbox;
