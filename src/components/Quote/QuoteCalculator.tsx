import { useMemo, useState } from 'react';
import { Button } from '../ui/button';
import { calculateQuoteTotals, type QuoteInput } from '../../lib/taxCalculator';

const defaultInput: QuoteInput = {
  vehiclePrice: 45000,
  tradeInValue: 5000,
  downPayment: 3500,
  province: 'ON',
  fees: 499
};

const QuoteCalculator = () => {
  const [input, setInput] = useState<QuoteInput>(defaultInput);

  const totals = useMemo(() => calculateQuoteTotals(input), [input]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">Quote Builder</p>
          <h2 className="text-lg font-semibold">Canadian tax calculator</h2>
        </div>
        <Button size="sm">Generate PDF</Button>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {([
          { label: 'Vehicle price', key: 'vehiclePrice' },
          { label: 'Trade-in value', key: 'tradeInValue' },
          { label: 'Down payment', key: 'downPayment' },
          { label: 'Fees', key: 'fees' }
        ] as const).map((field) => (
          <label key={field.key} className="text-sm">
            {field.label}
            <input
              type="number"
              className="mt-2 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2"
              value={input[field.key]}
              onChange={(event) =>
                setInput((prev) => ({
                  ...prev,
                  [field.key]: Number(event.target.value)
                }))
              }
            />
          </label>
        ))}
        <label className="text-sm">
          Province
          <select
            className="mt-2 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2"
            value={input.province}
            onChange={(event) => setInput((prev) => ({ ...prev, province: event.target.value }))}
          >
            {['ON', 'BC', 'AB', 'SK', 'MB', 'QC'].map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="mt-6 space-y-2 text-sm text-slate-200">
        <div className="flex justify-between">
          <span>Tax rate</span>
          <span>{(totals.taxRate * 100).toFixed(2)}%</span>
        </div>
        <div className="flex justify-between">
          <span>Taxable amount</span>
          <span>${totals.taxableAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Taxes</span>
          <span>${totals.taxTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Total due</span>
          <span>${totals.totalDue.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default QuoteCalculator;
