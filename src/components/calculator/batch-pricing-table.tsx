'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/constants/currencies';
import type { Currency } from '@/types';
import type { BatchTier } from '@/lib/calculations/batch-pricing';
import { ChevronDownIcon } from './icons';

interface BatchPricingTableProps {
  tiers: BatchTier[];
  currency: Currency;
  bestQuantity?: number;
}

export function BatchPricingTable({
  tiers,
  currency,
  bestQuantity,
}: BatchPricingTableProps) {
  const [expanded, setExpanded] = useState(false);

  if (tiers.length === 0) return null;

  // Find best tier by margin
  const bestTier = tiers.reduce((best, current) =>
    current.margin > best.margin ? current : best
  );

  return (
    <div className="space-y-3">
      {/* Summary Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between rounded-lg p-2 text-sm font-semibold transition-colors hover:bg-muted/50"
      >
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>Batch Pricing</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="default" className="bg-blue-500">
            Best at {bestTier.quantity} units
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
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground">Quantity</th>
                  <th className="px-3 py-2 text-right font-medium text-muted-foreground">Unit Cost</th>
                  <th className="px-3 py-2 text-right font-medium text-muted-foreground">Profit/Unit</th>
                  <th className="px-3 py-2 text-right font-medium text-muted-foreground">Total Profit</th>
                  <th className="px-3 py-2 text-right font-medium text-muted-foreground">Margin</th>
                </tr>
              </thead>
              <tbody>
                {tiers.map((tier) => {
                  const isBest = tier.quantity === bestTier.quantity;
                  return (
                    <tr
                      key={tier.quantity}
                      className={`border-b transition-colors ${
                        isBest
                          ? 'bg-blue-50 dark:bg-blue-950/30'
                          : tier.profitPerUnit > 0
                            ? ''
                            : 'bg-red-50/50 dark:bg-red-950/20'
                      }`}
                    >
                      <td className="px-3 py-2 font-medium">
                        <div className="flex items-center gap-2">
                          {tier.quantity} units
                          {isBest && (
                            <Badge variant="secondary" className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                              Best
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        {formatCurrency(tier.unitCost, currency)}
                      </td>
                      <td className={`px-3 py-2 text-right font-semibold tabular-nums ${
                        tier.profitPerUnit > 0 ? 'text-emerald-500' : 'text-red-500'
                      }`}>
                        {formatCurrency(tier.profitPerUnit, currency)}
                      </td>
                      <td className={`px-3 py-2 text-right font-semibold tabular-nums ${
                        tier.totalProfit > 0 ? 'text-emerald-500' : 'text-red-500'
                      }`}>
                        {formatCurrency(tier.totalProfit, currency)}
                      </td>
                      <td className={`px-3 py-2 text-right tabular-nums ${
                        tier.margin > 20 ? 'text-emerald-500' : tier.margin > 0 ? 'text-amber-500' : 'text-red-500'
                      }`}>
                        {tier.margin.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer summary */}
          <div className="border-t bg-muted/50 px-3 py-2">
            <p className="text-xs text-muted-foreground">
              Best margin of <span className="font-semibold text-blue-600 dark:text-blue-400">{bestTier.margin.toFixed(1)}%</span> at {bestTier.quantity} units,
              earning <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(bestTier.totalProfit, currency)}</span> total profit.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
