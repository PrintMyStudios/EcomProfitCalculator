import { calculateProfit } from './fees';

export interface BatchTier {
  quantity: number;
  unitCost: number;
  profitPerUnit: number;
  totalProfit: number;
  margin: number;
}

export interface BulkDiscountTier {
  minQty: number;
  discountPercent: number;
}

export interface BatchPricingParams {
  baseUnitCost: number;      // Cost per unit in minor units
  fixedCosts: number;        // One-time fixed costs (setup, etc.) in minor units
  salePrice: number;         // Sale price per unit in minor units
  feeCalculator: (price: number, qty: number) => number;  // Function to calculate fees
  vatRate: number;
  isVatRegistered: boolean;
  bulkDiscountTiers?: BulkDiscountTier[];
  quantities?: number[];
}

const DEFAULT_QUANTITIES = [1, 5, 10, 25, 50, 100];

/**
 * Calculate profit at different production/order quantities
 */
export function calculateBatchPricing(params: BatchPricingParams): BatchTier[] {
  const {
    baseUnitCost,
    fixedCosts,
    salePrice,
    feeCalculator,
    vatRate,
    isVatRegistered,
    bulkDiscountTiers = [],
    quantities = DEFAULT_QUANTITIES,
  } = params;

  return quantities.map((quantity) => {
    // Apply bulk discount if applicable
    let unitCost = baseUnitCost;
    for (const tier of bulkDiscountTiers.sort((a, b) => b.minQty - a.minQty)) {
      if (quantity >= tier.minQty) {
        unitCost = Math.round(baseUnitCost * (1 - tier.discountPercent / 100));
        break;
      }
    }

    // Calculate total cost including fixed costs spread across units
    const fixedCostPerUnit = quantity > 0 ? Math.round(fixedCosts / quantity) : 0;
    const totalUnitCost = unitCost + fixedCostPerUnit;

    // Calculate fees for this quantity
    const fees = feeCalculator(salePrice, quantity);
    const feesPerUnit = Math.round(fees / quantity);

    // Calculate profit
    const revenue = salePrice;
    const { profit: profitPerUnit, margin } = calculateProfit({
      revenue,
      productCost: totalUnitCost,
      platformFees: feesPerUnit,
      vatRate,
      isVatRegistered,
    });

    const totalProfit = profitPerUnit * quantity;

    return {
      quantity,
      unitCost: totalUnitCost,
      profitPerUnit,
      totalProfit,
      margin,
    };
  });
}

/**
 * Find the most profitable quantity tier
 */
export function findMostProfitableQuantity(tiers: BatchTier[]): BatchTier | null {
  if (tiers.length === 0) return null;

  return tiers.reduce((best, current) => {
    // Consider margin as primary metric, with total profit as tiebreaker
    if (current.margin > best.margin) return current;
    if (current.margin === best.margin && current.totalProfit > best.totalProfit) return current;
    return best;
  });
}

/**
 * Get quantity where profit per unit is maximized (due to bulk discounts)
 */
export function findOptimalBulkQuantity(tiers: BatchTier[]): BatchTier | null {
  if (tiers.length === 0) return null;

  return tiers.reduce((best, current) => {
    if (current.profitPerUnit > best.profitPerUnit) return current;
    return best;
  });
}

/**
 * Calculate break-even quantity (where total profit covers fixed costs)
 */
export function calculateBreakEvenQuantity(params: {
  baseUnitCost: number;
  salePrice: number;
  fixedCosts: number;
  feePerUnit: number;
  vatRate: number;
  isVatRegistered: boolean;
}): number {
  const { baseUnitCost, salePrice, fixedCosts, feePerUnit, vatRate, isVatRegistered } = params;

  // Calculate profit per unit without fixed costs
  const { profit: profitPerUnit } = calculateProfit({
    revenue: salePrice,
    productCost: baseUnitCost,
    platformFees: feePerUnit,
    vatRate,
    isVatRegistered,
  });

  if (profitPerUnit <= 0) {
    return Infinity; // Can never break even
  }

  return Math.ceil(fixedCosts / profitPerUnit);
}
