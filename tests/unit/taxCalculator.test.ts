import { describe, expect, it } from 'vitest';
import { calculateQuoteTotals } from '../../src/lib/taxCalculator';

describe('calculateQuoteTotals', () => {
  it('calculates totals correctly for Ontario (ON)', () => {
    const input = {
      vehiclePrice: 30000,
      tradeInValue: 10000,
      downPayment: 5000,
      fees: 500,
      province: 'ON'
    };

    const result = calculateQuoteTotals(input);

    expect(result.taxRate).toBe(0.13);
    expect(result.taxableAmount).toBe(20500);
    expect(result.taxTotal).toBe(2665);
    expect(result.totalDue).toBe(18165);
  });

  it('calculates totals correctly for Alberta (AB)', () => {
    const input = {
      vehiclePrice: 30000,
      tradeInValue: 10000,
      downPayment: 5000,
      fees: 500,
      province: 'AB'
    };

    const result = calculateQuoteTotals(input);

    expect(result.taxRate).toBe(0.05);
    expect(result.taxableAmount).toBe(20500);
    expect(result.taxTotal).toBe(1025);
    expect(result.totalDue).toBe(16525);
  });

  it('calculates totals correctly for Quebec (QC)', () => {
    const input = {
      vehiclePrice: 30000,
      tradeInValue: 10000,
      downPayment: 5000,
      fees: 500,
      province: 'QC'
    };

    const result = calculateQuoteTotals(input);

    expect(result.taxRate).toBe(0.14975);
    expect(result.taxableAmount).toBe(20500);
    expect(result.taxTotal).toBe(3069.875);
    expect(result.totalDue).toBe(18569.875);
  });

  it('uses default tax rate for unknown province', () => {
    const input = {
      vehiclePrice: 10000,
      tradeInValue: 0,
      downPayment: 0,
      fees: 0,
      province: 'XX'
    };

    const result = calculateQuoteTotals(input);

    expect(result.taxRate).toBe(0.13);
    expect(result.taxableAmount).toBe(10000);
    expect(result.taxTotal).toBe(1300);
    expect(result.totalDue).toBe(11300);
  });

  it('handles trade-in value higher than vehicle price', () => {
    const input = {
      vehiclePrice: 20000,
      tradeInValue: 25000,
      downPayment: 0,
      fees: 500,
      province: 'ON'
    };

    const result = calculateQuoteTotals(input);

    // taxableAmount = max(20000 - 25000, 0) + 500 = 500
    expect(result.taxableAmount).toBe(500);
    expect(result.taxTotal).toBe(500 * 0.13);
    expect(result.totalDue).toBe(500 + 65);
  });

  it('handles down payment correctly', () => {
    const input = {
      vehiclePrice: 10000,
      tradeInValue: 0,
      downPayment: 11300,
      fees: 0,
      province: 'ON'
    };

    const result = calculateQuoteTotals(input);

    expect(result.taxableAmount).toBe(10000);
    expect(result.taxTotal).toBe(1300);
    expect(result.totalDue).toBe(0);
  });

  it('handles down payment exceeding total cost', () => {
    const input = {
      vehiclePrice: 10000,
      tradeInValue: 0,
      downPayment: 15000,
      fees: 0,
      province: 'ON'
    };

    const result = calculateQuoteTotals(input);

    // taxableAmount = 10000, taxTotal = 1300, totalCost = 11300
    // totalDue should be 0, not -3700
    expect(result.totalDue).toBe(0);
  });

  it('handles zero fees', () => {
    const input = {
      vehiclePrice: 10000,
      tradeInValue: 0,
      downPayment: 0,
      fees: 0,
      province: 'ON'
    };

    const result = calculateQuoteTotals(input);

    expect(result.taxableAmount).toBe(10000);
    // fees is not returned in the result object, based on the code
  });
});
