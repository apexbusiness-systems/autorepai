import { describe, expect, it } from 'vitest';
import { calculateQuoteTotals, type QuoteInput } from '../../src/lib/taxCalculator';

describe('Canadian Tax Calculator', () => {
  const baseInput: QuoteInput = {
    vehiclePrice: 50000,
    tradeInValue: 10000,
    downPayment: 5000,
    fees: 500,
    province: 'ON'
  };

  describe('Province Tax Rates', () => {
    it('applies Ontario HST at 13%', () => {
      const result = calculateQuoteTotals({ ...baseInput, province: 'ON' });
      expect(result.taxRate).toBe(0.13);
    });

    it('applies British Columbia PST+GST at 12%', () => {
      const result = calculateQuoteTotals({ ...baseInput, province: 'BC' });
      expect(result.taxRate).toBe(0.12);
    });

    it('applies Alberta GST at 5%', () => {
      const result = calculateQuoteTotals({ ...baseInput, province: 'AB' });
      expect(result.taxRate).toBe(0.05);
    });

    it('applies Saskatchewan PST+GST at 11%', () => {
      const result = calculateQuoteTotals({ ...baseInput, province: 'SK' });
      expect(result.taxRate).toBe(0.11);
    });

    it('applies Manitoba PST+GST at 12%', () => {
      const result = calculateQuoteTotals({ ...baseInput, province: 'MB' });
      expect(result.taxRate).toBe(0.12);
    });

    it('applies Quebec QST+GST at 14.975%', () => {
      const result = calculateQuoteTotals({ ...baseInput, province: 'QC' });
      expect(result.taxRate).toBe(0.14975);
    });

    it('defaults to 13% for unknown province', () => {
      const result = calculateQuoteTotals({ ...baseInput, province: 'XX' });
      expect(result.taxRate).toBe(0.13);
    });
  });

  describe('Taxable Amount Calculation', () => {
    it('calculates taxable amount as (vehiclePrice - tradeInValue) + fees', () => {
      // 50000 - 10000 + 500 = 40500
      const result = calculateQuoteTotals(baseInput);
      expect(result.taxableAmount).toBe(40500);
    });

    it('prevents negative taxable amount when trade-in exceeds vehicle price', () => {
      const input: QuoteInput = {
        vehiclePrice: 10000,
        tradeInValue: 15000,
        downPayment: 0,
        fees: 500,
        province: 'ON'
      };
      // max(10000 - 15000, 0) + 500 = 0 + 500 = 500
      const result = calculateQuoteTotals(input);
      expect(result.taxableAmount).toBe(500);
    });

    it('handles zero trade-in correctly', () => {
      const input: QuoteInput = {
        ...baseInput,
        tradeInValue: 0
      };
      // 50000 - 0 + 500 = 50500
      const result = calculateQuoteTotals(input);
      expect(result.taxableAmount).toBe(50500);
    });

    it('handles zero fees correctly', () => {
      const input: QuoteInput = {
        ...baseInput,
        fees: 0
      };
      // 50000 - 10000 + 0 = 40000
      const result = calculateQuoteTotals(input);
      expect(result.taxableAmount).toBe(40000);
    });
  });

  describe('Tax Total Calculation', () => {
    it('calculates tax as taxableAmount * taxRate', () => {
      // taxableAmount = 40500, taxRate = 0.13
      // taxTotal = 40500 * 0.13 = 5265
      const result = calculateQuoteTotals(baseInput);
      expect(result.taxTotal).toBe(5265);
    });

    it('calculates correct tax for Alberta (lowest rate)', () => {
      const input: QuoteInput = { ...baseInput, province: 'AB' };
      // taxableAmount = 40500, taxRate = 0.05
      // taxTotal = 40500 * 0.05 = 2025
      const result = calculateQuoteTotals(input);
      expect(result.taxTotal).toBe(2025);
    });

    it('calculates correct tax for Quebec (highest rate)', () => {
      const input: QuoteInput = { ...baseInput, province: 'QC' };
      // taxableAmount = 40500, taxRate = 0.14975
      // taxTotal = 40500 * 0.14975 = 6064.875
      const result = calculateQuoteTotals(input);
      expect(result.taxTotal).toBeCloseTo(6064.875, 2);
    });
  });

  describe('Total Due Calculation', () => {
    it('calculates total due as taxableAmount + taxTotal - downPayment', () => {
      // taxableAmount = 40500, taxTotal = 5265, downPayment = 5000
      // totalDue = 40500 + 5265 - 5000 = 40765
      const result = calculateQuoteTotals(baseInput);
      expect(result.totalDue).toBe(40765);
    });

    it('handles zero down payment', () => {
      const input: QuoteInput = { ...baseInput, downPayment: 0 };
      // taxableAmount = 40500, taxTotal = 5265, downPayment = 0
      // totalDue = 40500 + 5265 - 0 = 45765
      const result = calculateQuoteTotals(input);
      expect(result.totalDue).toBe(45765);
    });

    it('handles large down payment (can result in negative total)', () => {
      const input: QuoteInput = {
        vehiclePrice: 10000,
        tradeInValue: 5000,
        downPayment: 10000,
        fees: 500,
        province: 'ON'
      };
      // taxableAmount = max(10000-5000, 0) + 500 = 5500
      // taxTotal = 5500 * 0.13 = 715
      // totalDue = 5500 + 715 - 10000 = -3785
      const result = calculateQuoteTotals(input);
      expect(result.totalDue).toBe(-3785);
    });
  });

  describe('Real-World Scenarios', () => {
    it('calculates correctly for a typical Ontario car purchase', () => {
      const input: QuoteInput = {
        vehiclePrice: 35000,
        tradeInValue: 8000,
        downPayment: 3000,
        fees: 599,
        province: 'ON'
      };
      const result = calculateQuoteTotals(input);

      // taxableAmount = max(35000-8000, 0) + 599 = 27599
      expect(result.taxableAmount).toBe(27599);

      // taxTotal = 27599 * 0.13 = 3587.87
      expect(result.taxTotal).toBeCloseTo(3587.87, 2);

      // totalDue = 27599 + 3587.87 - 3000 = 28186.87
      expect(result.totalDue).toBeCloseTo(28186.87, 2);
    });

    it('calculates correctly for a luxury vehicle in Quebec', () => {
      const input: QuoteInput = {
        vehiclePrice: 85000,
        tradeInValue: 20000,
        downPayment: 15000,
        fees: 1500,
        province: 'QC'
      };
      const result = calculateQuoteTotals(input);

      // taxableAmount = max(85000-20000, 0) + 1500 = 66500
      expect(result.taxableAmount).toBe(66500);

      // taxTotal = 66500 * 0.14975 = 9958.375
      expect(result.taxTotal).toBeCloseTo(9958.375, 2);

      // totalDue = 66500 + 9958.375 - 15000 = 61458.375
      expect(result.totalDue).toBeCloseTo(61458.375, 2);
    });

    it('calculates correctly for Alberta (no PST)', () => {
      const input: QuoteInput = {
        vehiclePrice: 28000,
        tradeInValue: 0,
        downPayment: 2000,
        fees: 450,
        province: 'AB'
      };
      const result = calculateQuoteTotals(input);

      // taxableAmount = 28000 + 450 = 28450
      expect(result.taxableAmount).toBe(28450);

      // taxTotal = 28450 * 0.05 = 1422.5
      expect(result.taxTotal).toBe(1422.5);

      // totalDue = 28450 + 1422.5 - 2000 = 27872.5
      expect(result.totalDue).toBe(27872.5);
    });
  });

  describe('Edge Cases', () => {
    it('handles all zeros', () => {
      const input: QuoteInput = {
        vehiclePrice: 0,
        tradeInValue: 0,
        downPayment: 0,
        fees: 0,
        province: 'ON'
      };
      const result = calculateQuoteTotals(input);
      expect(result.taxableAmount).toBe(0);
      expect(result.taxTotal).toBe(0);
      expect(result.totalDue).toBe(0);
    });

    it('handles very large numbers', () => {
      const input: QuoteInput = {
        vehiclePrice: 500000,
        tradeInValue: 100000,
        downPayment: 50000,
        fees: 5000,
        province: 'ON'
      };
      const result = calculateQuoteTotals(input);

      // taxableAmount = 400000 + 5000 = 405000
      expect(result.taxableAmount).toBe(405000);

      // taxTotal = 405000 * 0.13 = 52650
      expect(result.taxTotal).toBe(52650);

      // totalDue = 405000 + 52650 - 50000 = 407650
      expect(result.totalDue).toBe(407650);
    });

    it('handles decimal inputs', () => {
      const input: QuoteInput = {
        vehiclePrice: 35999.99,
        tradeInValue: 8500.50,
        downPayment: 3000.25,
        fees: 599.99,
        province: 'ON'
      };
      const result = calculateQuoteTotals(input);

      // taxableAmount = max(35999.99-8500.50, 0) + 599.99 = 28099.48
      expect(result.taxableAmount).toBeCloseTo(28099.48, 2);
    });
  });
});
