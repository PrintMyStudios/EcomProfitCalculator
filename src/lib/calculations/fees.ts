import type { FeeTerm, CalculationInput } from '@/types';

interface FeeCalculationParams {
  itemPrice: number; // in minor units
  shippingCost: number; // in minor units
  quantity: number;
  fees: FeeTerm[];
}

interface FeeBreakdown {
  label: string;
  amount: number; // in minor units
}

/**
 * Calculate platform fees for a sale
 * All monetary values in minor units (pence/cents)
 */
export function calculatePlatformFees(params: FeeCalculationParams): {
  total: number;
  breakdown: FeeBreakdown[];
} {
  const { itemPrice, shippingCost, quantity, fees } = params;
  const subtotal = itemPrice + shippingCost;
  const breakdown: FeeBreakdown[] = [];

  for (const fee of fees) {
    let amount = 0;

    if (fee.type === 'percentage') {
      const base =
        fee.base === 'item'
          ? itemPrice
          : fee.base === 'shipping'
            ? shippingCost
            : subtotal;
      amount = Math.round((base * fee.value) / 100);
    } else {
      // Fixed fee
      amount = fee.base === 'item' ? fee.value * quantity : fee.value;
    }

    if (amount > 0) {
      breakdown.push({ label: fee.label, amount });
    }
  }

  const total = breakdown.reduce((sum, item) => sum + item.amount, 0);

  return { total, breakdown };
}

/**
 * Calculate profit and margin
 */
export function calculateProfit(params: {
  revenue: number; // in minor units (price + seller shipping if applicable)
  productCost: number; // in minor units
  platformFees: number; // in minor units
  vatRate: number; // percentage
  isVatRegistered: boolean;
}): {
  profit: number;
  margin: number;
  receiptsExVat?: number;
} {
  const { revenue, productCost, platformFees, vatRate, isVatRegistered } = params;

  if (isVatRegistered && vatRate > 0) {
    // VAT-registered: profit calculated on receipts excluding VAT
    const receiptsExVat = Math.round(revenue / (1 + vatRate / 100));
    const profit = receiptsExVat - productCost - platformFees;
    const margin = receiptsExVat > 0 ? (profit / receiptsExVat) * 100 : 0;

    return { profit, margin, receiptsExVat };
  }

  // Non-VAT: profit calculated on full revenue
  const profit = revenue - productCost - platformFees;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

  return { profit, margin };
}

/**
 * Find break-even price (where profit = 0)
 * Uses iterative approach for accuracy with complex fee structures
 */
export function calculateBreakEvenPrice(params: {
  productCost: number;
  shippingCost: number;
  sellerPaysShipping: boolean;
  fees: FeeTerm[];
  vatRate: number;
  isVatRegistered: boolean;
}): number {
  const { productCost, shippingCost, sellerPaysShipping, fees, vatRate, isVatRegistered } =
    params;

  // Start with a guess: product cost + 20%
  let price = Math.round(productCost * 1.2);
  const maxIterations = 100;
  const tolerance = 1; // 1 minor unit

  for (let i = 0; i < maxIterations; i++) {
    const shippingForFees = sellerPaysShipping ? shippingCost : 0;
    const { total: platformFees } = calculatePlatformFees({
      itemPrice: price,
      shippingCost: shippingForFees,
      quantity: 1,
      fees,
    });

    const revenue = price + shippingForFees;
    const { profit } = calculateProfit({
      revenue,
      productCost,
      platformFees,
      vatRate,
      isVatRegistered,
    });

    if (Math.abs(profit) <= tolerance) {
      return price;
    }

    // Adjust price based on profit
    price = Math.round(price - profit * 0.8);

    // Ensure price doesn't go negative
    if (price < 0) {
      price = 1;
    }
  }

  return price;
}

/**
 * Find price for target margin
 */
export function calculateTargetPrice(params: {
  productCost: number;
  shippingCost: number;
  sellerPaysShipping: boolean;
  fees: FeeTerm[];
  vatRate: number;
  isVatRegistered: boolean;
  targetMargin: number; // percentage
}): number {
  const {
    productCost,
    shippingCost,
    sellerPaysShipping,
    fees,
    vatRate,
    isVatRegistered,
    targetMargin,
  } = params;

  // Start with a guess
  let price = Math.round(productCost * (1 + targetMargin / 50));
  const maxIterations = 100;
  const tolerance = 0.1; // 0.1% margin tolerance

  for (let i = 0; i < maxIterations; i++) {
    const shippingForFees = sellerPaysShipping ? shippingCost : 0;
    const { total: platformFees } = calculatePlatformFees({
      itemPrice: price,
      shippingCost: shippingForFees,
      quantity: 1,
      fees,
    });

    const revenue = price + shippingForFees;
    const { margin } = calculateProfit({
      revenue,
      productCost,
      platformFees,
      vatRate,
      isVatRegistered,
    });

    if (Math.abs(margin - targetMargin) <= tolerance) {
      return price;
    }

    // Adjust price
    const adjustment = (targetMargin - margin) / 100;
    price = Math.round(price * (1 + adjustment));

    if (price < 0) {
      price = 1;
    }
  }

  return price;
}
