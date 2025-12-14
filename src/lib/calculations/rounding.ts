export type RoundingMode = 'nearest_99' | 'nearest_50' | 'nearest_00' | 'increment' | 'none';

interface RoundingOptions {
  mode: RoundingMode;
  increment?: number; // for 'increment' mode, in minor units (e.g., 50 for £0.50)
  customEnding?: number; // for custom endings (e.g., 95 for .95)
}

/**
 * Round a price UP to protect margins
 * All values in minor units
 */
export function roundPrice(price: number, options: RoundingOptions): number {
  const { mode, increment, customEnding } = options;

  if (mode === 'none') {
    return price;
  }

  if (mode === 'increment' && increment) {
    // Round up to nearest increment
    return Math.ceil(price / increment) * increment;
  }

  // For ending-based rounding, work with the major unit portion
  const majorUnits = Math.floor(price / 100);
  const minorPart = price % 100;

  let targetEnding: number;

  switch (mode) {
    case 'nearest_99':
      targetEnding = customEnding ?? 99;
      break;
    case 'nearest_50':
      targetEnding = 50;
      break;
    case 'nearest_00':
      targetEnding = 0;
      break;
    default:
      return price;
  }

  // If we're already at or past the target ending, go to next major unit
  if (minorPart >= targetEnding && targetEnding > 0) {
    return (majorUnits + 1) * 100 + targetEnding;
  }

  // For .00 ending, always round up to next whole unit if there's any remainder
  if (targetEnding === 0 && minorPart > 0) {
    return (majorUnits + 1) * 100;
  }

  return majorUnits * 100 + targetEnding;
}

/**
 * Generate boost plan: 3 price points from near break-even to target
 */
export function generateBoostPlan(
  breakEvenPrice: number,
  targetPrice: number,
  roundingOptions: RoundingOptions
): { price: number; step: string }[] {
  const buffer = Math.round(breakEvenPrice * 0.05); // 5% buffer above break-even
  const startPrice = breakEvenPrice + buffer;
  const range = targetPrice - startPrice;

  const steps = [
    { price: roundPrice(startPrice, roundingOptions), step: 'Launch' },
    { price: roundPrice(startPrice + range * 0.5, roundingOptions), step: 'Growth' },
    { price: roundPrice(targetPrice, roundingOptions), step: 'Target' },
  ];

  // Ensure each step is higher than the previous
  for (let i = 1; i < steps.length; i++) {
    if (steps[i].price <= steps[i - 1].price) {
      steps[i].price = steps[i - 1].price + 100; // Add 1 major unit minimum
    }
  }

  return steps;
}
