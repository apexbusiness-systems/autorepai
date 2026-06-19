import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import QuoteCalculator from '../../../src/components/Quote/QuoteCalculator';

describe('QuoteCalculator', () => {
  it('renders with default values', () => {
    render(<QuoteCalculator />);

    // Check for title
    expect(screen.getByText('Canadian tax calculator')).toBeInTheDocument();

    // Check for default input values
    expect(screen.getByLabelText(/Vehicle price/i)).toHaveValue(45000);
    expect(screen.getByLabelText(/Trade-in value/i)).toHaveValue(5000);
    expect(screen.getByLabelText(/Down payment/i)).toHaveValue(3500);
    expect(screen.getByLabelText(/Fees/i)).toHaveValue(499);
    expect(screen.getByLabelText(/Province/i)).toHaveValue('ON');

    // Check for calculated totals (ON 13%)
    expect(screen.getByText('13.00%')).toBeInTheDocument();
    expect(screen.getByText('$40499.00')).toBeInTheDocument();
    expect(screen.getByText('$5264.87')).toBeInTheDocument();
    expect(screen.getByText('$42263.87')).toBeInTheDocument();
  });

  it('updates totals when vehicle price changes', () => {
    render(<QuoteCalculator />);
    const vehiclePriceInput = screen.getByLabelText(/Vehicle price/i);

    fireEvent.change(vehiclePriceInput, { target: { value: '50000' } });

    // New taxableAmount = (50000 - 5000) + 499 = 45499
    // taxTotal = 45499 * 0.13 = 5914.87
    // totalDue = (45499 + 5914.87) - 3500 = 47913.87

    expect(screen.getByText('$45499.00')).toBeInTheDocument();
    expect(screen.getByText('$5914.87')).toBeInTheDocument();
    expect(screen.getByText('$47913.87')).toBeInTheDocument();
  });

  it('updates tax rate and totals when province changes', () => {
    render(<QuoteCalculator />);
    const provinceSelect = screen.getByLabelText(/Province/i);

    fireEvent.change(provinceSelect, { target: { value: 'AB' } });

    // AB tax rate is 5%
    // taxableAmount = (45000 - 5000) + 499 = 40499 (unchanged)
    // taxTotal = 40499 * 0.05 = 2024.95
    // totalDue = (40499 + 2024.95) - 3500 = 39023.95

    expect(screen.getByText('5.00%')).toBeInTheDocument();
    expect(screen.getByText('$2024.95')).toBeInTheDocument();
    expect(screen.getByText('$39023.95')).toBeInTheDocument();
  });

  it('updates totals when trade-in and down payment change', () => {
    render(<QuoteCalculator />);

    fireEvent.change(screen.getByLabelText(/Trade-in value/i), { target: { value: '10000' } });
    fireEvent.change(screen.getByLabelText(/Down payment/i), { target: { value: '0' } });

    // taxableAmount = (45000 - 10000) + 499 = 35499
    // taxTotal = 35499 * 0.13 = 4614.87
    // totalDue = (35499 + 4614.87) - 0 = 40113.87

    expect(screen.getByText('$35499.00')).toBeInTheDocument();
    expect(screen.getByText('$4614.87')).toBeInTheDocument();
    expect(screen.getByText('$40113.87')).toBeInTheDocument();
  });
});
