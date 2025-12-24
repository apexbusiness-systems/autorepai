import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

const Quotes = () => {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Quotes</h1>
          <p className="text-sm text-slate-400">
            Version-controlled quotes with Canadian tax calculations.
          </p>
        </div>
        <Button asChild size="sm">
          <Link to="/app/quotes/new">New quote</Link>
        </Button>
      </header>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-sm text-slate-300">
        No active quotes yet. Start a new quote to generate PDF proposals.
      </div>
    </div>
  );
};

export default Quotes;
