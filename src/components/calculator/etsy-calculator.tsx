'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { calculatePlatformFees, calculateProfit } from '@/lib/calculations';
import { formatCurrency, toMinorUnits, toMajorUnits } from '@/lib/constants';
import { DEFAULT_PLATFORM_TEMPLATES } from '@/lib/constants/platforms';

export function EtsyCalculator() {
  // Form state (in major units for display)
  const [productCost, setProductCost] = useState<string>('10.00');
  const [salePrice, setSalePrice] = useState<string>('25.00');
  const [shippingCost, setShippingCost] = useState<string>('3.50');
  const [sellerPaysShipping, setSellerPaysShipping] = useState(false);
  const [isVatRegistered, setIsVatRegistered] = useState(false);

  // Get Etsy fees from constants
  const etsyTemplate = DEFAULT_PLATFORM_TEMPLATES.etsy;

  // Etsy Offsite Ads fee rates
  // 15% for shops under $10,000/year, 12% for shops over $10,000/year
  const OFFSITE_ADS_RATE_STANDARD = 15; // Under $10k
  const OFFSITE_ADS_RATE_DISCOUNTED = 12; // Over $10k (mandatory)

  // Calculate results
  const results = useMemo(() => {
    const productCostMinor = toMinorUnits(parseFloat(productCost) || 0, 'GBP');
    const salePriceMinor = toMinorUnits(parseFloat(salePrice) || 0, 'GBP');
    const shippingCostMinor = toMinorUnits(parseFloat(shippingCost) || 0, 'GBP');

    // Calculate fees
    const { total: totalFees, breakdown } = calculatePlatformFees({
      itemPrice: salePriceMinor,
      shippingCost: shippingCostMinor,
      quantity: 1,
      fees: etsyTemplate.fees,
    });

    // Calculate revenue (what you receive from buyer)
    const shippingRevenue = sellerPaysShipping ? 0 : shippingCostMinor;
    const revenue = salePriceMinor + shippingRevenue;

    // Total cost including shipping if seller pays
    const totalProductCost = sellerPaysShipping
      ? productCostMinor + shippingCostMinor
      : productCostMinor;

    // Calculate profit
    const vatRate = isVatRegistered ? 20 : 0;
    const { profit, margin, receiptsExVat } = calculateProfit({
      revenue,
      productCost: totalProductCost,
      platformFees: totalFees,
      vatRate,
      isVatRegistered,
    });

    // Calculate Offsite Ads fees (charged on item price only, not shipping)
    // Standard rate (15%) for shops under $10k/year
    const offsiteAdsFeeSstandard = Math.round(salePriceMinor * (OFFSITE_ADS_RATE_STANDARD / 100));
    // Discounted rate (12%) for shops over $10k/year (mandatory)
    const offsiteAdsFeeDiscounted = Math.round(salePriceMinor * (OFFSITE_ADS_RATE_DISCOUNTED / 100));

    // Profit with Offsite Ads (standard 15%)
    const { profit: profitWithOffsiteAdsStandard, margin: marginWithOffsiteAdsStandard } = calculateProfit({
      revenue,
      productCost: totalProductCost,
      platformFees: totalFees + offsiteAdsFeeSstandard,
      vatRate,
      isVatRegistered,
    });

    // Profit with Offsite Ads (discounted 12%)
    const { profit: profitWithOffsiteAdsDiscounted, margin: marginWithOffsiteAdsDiscounted } = calculateProfit({
      revenue,
      productCost: totalProductCost,
      platformFees: totalFees + offsiteAdsFeeDiscounted,
      vatRate,
      isVatRegistered,
    });

    // Break-even price (simplified - where profit = 0)
    // profit = revenue - cost - fees
    // For break-even: revenue = cost + fees
    // Since fees depend on price, we solve iteratively
    let breakEvenPrice = totalProductCost;
    for (let i = 0; i < 20; i++) {
      const testFees = calculatePlatformFees({
        itemPrice: breakEvenPrice,
        shippingCost: sellerPaysShipping ? 0 : shippingCostMinor,
        quantity: 1,
        fees: etsyTemplate.fees,
      });
      const newBreakEven = totalProductCost + testFees.total;
      if (Math.abs(newBreakEven - breakEvenPrice) < 1) break;
      breakEvenPrice = newBreakEven;
    }

    return {
      revenue,
      totalFees,
      feesBreakdown: breakdown,
      profit,
      margin,
      breakEvenPrice,
      receiptsExVat,
      isProfit: profit > 0,
      // Offsite Ads data
      offsiteAds: {
        feeStandard: offsiteAdsFeeSstandard,
        feeDiscounted: offsiteAdsFeeDiscounted,
        profitWithStandard: profitWithOffsiteAdsStandard,
        marginWithStandard: marginWithOffsiteAdsStandard,
        profitWithDiscounted: profitWithOffsiteAdsDiscounted,
        marginWithDiscounted: marginWithOffsiteAdsDiscounted,
        isProfitableWithStandard: profitWithOffsiteAdsStandard > 0,
        isProfitableWithDiscounted: profitWithOffsiteAdsDiscounted > 0,
      },
    };
  }, [productCost, salePrice, shippingCost, sellerPaysShipping, isVatRegistered, etsyTemplate.fees]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Input Card */}
      <Card>
        <CardHeader>
          <CardTitle>Enter Your Details</CardTitle>
          <CardDescription>
            All prices in GBP. Enter your product cost and desired sale price.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Product Cost */}
          <div className="space-y-2">
            <Label htmlFor="productCost">Product Cost (what it costs you)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                £
              </span>
              <Input
                id="productCost"
                type="number"
                step="0.01"
                min="0"
                value={productCost}
                onChange={(e) => setProductCost(e.target.value)}
                className="pl-7"
                placeholder="0.00"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Materials, labour, packaging - your total cost to make/source
            </p>
          </div>

          {/* Sale Price */}
          <div className="space-y-2">
            <Label htmlFor="salePrice">Sale Price (what buyer pays)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                £
              </span>
              <Input
                id="salePrice"
                type="number"
                step="0.01"
                min="0"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                className="pl-7"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Shipping Cost */}
          <div className="space-y-2">
            <Label htmlFor="shippingCost">Shipping Cost</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                £
              </span>
              <Input
                id="shippingCost"
                type="number"
                step="0.01"
                min="0"
                value={shippingCost}
                onChange={(e) => setShippingCost(e.target.value)}
                className="pl-7"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Seller Pays Shipping Toggle */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="sellerPaysShipping">Free Shipping (you pay)</Label>
              <p className="text-xs text-muted-foreground">
                Toggle on if you offer free shipping
              </p>
            </div>
            <Switch
              id="sellerPaysShipping"
              checked={sellerPaysShipping}
              onCheckedChange={setSellerPaysShipping}
            />
          </div>

          {/* VAT Registered Toggle */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="vatRegistered">VAT Registered (UK 20%)</Label>
              <p className="text-xs text-muted-foreground">
                Profit calculated on receipts ex-VAT
              </p>
            </div>
            <Switch
              id="vatRegistered"
              checked={isVatRegistered}
              onCheckedChange={setIsVatRegistered}
            />
          </div>
        </CardContent>
      </Card>

      {/* Results Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Your Results
            <Badge variant={results.isProfit ? 'default' : 'destructive'}>
              {results.isProfit ? 'Profitable' : 'Loss'}
            </Badge>
          </CardTitle>
          <CardDescription>Based on Etsy&apos;s current fee structure</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Profit/Margin */}
          <div className="rounded-lg bg-muted p-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Profit</p>
                <p
                  className={`text-2xl font-bold ${results.isProfit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                >
                  {formatCurrency(results.profit, 'GBP')}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Margin</p>
                <p
                  className={`text-2xl font-bold ${results.isProfit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                >
                  {results.margin.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Fees Breakdown */}
          <div>
            <h4 className="mb-3 text-sm font-medium">Etsy Fees Breakdown</h4>
            <div className="space-y-2">
              {results.feesBreakdown.map((fee, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{fee.label}</span>
                  <span>{formatCurrency(fee.amount, 'GBP')}</span>
                </div>
              ))}
              <div className="flex justify-between border-t pt-2 font-medium">
                <span>Total Fees</span>
                <span className="text-orange-600 dark:text-orange-400">
                  {formatCurrency(results.totalFees, 'GBP')}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Additional Info */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Break-even Price</span>
              <span className="font-medium">{formatCurrency(results.breakEvenPrice, 'GBP')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Revenue</span>
              <span>{formatCurrency(results.revenue, 'GBP')}</span>
            </div>
            {isVatRegistered && results.receiptsExVat && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Receipts (ex-VAT)</span>
                <span>{formatCurrency(results.receiptsExVat, 'GBP')}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Fee Percentage</span>
              <span>
                {results.revenue > 0
                  ? ((results.totalFees / results.revenue) * 100).toFixed(1)
                  : 0}
                %
              </span>
            </div>
          </div>

          {/* Warning if losing money */}
          {!results.isProfit && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
              <p className="text-sm text-red-800 dark:text-red-200">
                <strong>Warning:</strong> At this price, you&apos;re losing money. Consider
                raising your price to at least{' '}
                <strong>{formatCurrency(results.breakEvenPrice + 100, 'GBP')}</strong> for a
                small profit.
              </p>
            </div>
          )}

          <Separator />

          {/* Offsite Ads Impact Section */}
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-medium">
              <svg className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
              If Sold via Offsite Ads
            </h4>
            <p className="mb-3 text-xs text-muted-foreground">
              Etsy promotes your listings on Google, Facebook, etc. You only pay if it results in a sale.
            </p>

            <div className="space-y-3 rounded-lg bg-muted/50 p-3">
              {/* 15% Rate (Under $10k) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    15% fee <span className="text-xs">(shops under $10k/yr)</span>
                  </span>
                  <span className="font-medium text-orange-600 dark:text-orange-400">
                    -{formatCurrency(results.offsiteAds.feeStandard, 'GBP')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Profit with Offsite Ads</span>
                  <span className={`text-sm font-semibold ${results.offsiteAds.isProfitableWithStandard ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {formatCurrency(results.offsiteAds.profitWithStandard, 'GBP')}
                    <span className="ml-1 text-xs font-normal">({results.offsiteAds.marginWithStandard.toFixed(1)}%)</span>
                  </span>
                </div>
              </div>

              <Separator className="my-2" />

              {/* 12% Rate (Over $10k - Mandatory) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    12% fee <span className="text-xs">(shops over $10k/yr)</span>
                  </span>
                  <span className="font-medium text-orange-600 dark:text-orange-400">
                    -{formatCurrency(results.offsiteAds.feeDiscounted, 'GBP')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Profit with Offsite Ads</span>
                  <span className={`text-sm font-semibold ${results.offsiteAds.isProfitableWithDiscounted ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {formatCurrency(results.offsiteAds.profitWithDiscounted, 'GBP')}
                    <span className="ml-1 text-xs font-normal">({results.offsiteAds.marginWithDiscounted.toFixed(1)}%)</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Info box about mandatory participation */}
            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/50">
              <p className="text-xs text-amber-800 dark:text-amber-200">
                <strong>Note:</strong> Shops earning $10,000+ USD/year <strong>cannot opt out</strong> of Offsite Ads.
                Smaller shops can opt out but pay 15% if they participate. Only ~10-15% of sales typically come through Offsite Ads.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
