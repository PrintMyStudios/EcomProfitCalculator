import type { PlatformTemplate, PlatformKey } from '@/types';

export const DEFAULT_PLATFORM_TEMPLATES: Record<PlatformKey, Omit<PlatformTemplate, 'id' | 'userId' | 'createdAt' | 'updatedAt'>> = {
  etsy: {
    name: 'Etsy',
    platformKey: 'etsy',
    fees: [
      { label: 'Transaction fee', type: 'percentage', base: 'subtotal', value: 6.5 },
      { label: 'Payment processing', type: 'percentage', base: 'subtotal', value: 4 },
      { label: 'Payment fixed fee', type: 'fixed', base: 'order', value: 20 }, // 20p
      { label: 'Listing fee', type: 'fixed', base: 'item', value: 15 }, // 15p
    ],
    vatOnShipping: true,
    isCustom: false,
  },
  ebay: {
    name: 'eBay',
    platformKey: 'ebay',
    fees: [
      { label: 'Final value fee', type: 'percentage', base: 'subtotal', value: 10 },
      { label: 'Payment processing', type: 'percentage', base: 'subtotal', value: 2.9 },
    ],
    vatOnShipping: true,
    isCustom: false,
  },
  amazon: {
    name: 'Amazon',
    platformKey: 'amazon',
    fees: [
      { label: 'Referral fee', type: 'percentage', base: 'item', value: 15 },
    ],
    vatOnShipping: false,
    isCustom: false,
  },
  shopify: {
    name: 'Shopify',
    platformKey: 'shopify',
    fees: [
      { label: 'Transaction fee', type: 'percentage', base: 'subtotal', value: 2.9 },
      { label: 'Payment processing', type: 'percentage', base: 'subtotal', value: 2.9 },
    ],
    vatOnShipping: true,
    isCustom: false,
  },
  tiktok: {
    name: 'TikTok Shop',
    platformKey: 'tiktok',
    fees: [
      { label: 'Commission', type: 'percentage', base: 'item', value: 5 },
      { label: 'Payment processing', type: 'percentage', base: 'subtotal', value: 2.9 },
    ],
    vatOnShipping: true,
    isCustom: false,
  },
  custom: {
    name: 'Custom',
    platformKey: 'custom',
    fees: [],
    vatOnShipping: true,
    isCustom: true,
  },
};

export const PLATFORM_LABELS: Record<PlatformKey, string> = {
  etsy: 'Etsy',
  ebay: 'eBay',
  amazon: 'Amazon',
  shopify: 'Shopify',
  tiktok: 'TikTok Shop',
  custom: 'Custom',
};
