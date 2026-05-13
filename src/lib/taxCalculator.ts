export type QuoteInput = {
  vehiclePrice: number;
  tradeInValue: number;
  downPayment: number;
  fees: number;
  province: string;
};

const PROVINCE_TAX_RATES: Record<string, number> = {
  ON: 0.13,
  BC: 0.12,
  AB: 0.05,
  SK: 0.11,
  MB: 0.12,
  QC: 0.14975
};

export const calculateQuoteTotals = (input: QuoteInput) => {
  const taxRate = PROVINCE_TAX_RATES[input.province] ?? 0.13;
  const taxableAmount = Math.max(input.vehiclePrice - input.tradeInValue, 0) + input.fees;
  const taxTotal = taxableAmount * taxRate;
  const totalDue = taxableAmount + taxTotal - input.downPayment;

  return {
    taxRate,
    taxableAmount,
    taxTotal,
    totalDue
  };
};
