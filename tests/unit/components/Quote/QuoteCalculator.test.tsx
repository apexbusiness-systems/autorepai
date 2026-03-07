import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuoteCalculator from '@/components/Quote/QuoteCalculator';
import { describe, it, expect } from 'vitest';

describe('QuoteCalculator', () => {
  it('renders with default values and correct initial calculations', () => {
    render(<QuoteCalculator />);

    // Check initial values in inputs
    expect(screen.getByLabelText(/Vehicle price/i)).toHaveValue(45000);
    expect(screen.getByLabelText(/Trade-in value/i)).toHaveValue(5000);
    expect(screen.getByLabelText(/Down payment/i)).toHaveValue(3500);
    expect(screen.getByLabelText(/Fees/i)).toHaveValue(499);
    expect(screen.getByLabelText(/Province/i)).toHaveValue('ON');

    // Check calculated totals
    // Default ON tax rate is 13%
    expect(screen.getByText(/13.00%/)).toBeInTheDocument();

    // taxableAmount = (45000 - 5000) + 499 = 40499
    expect(screen.getByText(/\$40499.00/)).toBeInTheDocument();

    // taxTotal = 40499 * 0.13 = 5264.87
    expect(screen.getByText(/\$5264.87/)).toBeInTheDocument();

    // totalDue = 40499 + 5264.87 - 3500 = 42263.87
    expect(screen.getByText(/\$42263.87/)).toBeInTheDocument();
  });

  it('updates totals when vehicle price changes', async () => {
    const user = userEvent.setup();
    render(<QuoteCalculator />);

    const vehiclePriceInput = screen.getByLabelText(/Vehicle price/i);

    await user.clear(vehiclePriceInput);
    await user.type(vehiclePriceInput, '50000');

    // New calculation:
    // taxableAmount = (50000 - 5000) + 499 = 45499
    // taxTotal = 45499 * 0.13 = 5914.87
    // totalDue = 45499 + 5914.87 - 3500 = 47913.87

    expect(screen.getByText(/\$45499.00/)).toBeInTheDocument();
    expect(screen.getByText(/\$5914.87/)).toBeInTheDocument();
    expect(screen.getByText(/\$47913.87/)).toBeInTheDocument();
  });

  it('updates totals when trade-in value changes', async () => {
    const user = userEvent.setup();
    render(<QuoteCalculator />);

    const tradeInInput = screen.getByLabelText(/Trade-in value/i);

    await user.clear(tradeInInput);
    await user.type(tradeInInput, '10000');

    // New calculation:
    // taxableAmount = (45000 - 10000) + 499 = 35499
    // taxTotal = 35499 * 0.13 = 4614.87
    // totalDue = 35499 + 4614.87 - 3500 = 36613.87

    expect(screen.getByText(/\$35499.00/)).toBeInTheDocument();
    expect(screen.getByText(/\$4614.87/)).toBeInTheDocument();
    expect(screen.getByText(/\$36613.87/)).toBeInTheDocument();
  });

  it('updates totals when province changes', async () => {
    const user = userEvent.setup();
    render(<QuoteCalculator />);

    const provinceSelect = screen.getByLabelText(/Province/i);

    await user.selectOptions(provinceSelect, 'AB'); // AB tax rate is 5%

    // Default ON (13%) -> AB (5%)
    // taxableAmount = 40499 (same as default)
    // taxTotal = 40499 * 0.05 = 2024.95
    // totalDue = 40499 + 2024.95 - 3500 = 39023.95

    expect(screen.getByText(/5.00%/)).toBeInTheDocument();
    expect(screen.getByText(/\$2024.95/)).toBeInTheDocument();
    expect(screen.getByText(/\$39023.95/)).toBeInTheDocument();
  });

  it('handles zero values correctly', async () => {
    const user = userEvent.setup();
    render(<QuoteCalculator />);

    const fields = [
      { label: /Vehicle price/i, value: '0' },
      { label: /Trade-in value/i, value: '0' },
      { label: /Down payment/i, value: '0' },
      { label: /Fees/i, value: '0' }
    ];

    for (const field of fields) {
      const input = screen.getByLabelText(field.label);
      await user.clear(input);
      await user.type(input, field.value);
    }

    // Calculation:
    // taxableAmount = (0 - 0) + 0 = 0
    // taxTotal = 0 * 0.13 = 0
    // totalDue = 0 + 0 - 0 = 0

    expect(screen.getByText(/Tax rate/i).nextElementSibling).toHaveTextContent('13.00%');
    expect(screen.getByText(/Taxable amount/i).nextElementSibling).toHaveTextContent('$0.00');
    expect(screen.getByText(/Taxes/i).nextElementSibling).toHaveTextContent('$0.00');
    expect(screen.getByText(/Total due/i).nextElementSibling).toHaveTextContent('$0.00');
  });

  it('ensures taxable amount is not negative when trade-in exceeds vehicle price', async () => {
    const user = userEvent.setup();
    render(<QuoteCalculator />);

    const vehiclePriceInput = screen.getByLabelText(/Vehicle price/i);
    const tradeInInput = screen.getByLabelText(/Trade-in value/i);

    await user.clear(vehiclePriceInput);
    await user.type(vehiclePriceInput, '10000');
    await user.clear(tradeInInput);
    await user.type(tradeInInput, '15000');

    // Calculation:
    // taxableAmount = max(10000 - 15000, 0) + 499 = 0 + 499 = 499
    // taxTotal = 499 * 0.13 = 64.87
    // totalDue = 499 + 64.87 - 3500 = -2936.13

    expect(screen.getByText(/\$499.00/)).toBeInTheDocument();
    expect(screen.getByText(/\$64.87/)).toBeInTheDocument();
    expect(screen.getByText(/\$-2936.13/)).toBeInTheDocument();
  });
});
