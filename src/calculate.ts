const PRECISION: number = 3;

export function calculate(number: string, exchangeRate: string): string {
  return (parseFloat(number) * parseFloat(exchangeRate))
    .toFixed(PRECISION);
}

export function calculateReverse(number: string, exchangeRate: string): string {
  return (parseFloat(number) / parseFloat(exchangeRate))
    .toFixed(PRECISION);
}