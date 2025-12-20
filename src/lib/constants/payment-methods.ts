import type { PlatformKey } from '@/types';

export type PaymentMethod = 'platform_included' | 'paypal' | 'stripe' | 'square' | 'manual';

export interface PaymentMethodConfig {
  key: PaymentMethod;
  label: string;
  percentageFee: number;  // e.g., 3.6 for 3.6%
  fixedFee: number;       // in minor units (pence/cents)
  includedInPlatforms: PlatformKey[];
}

export const PAYMENT_METHODS: Record<PaymentMethod, PaymentMethodConfig> = {
  platform_included: {
    key: 'platform_included',
    label: 'Included in Platform',
    percentageFee: 0,
    fixedFee: 0,
    includedInPlatforms: ['etsy', 'ebay', 'shopify', 'tiktok'],
  },
  paypal: {
    key: 'paypal',
    label: 'PayPal',
    percentageFee: 3.6,
    fixedFee: 30, // 30p
    includedInPlatforms: [],
  },
  stripe: {
    key: 'stripe',
    label: 'Stripe',
    percentageFee: 2.9,
    fixedFee: 30, // 30p
    includedInPlatforms: [],
  },
  square: {
    key: 'square',
    label: 'Square',
    percentageFee: 2.7,
    fixedFee: 20, // 20p
    includedInPlatforms: [],
  },
  manual: {
    key: 'manual',
    label: 'Cash / Manual',
    percentageFee: 0,
    fixedFee: 0,
    includedInPlatforms: [],
  },
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  platform_included: 'Included in Platform',
  paypal: 'PayPal',
  stripe: 'Stripe',
  square: 'Square',
  manual: 'Cash / Manual',
};

/**
 * Check if a platform includes payment processing in its fees
 */
export function platformIncludesPaymentProcessing(platformKey: PlatformKey): boolean {
  return PAYMENT_METHODS.platform_included.includedInPlatforms.includes(platformKey);
}

/**
 * Calculate payment processing fees
 * @param orderTotal - Total order amount in minor units
 * @param paymentMethod - Selected payment method
 * @returns Fee amount in minor units
 */
export function calculatePaymentFees(
  orderTotal: number,
  paymentMethod: PaymentMethod
): { total: number; breakdown: { label: string; amount: number }[] } {
  const config = PAYMENT_METHODS[paymentMethod];

  if (!config || paymentMethod === 'platform_included' || paymentMethod === 'manual') {
    return { total: 0, breakdown: [] };
  }

  const percentageFee = Math.round((orderTotal * config.percentageFee) / 100);
  const fixedFee = config.fixedFee;
  const total = percentageFee + fixedFee;

  const breakdown: { label: string; amount: number }[] = [];

  if (percentageFee > 0) {
    breakdown.push({
      label: `${config.label} (${config.percentageFee}%)`,
      amount: percentageFee,
    });
  }

  if (fixedFee > 0) {
    breakdown.push({
      label: `${config.label} fixed fee`,
      amount: fixedFee,
    });
  }

  return { total, breakdown };
}
