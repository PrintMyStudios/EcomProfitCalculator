'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/constants/currencies';
import type { Currency } from '@/types';
import type { DiscountAnalysisResult } from '@/lib/calculations/discount-analysis';
import { ChevronDownIcon } from './icons';

interface DiscountAnalysisTableProps {
  results: DiscountAnalysisResult[];
  breakEvenDiscount: number;
  maxProfitableDiscount: number;
  currency: Currency;
  onApplyPrice?: (price: number) => void;
}

export function DiscountAnalysisTable({
  results,
  breakEvenDiscount,
  maxProfitableDiscount,
  currency,
  onApplyPrice,
}: DiscountAnalysisTableProps) {
  const [expanded, setExpanded] = useState(false);

  if (results.length === 0) return null;

  // Find first profitable result for highlighting
  const firstUnprofitableIndex = results.findIndex((r) => !r.isProfitable);

  return (
    <div className="space-y-3">
      {/* Summary Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between rounded-lg p-2 text-sm font-semibold transition-colors hover:bg-muted/50"
      >
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <span>Discount Analysis</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={breakEvenDiscount > 20 ? 'default' : 'secondary'} className={breakEvenDiscount > 20 ? 'bg-emerald-500' : 'bg-amber-500'}>
            Max {breakEvenDiscount.toFixed(0)}% off
          </Badge>
          <div className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
            <ChevronDownIcon />
          </div>
        </div>
      </button>

      {/* Expanded Table */}
      {expanded && (
        <div className="overflow-hidden rounded-xl border bg-muted/30">
          <div className="max-h-64 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-muted/80 backdrop-blur-sm">
                <tr className="border-b">
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground">Discount</th>
                  <th className="px-3 py-2 text-right font-medium text-muted-foreground">Price</th>
                  <th className="px-3 py-2 text-right font-medium text-muted-foreground">Fees</th>
                  <th className="px-3 py-2 text-right font-medium text-muted-foreground">Profit</th>
                  <th className="px-3 py-2 text-right font-medium text-muted-foreground">Margin</th>
                  <th className="px-3 py-2 text-center font-medium text-muted-foreground">Status</th>
                  {onApplyPrice && <th className="px-3 py-2"></th>}
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr
                    key={result.discountPercent}
                    className={`border-b transition-colors ${
                      result.isProfitable
                        ? index === firstUnprofitableIndex - 1
                          ? 'bg-emerald-50 dark:bg-emerald-950/30'
                          : ''
                        : 'bg-red-50/50 dark:bg-red-950/20'
                    }`}
                  >
                    <td className="px-3 py-2 font-medium">
                      <span className={result.isProfitable ? 'text-foreground' : 'text-red-500'}>
                        {result.discountPercent}% off
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {formatCurrency(result.discountedPrice, currency)}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums text-orange-500">
                      {formatCurrency(result.fees, currency)}
                    </td>
                    <td className={`px-3 py-2 text-right font-semibold tabular-nums ${
                      result.profit > 0 ? 'text-emerald-500' : 'text-red-500'
                    }`}>
                      {formatCurrency(result.profit, currency)}
                    </td>
                    <td className={`px-3 py-2 text-right tabular-nums ${
                      result.margin > 20 ? 'text-emerald-500' : result.margin > 0 ? 'text-amber-500' : 'text-red-500'
                    }`}>
                      {result.margin.toFixed(1)}%
                    </td>
                    <td className="px-3 py-2 text-center">
                      {result.isProfitable ? (
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400">
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      ) : (
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400">
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </span>
                      )}
                    </td>
                    {onApplyPrice && (
                      <td className="px-3 py-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onApplyPrice(result.discountedPrice)}
                          className="h-7 text-xs opacity-0 transition-opacity group-hover:opacity-100 hover:opacity-100"
                        >
                          Apply
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer summary */}
          <div className="border-t bg-muted/50 px-3 py-2">
            <p className="text-xs text-muted-foreground">
              {breakEvenDiscount > 0 ? (
                <>
                  You can offer up to <span className="font-semibold text-emerald-600 dark:text-emerald-400">{breakEvenDiscount.toFixed(0)}%</span> discount before making a loss.
                  {maxProfitableDiscount > 0 && maxProfitableDiscount !== breakEvenDiscount && (
                    <> Recommended max: <span className="font-semibold text-amber-600 dark:text-amber-400">{maxProfitableDiscount}%</span></>
                  )}
                </>
              ) : (
                <span className="text-red-500">You are already making a loss at full price.</span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
