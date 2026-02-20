export function formatPrice(amount: number, currency: string, lang?: string): string {
  const formatter = new Intl.NumberFormat(lang ?? 'en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  });
  return formatter.format(amount);
}