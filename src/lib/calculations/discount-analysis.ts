import { calculateProfit } from './fees';

export interface DiscountAnalysisResult {
  discountPercent: number;
  discountedPrice: number;
  originalPrice: number;
  discount: number;
  fees: number;
  profit: number;
  margin: number;
  isProfitable: boolean;
}

export interface DiscountAnalysisParams {
  salePrice: number;           // Original sale price in minor units
  productCost: number;         // Product cost in minor units
  shippingCost: number;        // Shipping cost (if seller pays) in minor units
  sellerPaysShipping: boolean;
  feeCalculator: (price: number) => number;  // Function to calculate fees at any price
  vatRate: number;
  isVatRegistered: boolean;
  discountPercentages?: number[];
}

const DEFAULT_DISCOUNT_PERCENTAGES = [10, 15, 20, 25, 30, 40, 50];

/**
 * Calculate profit analysis at various discount levels
 */
export function calculateDiscountAnalysis(params: DiscountAnalysisParams): {
  results: DiscountAnalysisResult[];
  breakEvenDiscount: number;
  maxProfitableDiscount: number;
} {
  const {
    salePrice,
    productCost,
    shippingCost,
    sellerPaysShipping,
    feeCalculator,
    vatRate,
    isVatRegistered,
    discountPercentages = DEFAULT_DISCOUNT_PERCENTAGES,
  } = params;

  const results: DiscountAnalysisResult[] = [];
  let maxProfitableDiscount = 0;

  for (const discountPercent of discountPercentages) {
    const discountedPrice = Math.round(salePrice * (1 - discountPercent / 100));
    const discount = salePrice - discountedPrice;

    // Calculate fees at the discounted price
    const fees = feeCalculator(discountedPrice);

    // Calculate revenue (discounted price + shipping if seller pays)
    const revenue = discountedPrice + (sellerPaysShipping ? shippingCost : 0);

    // Calculate profit
    const { profit, margin } = calculateProfit({
      revenue,
      productCost,
      platformFees: fees,
      vatRate,
      isVatRegistered,
    });

    const isProfitable = profit > 0;

    if (isProfitable) {
      maxProfitableDiscount = discountPercent;
    }

    results.push({
      discountPercent,
      discountedPrice,
      originalPrice: salePrice,
      discount,
      fees,
      profit,
      margin,
      isProfitable,
    });
  }

  // Find break-even discount using binary search
  const breakEvenDiscount = findBreakEvenDiscount(params);

  return {
    results,
    breakEvenDiscount,
    maxProfitableDiscount,
  };
}

/**
 * Find the maximum discount percentage before loss using binary search
 */
function findBreakEvenDiscount(params: DiscountAnalysisParams): number {
  const {
    salePrice,
    productCost,
    shippingCost,
    sellerPaysShipping,
    feeCalculator,
    vatRate,
    isVatRegistered,
  } = params;

  // Check if already at loss at 0% discount
  const revenue0 = salePrice + (sellerPaysShipping ? shippingCost : 0);
  const fees0 = feeCalculator(salePrice);
  const { profit: profit0 } = calculateProfit({
    revenue: revenue0,
    productCost,
    platformFees: fees0,
    vatRate,
    isVatRegistered,
  });

  if (profit0 <= 0) {
    return 0; // Already at loss
  }

  // Binary search for break-even point
  let low = 0;
  let high = 100;
  const tolerance = 0.5; // 0.5% precision

  while (high - low > tolerance) {
    const mid = (low + high) / 2;
    const discountedPrice = Math.round(salePrice * (1 - mid / 100));
    const fees = feeCalculator(discountedPrice);
    const revenue = discountedPrice + (sellerPaysShipping ? shippingCost : 0);

    const { profit } = calculateProfit({
      revenue,
      productCost,
      platformFees: fees,
      vatRate,
      isVatRegistered,
    });

    if (profit > 0) {
      low = mid;
    } else {
      high = mid;
    }
  }

  // Round to 1 decimal place
  return Math.floor(low * 10) / 10;
}

/**
 * Get a summary description of discount analysis
 */
export function getDiscountSummary(analysis: {
  results: DiscountAnalysisResult[];
  breakEvenDiscount: number;
}): string {
  const profitableCount = analysis.results.filter(r => r.isProfitable).length;
  const totalCount = analysis.results.length;

  if (profitableCount === 0) {
    return 'Not profitable at any discount level';
  }

  if (profitableCount === totalCount) {
    return `Profitable at all tested discounts (up to ${Math.max(...analysis.results.map(r => r.discountPercent))}%)`;
  }

  return `Profitable up to ${analysis.breakEvenDiscount}% discount`;
}
