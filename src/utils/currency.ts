// Default currency — change this when multi-currency support is added
export const DEFAULT_CURRENCY = 'INR';

export function formatCurrency(value: number, currency = DEFAULT_CURRENCY): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
