import QuoteCalculator from '../components/Quote/QuoteCalculator';

const QuoteBuilder = () => {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Quote Builder</h1>
        <p className="text-sm text-slate-400">Create a compliant quote in seconds.</p>
      </header>
      <QuoteCalculator />
    </div>
  );
};

export default QuoteBuilder;
