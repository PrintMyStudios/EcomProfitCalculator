import { describe, it, expect } from 'vitest';
import {
  calculatePlatformFees,
  calculateProfit,
  calculateBreakEvenPrice,
  calculateTargetPrice,
} from '../fees';
import { DEFAULT_PLATFORM_TEMPLATES } from '@/lib/constants/platforms';
import type { FeeTerm } from '@/types';

describe('calculatePlatformFees', () => {
  describe('Etsy platform', () => {
    const etsyFees = DEFAULT_PLATFORM_TEMPLATES.etsy.fees;

    it('calculates Etsy fees correctly for a basic sale', () => {
      // Item: £25.00 (2500), Shipping: £3.50 (350), Quantity: 1
      const result = calculatePlatformFees({
        itemPrice: 2500,
        shippingCost: 350,
        quantity: 1,
        fees: etsyFees,
      });

      // Transaction fee: 6.5% of 2850 = 185.25 -> 185
      // Payment processing: 4% of 2850 = 114
      // Payment fixed fee: 20p
      // Listing fee: 15p
      // Total: 185 + 114 + 20 + 15 = 334

      expect(result.total).toBe(334);
      expect(result.breakdown).toHaveLength(4);
      expect(result.breakdown[0]).toEqual({ label: 'Transaction fee', amount: 185 });
      expect(result.breakdown[1]).toEqual({ label: 'Payment processing', amount: 114 });
      expect(result.breakdown[2]).toEqual({ label: 'Payment fixed fee', amount: 20 });
      expect(result.breakdown[3]).toEqual({ label: 'Listing fee', amount: 15 });
    });

    it('calculates Etsy fees with quantity > 1', () => {
      // Item: £10.00 (1000), Shipping: £2.00 (200), Quantity: 3
      const result = calculatePlatformFees({
        itemPrice: 1000,
        shippingCost: 200,
        quantity: 3,
        fees: etsyFees,
      });

      // Transaction fee: 6.5% of 1200 = 78
      // Payment processing: 4% of 1200 = 48
      // Payment fixed fee: 20p (per order)
      // Listing fee: 15p × 3 = 45p (per item)
      // Total: 78 + 48 + 20 + 45 = 191

      expect(result.total).toBe(191);
      expect(result.breakdown[3]).toEqual({ label: 'Listing fee', amount: 45 });
    });

    it('calculates Etsy fees with £0 shipping', () => {
      // Item: £20.00 (2000), Shipping: £0 (0), Quantity: 1
      const result = calculatePlatformFees({
        itemPrice: 2000,
        shippingCost: 0,
        quantity: 1,
        fees: etsyFees,
      });

      // Transaction fee: 6.5% of 2000 = 130
      // Payment processing: 4% of 2000 = 80
      // Payment fixed fee: 20p
      // Listing fee: 15p
      // Total: 130 + 80 + 20 + 15 = 245

      expect(result.total).toBe(245);
    });
  });

  describe('eBay platform', () => {
    const ebayFees = DEFAULT_PLATFORM_TEMPLATES.ebay.fees;

    it('calculates eBay fees correctly', () => {
      // Item: £30.00 (3000), Shipping: £5.00 (500), Quantity: 1
      const result = calculatePlatformFees({
        itemPrice: 3000,
        shippingCost: 500,
        quantity: 1,
        fees: ebayFees,
      });

      // Final value fee: 10% of 3500 = 350
      // Payment processing: 2.9% of 3500 = 101.5 -> 102
      // Total: 350 + 102 = 452

      expect(result.total).toBe(452);
      expect(result.breakdown).toHaveLength(2);
      expect(result.breakdown[0]).toEqual({ label: 'Final value fee', amount: 350 });
      expect(result.breakdown[1]).toEqual({ label: 'Payment processing', amount: 102 });
    });
  });

  describe('Amazon platform', () => {
    const amazonFees = DEFAULT_PLATFORM_TEMPLATES.amazon.fees;

    it('calculates Amazon fees on item only, not shipping', () => {
      // Item: £40.00 (4000), Shipping: £8.00 (800), Quantity: 1
      const result = calculatePlatformFees({
        itemPrice: 4000,
        shippingCost: 800,
        quantity: 1,
        fees: amazonFees,
      });

      // Referral fee: 15% of item only (4000) = 600
      // Total: 600

      expect(result.total).toBe(600);
      expect(result.breakdown).toHaveLength(1);
      expect(result.breakdown[0]).toEqual({ label: 'Referral fee', amount: 600 });
    });

    it('calculates Amazon fees with zero shipping', () => {
      // Item: £50.00 (5000), Shipping: £0 (0), Quantity: 1
      const result = calculatePlatformFees({
        itemPrice: 5000,
        shippingCost: 0,
        quantity: 1,
        fees: amazonFees,
      });

      // Referral fee: 15% of 5000 = 750
      expect(result.total).toBe(750);
    });
  });

  describe('Shopify platform', () => {
    const shopifyFees = DEFAULT_PLATFORM_TEMPLATES.shopify.fees;

    it('calculates Shopify fees correctly', () => {
      // Item: £100.00 (10000), Shipping: £10.00 (1000), Quantity: 1
      const result = calculatePlatformFees({
        itemPrice: 10000,
        shippingCost: 1000,
        quantity: 1,
        fees: shopifyFees,
      });

      // Transaction fee: 2.9% of 11000 = 319
      // Payment processing: 2.9% of 11000 = 319
      // Total: 319 + 319 = 638

      expect(result.total).toBe(638);
      expect(result.breakdown).toHaveLength(2);
    });
  });

  describe('TikTok platform', () => {
    const tiktokFees = DEFAULT_PLATFORM_TEMPLATES.tiktok.fees;

    it('calculates TikTok fees correctly', () => {
      // Item: £15.00 (1500), Shipping: £2.50 (250), Quantity: 1
      const result = calculatePlatformFees({
        itemPrice: 1500,
        shippingCost: 250,
        quantity: 1,
        fees: tiktokFees,
      });

      // Commission: 5% of item only (1500) = 75
      // Payment processing: 2.9% of subtotal (1750) = 50.75 -> 51
      // Total: 75 + 51 = 126

      expect(result.total).toBe(126);
      expect(result.breakdown).toHaveLength(2);
      expect(result.breakdown[0]).toEqual({ label: 'Commission', amount: 75 });
      expect(result.breakdown[1]).toEqual({ label: 'Payment processing', amount: 51 });
    });
  });

  describe('Edge cases', () => {
    it('handles £0 item price', () => {
      const result = calculatePlatformFees({
        itemPrice: 0,
        shippingCost: 500,
        quantity: 1,
        fees: DEFAULT_PLATFORM_TEMPLATES.etsy.fees,
      });

      // Only fees on shipping + fixed fees
      expect(result.total).toBeGreaterThan(0);
    });

    it('handles very large values', () => {
      const result = calculatePlatformFees({
        itemPrice: 1000000, // £10,000
        shippingCost: 50000, // £500
        quantity: 1,
        fees: DEFAULT_PLATFORM_TEMPLATES.etsy.fees,
      });

      expect(result.total).toBeGreaterThan(0);
      expect(Number.isFinite(result.total)).toBe(true);
    });

    it('excludes zero-value fees from breakdown', () => {
      const customFees: FeeTerm[] = [
        { label: 'Fee 1', type: 'percentage', base: 'item', value: 5 },
        { label: 'Fee 2', type: 'fixed', base: 'order', value: 0 },
      ];

      const result = calculatePlatformFees({
        itemPrice: 1000,
        shippingCost: 0,
        quantity: 1,
        fees: customFees,
      });

      // Only Fee 1 should be in breakdown
      expect(result.breakdown).toHaveLength(1);
      expect(result.breakdown[0].label).toBe('Fee 1');
    });

    it('handles empty fees array', () => {
      const result = calculatePlatformFees({
        itemPrice: 1000,
        shippingCost: 500,
        quantity: 1,
        fees: [],
      });

      expect(result.total).toBe(0);
      expect(result.breakdown).toHaveLength(0);
    });
  });
});

describe('calculateProfit', () => {
  describe('Non-VAT registered', () => {
    it('calculates basic profit correctly', () => {
      const result = calculateProfit({
        revenue: 5000, // £50.00
        productCost: 2000, // £20.00
        platformFees: 500, // £5.00
        vatRate: 0,
        isVatRegistered: false,
      });

      // Profit: 5000 - 2000 - 500 = 2500 (£25.00)
      // Margin: (2500 / 5000) × 100 = 50%

      expect(result.profit).toBe(2500);
      expect(result.margin).toBe(50);
      expect(result.receiptsExVat).toBeUndefined();
    });

    it('calculates negative profit (loss)', () => {
      const result = calculateProfit({
        revenue: 1000,
        productCost: 2000,
        platformFees: 500,
        vatRate: 0,
        isVatRegistered: false,
      });

      // Profit: 1000 - 2000 - 500 = -1500
      // Margin: (-1500 / 1000) × 100 = -150%

      expect(result.profit).toBe(-1500);
      expect(result.margin).toBe(-150);
    });

    it('handles zero revenue', () => {
      const result = calculateProfit({
        revenue: 0,
        productCost: 1000,
        platformFees: 100,
        vatRate: 0,
        isVatRegistered: false,
      });

      expect(result.profit).toBe(-1100);
      expect(result.margin).toBe(0); // Avoid division by zero
    });

    it('calculates exact break-even', () => {
      const result = calculateProfit({
        revenue: 3000,
        productCost: 2000,
        platformFees: 1000,
        vatRate: 0,
        isVatRegistered: false,
      });

      expect(result.profit).toBe(0);
      expect(result.margin).toBe(0);
    });
  });

  describe('VAT registered', () => {
    it('calculates profit on receipts excluding VAT', () => {
      const result = calculateProfit({
        revenue: 6000, // £60.00 inc VAT
        productCost: 2000, // £20.00
        platformFees: 600, // £6.00
        vatRate: 20,
        isVatRegistered: true,
      });

      // Receipts ex-VAT: 6000 / 1.2 = 5000
      // Profit: 5000 - 2000 - 600 = 2400
      // Margin: (2400 / 5000) × 100 = 48%

      expect(result.receiptsExVat).toBe(5000);
      expect(result.profit).toBe(2400);
      expect(result.margin).toBe(48);
    });

    it('handles VAT with different rates', () => {
      // Test with 10% VAT
      const result = calculateProfit({
        revenue: 5500, // £55.00 inc VAT
        productCost: 3000,
        platformFees: 500,
        vatRate: 10,
        isVatRegistered: true,
      });

      // Receipts ex-VAT: 5500 / 1.1 = 5000
      // Profit: 5000 - 3000 - 500 = 1500
      // Margin: (1500 / 5000) × 100 = 30%

      expect(result.receiptsExVat).toBe(5000);
      expect(result.profit).toBe(1500);
      expect(result.margin).toBe(30);
    });

    it('handles loss scenario with VAT', () => {
      const result = calculateProfit({
        revenue: 2400, // £24.00 inc VAT
        productCost: 3000,
        platformFees: 500,
        vatRate: 20,
        isVatRegistered: true,
      });

      // Receipts ex-VAT: 2400 / 1.2 = 2000
      // Profit: 2000 - 3000 - 500 = -1500
      // Margin: (-1500 / 2000) × 100 = -75%

      expect(result.receiptsExVat).toBe(2000);
      expect(result.profit).toBe(-1500);
      expect(result.margin).toBe(-75);
    });

    it('treats VAT rate of 0 as non-VAT', () => {
      const result = calculateProfit({
        revenue: 5000,
        productCost: 2000,
        platformFees: 500,
        vatRate: 0,
        isVatRegistered: true,
      });

      // With 0% VAT, should behave like non-VAT
      expect(result.profit).toBe(2500);
      expect(result.margin).toBe(50);
    });
  });

  describe('Margin calculation edge cases', () => {
    it('calculates high margin correctly', () => {
      const result = calculateProfit({
        revenue: 10000,
        productCost: 500,
        platformFees: 500,
        vatRate: 0,
        isVatRegistered: false,
      });

      // Profit: 10000 - 500 - 500 = 9000
      // Margin: (9000 / 10000) × 100 = 90%

      expect(result.profit).toBe(9000);
      expect(result.margin).toBe(90);
    });

    it('calculates low margin correctly', () => {
      const result = calculateProfit({
        revenue: 10000,
        productCost: 9000,
        platformFees: 500,
        vatRate: 0,
        isVatRegistered: false,
      });

      // Profit: 10000 - 9000 - 500 = 500
      // Margin: (500 / 10000) × 100 = 5%

      expect(result.profit).toBe(500);
      expect(result.margin).toBe(5);
    });
  });
});

describe('calculateBreakEvenPrice', () => {
  it('finds break-even price with simple percentage fees', () => {
    const fees: FeeTerm[] = [
      { label: 'Platform fee', type: 'percentage', base: 'subtotal', value: 10 },
    ];

    const result = calculateBreakEvenPrice({
      productCost: 1000, // £10.00
      shippingCost: 200, // £2.00
      sellerPaysShipping: false,
      fees,
      vatRate: 0,
      isVatRegistered: false,
    });

    // Break-even when revenue - cost - fees = 0
    // With 10% fee, roughly: price = cost / (1 - 0.1) ≈ 1111

    expect(result).toBeGreaterThan(1000);
    expect(result).toBeLessThan(1200);

    // Verify it actually breaks even
    const { total: platformFees } = calculatePlatformFees({
      itemPrice: result,
      shippingCost: 0,
      quantity: 1,
      fees,
    });
    const { profit } = calculateProfit({
      revenue: result,
      productCost: 1000,
      platformFees,
      vatRate: 0,
      isVatRegistered: false,
    });

    expect(Math.abs(profit)).toBeLessThanOrEqual(1); // Within tolerance
  });

  it('accounts for seller-paid shipping in break-even calculation', () => {
    const fees: FeeTerm[] = [
      { label: 'Platform fee', type: 'percentage', base: 'subtotal', value: 10 },
    ];

    const result = calculateBreakEvenPrice({
      productCost: 1000,
      shippingCost: 500, // Seller pays shipping
      sellerPaysShipping: true,
      fees,
      vatRate: 0,
      isVatRegistered: false,
    });

    // Verify break-even is achieved (profit ~= 0)
    const { total: platformFees } = calculatePlatformFees({
      itemPrice: result,
      shippingCost: 500,
      quantity: 1,
      fees,
    });
    const { profit } = calculateProfit({
      revenue: result + 500, // item price + shipping revenue
      productCost: 1000,
      platformFees,
      vatRate: 0,
      isVatRegistered: false,
    });

    expect(Math.abs(profit)).toBeLessThanOrEqual(1);
  });

  it('handles complex fee structures (Etsy)', () => {
    const result = calculateBreakEvenPrice({
      productCost: 2000, // £20.00
      shippingCost: 350, // £3.50
      sellerPaysShipping: true,
      fees: DEFAULT_PLATFORM_TEMPLATES.etsy.fees,
      vatRate: 0,
      isVatRegistered: false,
    });

    // Result should be reasonable (positive)
    expect(result).toBeGreaterThan(0);

    // Verify break-even is achieved
    const { total: platformFees } = calculatePlatformFees({
      itemPrice: result,
      shippingCost: 350,
      quantity: 1,
      fees: DEFAULT_PLATFORM_TEMPLATES.etsy.fees,
    });
    const { profit } = calculateProfit({
      revenue: result + 350,
      productCost: 2000,
      platformFees,
      vatRate: 0,
      isVatRegistered: false,
    });

    expect(Math.abs(profit)).toBeLessThanOrEqual(1);
  });

  it('accounts for VAT in break-even calculation', () => {
    const fees: FeeTerm[] = [
      { label: 'Platform fee', type: 'percentage', base: 'subtotal', value: 10 },
    ];

    const result = calculateBreakEvenPrice({
      productCost: 1000,
      shippingCost: 0,
      sellerPaysShipping: false,
      fees,
      vatRate: 20,
      isVatRegistered: true,
    });

    // With VAT, break-even price should be higher
    const withoutVAT = calculateBreakEvenPrice({
      productCost: 1000,
      shippingCost: 0,
      sellerPaysShipping: false,
      fees,
      vatRate: 0,
      isVatRegistered: false,
    });

    expect(result).toBeGreaterThan(withoutVAT);
  });

  it('handles zero fees', () => {
    const result = calculateBreakEvenPrice({
      productCost: 1000,
      shippingCost: 0,
      sellerPaysShipping: false,
      fees: [],
      vatRate: 0,
      isVatRegistered: false,
    });

    // Without fees, break-even should equal product cost
    expect(result).toBe(1000);
  });

  it('handles fixed fees only', () => {
    const fees: FeeTerm[] = [
      { label: 'Fixed fee', type: 'fixed', base: 'order', value: 50 },
    ];

    const result = calculateBreakEvenPrice({
      productCost: 1000,
      shippingCost: 0,
      sellerPaysShipping: false,
      fees,
      vatRate: 0,
      isVatRegistered: false,
    });

    // Break-even should be approximately cost + fixed fee (within tolerance)
    expect(result).toBeGreaterThanOrEqual(1050);
    expect(result).toBeLessThanOrEqual(1052);
  });
});

describe('calculateTargetPrice', () => {
  it('finds price for 30% target margin', () => {
    const fees: FeeTerm[] = [
      { label: 'Platform fee', type: 'percentage', base: 'subtotal', value: 10 },
    ];

    const result = calculateTargetPrice({
      productCost: 1000,
      shippingCost: 0,
      sellerPaysShipping: false,
      fees,
      vatRate: 0,
      isVatRegistered: false,
      targetMargin: 30,
    });

    // Verify the margin
    const { total: platformFees } = calculatePlatformFees({
      itemPrice: result,
      shippingCost: 0,
      quantity: 1,
      fees,
    });
    const { margin } = calculateProfit({
      revenue: result,
      productCost: 1000,
      platformFees,
      vatRate: 0,
      isVatRegistered: false,
    });

    expect(Math.abs(margin - 30)).toBeLessThanOrEqual(0.1);
  });

  it('finds price for 50% target margin', () => {
    const fees: FeeTerm[] = [
      { label: 'Platform fee', type: 'percentage', base: 'subtotal', value: 10 },
    ];

    const result = calculateTargetPrice({
      productCost: 1000,
      shippingCost: 0,
      sellerPaysShipping: false,
      fees,
      vatRate: 0,
      isVatRegistered: false,
      targetMargin: 50,
    });

    const { total: platformFees } = calculatePlatformFees({
      itemPrice: result,
      shippingCost: 0,
      quantity: 1,
      fees,
    });
    const { margin } = calculateProfit({
      revenue: result,
      productCost: 1000,
      platformFees,
      vatRate: 0,
      isVatRegistered: false,
    });

    expect(Math.abs(margin - 50)).toBeLessThanOrEqual(0.1);
  });

  it('accounts for seller-paid shipping', () => {
    const fees: FeeTerm[] = [
      { label: 'Platform fee', type: 'percentage', base: 'subtotal', value: 10 },
    ];

    const result = calculateTargetPrice({
      productCost: 1000,
      shippingCost: 500,
      sellerPaysShipping: true,
      fees,
      vatRate: 0,
      isVatRegistered: false,
      targetMargin: 30,
    });

    // Verify target margin is achieved with shipping
    const { total: platformFees } = calculatePlatformFees({
      itemPrice: result,
      shippingCost: 500,
      quantity: 1,
      fees,
    });
    const { margin } = calculateProfit({
      revenue: result + 500, // item price + shipping revenue
      productCost: 1000,
      platformFees,
      vatRate: 0,
      isVatRegistered: false,
    });

    expect(Math.abs(margin - 30)).toBeLessThanOrEqual(0.5);
  });

  it('works with different platforms', () => {
    // Test with Etsy fees
    const etsyResult = calculateTargetPrice({
      productCost: 2000,
      shippingCost: 350,
      sellerPaysShipping: true,
      fees: DEFAULT_PLATFORM_TEMPLATES.etsy.fees,
      vatRate: 0,
      isVatRegistered: false,
      targetMargin: 40,
    });

    const { total: etsyFees } = calculatePlatformFees({
      itemPrice: etsyResult,
      shippingCost: 350,
      quantity: 1,
      fees: DEFAULT_PLATFORM_TEMPLATES.etsy.fees,
    });
    const { margin: etsyMargin } = calculateProfit({
      revenue: etsyResult + 350,
      productCost: 2000,
      platformFees: etsyFees,
      vatRate: 0,
      isVatRegistered: false,
    });

    expect(Math.abs(etsyMargin - 40)).toBeLessThanOrEqual(0.1);

    // Test with Amazon fees
    const amazonResult = calculateTargetPrice({
      productCost: 2000,
      shippingCost: 0,
      sellerPaysShipping: false,
      fees: DEFAULT_PLATFORM_TEMPLATES.amazon.fees,
      vatRate: 0,
      isVatRegistered: false,
      targetMargin: 40,
    });

    const { total: amazonFees } = calculatePlatformFees({
      itemPrice: amazonResult,
      shippingCost: 0,
      quantity: 1,
      fees: DEFAULT_PLATFORM_TEMPLATES.amazon.fees,
    });
    const { margin: amazonMargin } = calculateProfit({
      revenue: amazonResult,
      productCost: 2000,
      platformFees: amazonFees,
      vatRate: 0,
      isVatRegistered: false,
    });

    expect(Math.abs(amazonMargin - 40)).toBeLessThanOrEqual(0.1);
  });

  it('accounts for VAT in target price calculation', () => {
    const fees: FeeTerm[] = [
      { label: 'Platform fee', type: 'percentage', base: 'subtotal', value: 10 },
    ];

    const withVAT = calculateTargetPrice({
      productCost: 1000,
      shippingCost: 0,
      sellerPaysShipping: false,
      fees,
      vatRate: 20,
      isVatRegistered: true,
      targetMargin: 30,
    });

    const withoutVAT = calculateTargetPrice({
      productCost: 1000,
      shippingCost: 0,
      sellerPaysShipping: false,
      fees,
      vatRate: 0,
      isVatRegistered: false,
      targetMargin: 30,
    });

    // Price should be higher with VAT
    expect(withVAT).toBeGreaterThan(withoutVAT);
  });

  it('handles high target margins', () => {
    const fees: FeeTerm[] = [
      { label: 'Platform fee', type: 'percentage', base: 'subtotal', value: 10 },
    ];

    const result = calculateTargetPrice({
      productCost: 1000,
      shippingCost: 0,
      sellerPaysShipping: false,
      fees,
      vatRate: 0,
      isVatRegistered: false,
      targetMargin: 80,
    });

    const { total: platformFees } = calculatePlatformFees({
      itemPrice: result,
      shippingCost: 0,
      quantity: 1,
      fees,
    });
    const { margin } = calculateProfit({
      revenue: result,
      productCost: 1000,
      platformFees,
      vatRate: 0,
      isVatRegistered: false,
    });

    expect(Math.abs(margin - 80)).toBeLessThanOrEqual(0.1);
  });

  it('handles low target margins', () => {
    const fees: FeeTerm[] = [
      { label: 'Platform fee', type: 'percentage', base: 'subtotal', value: 10 },
    ];

    const result = calculateTargetPrice({
      productCost: 1000,
      shippingCost: 0,
      sellerPaysShipping: false,
      fees,
      vatRate: 0,
      isVatRegistered: false,
      targetMargin: 5,
    });

    const { total: platformFees } = calculatePlatformFees({
      itemPrice: result,
      shippingCost: 0,
      quantity: 1,
      fees,
    });
    const { margin } = calculateProfit({
      revenue: result,
      productCost: 1000,
      platformFees,
      vatRate: 0,
      isVatRegistered: false,
    });

    expect(Math.abs(margin - 5)).toBeLessThanOrEqual(0.1);
  });
});
