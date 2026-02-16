import { memo, useCallback, useMemo, useState, type ChangeEvent } from 'react';
import { Button } from '../ui/button';
import { calculateQuoteTotals, type QuoteInput } from '../../lib/taxCalculator';

const defaultInput: QuoteInput = {
  vehiclePrice: 45000,
  tradeInValue: 5000,
  downPayment: 3500,
  province: 'ON',
  fees: 499
};

type NumericFieldKey = Exclude<keyof QuoteInput, 'province'>;

const INPUT_FIELDS: { label: string; key: NumericFieldKey }[] = [
  { label: 'Vehicle price', key: 'vehiclePrice' },
  { label: 'Trade-in value', key: 'tradeInValue' },
  { label: 'Down payment', key: 'downPayment' },
  { label: 'Fees', key: 'fees' }
];

const PROVINCES = ['ON', 'BC', 'AB', 'SK', 'MB', 'QC'];

// eslint-disable-next-line no-unused-vars
type NumericInputChangeHandler = (key: NumericFieldKey, value: number) => void;

interface NumericInputProps {
  label: string;
  fieldKey: NumericFieldKey;
  value: number;
  onChange: NumericInputChangeHandler;
}

const NumericInput = memo(({ label, fieldKey, value, onChange }: NumericInputProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(fieldKey, Number(e.target.value));
  };

  return (
    <label className="text-sm">
      {label}
      <input
        type="number"
        className="mt-2 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2"
        value={value}
        onChange={handleChange}
      />
    </label>
  );
});

NumericInput.displayName = 'NumericInput';

const QuoteCalculator = () => {
  const [input, setInput] = useState<QuoteInput>(defaultInput);

  const totals = useMemo(() => calculateQuoteTotals(input), [input]);

  const handleInputChange = useCallback((key: NumericFieldKey, value: number) => {
    setInput((prev) => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const handleProvinceChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setInput((prev) => ({ ...prev, province: value }));
  }, []);

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
        {INPUT_FIELDS.map((field) => (
          <NumericInput
            key={field.key}
            label={field.label}
            fieldKey={field.key}
            value={input[field.key]}
            onChange={handleInputChange}
          />
        ))}
        <label className="text-sm">
          Province
          <select
            className="mt-2 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2"
            value={input.province}
            onChange={handleProvinceChange}
          >
            {PROVINCES.map((province) => (
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
