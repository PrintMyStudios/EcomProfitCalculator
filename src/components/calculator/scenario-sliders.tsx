'use client';

import { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { formatCurrency } from '@/lib/constants/currencies';
import type { Currency } from '@/types';
import { calculateCustomScenario, SCENARIO_PRESETS, type ScenarioParams, type ScenarioResult } from '@/lib/calculations/scenarios';
import { ChevronDownIcon } from './icons';

interface ScenarioSlidersProps {
  params: ScenarioParams;
  currency: Currency;
  onApplyPrice?: (price: number) => void;
}

export function ScenarioSliders({
  params,
  currency,
  onApplyPrice,
}: ScenarioSlidersProps) {
  const [expanded, setExpanded] = useState(false);
  const [materialChange, setMaterialChange] = useState(0);
  const [labourChange, setLabourChange] = useState(0);
  const [shippingChange, setShippingChange] = useState(0);
  const [priceChange, setPriceChange] = useState(0);

  // Calculate custom scenario result
  const customResult = useMemo(() => {
    return calculateCustomScenario(params, {
      materialCostChange: materialChange,
      labourCostChange: labourChange,
      shippingCostChange: shippingChange,
      salePriceChange: priceChange,
    });
  }, [params, materialChange, labourChange, shippingChange, priceChange]);

  // Calculate preset scenarios
  const presetResults = useMemo(() => {
    return SCENARIO_PRESETS.slice(0, 6).map(scenario => {
      const result = calculateCustomScenario(params, {
        materialCostChange: scenario.materialCostChange,
        labourCostChange: scenario.labourCostChange,
        shippingCostChange: scenario.shippingCostChange,
        salePriceChange: scenario.salePriceChange,
      });
      return { ...result, scenario };
    });
  }, [params]);

  const resetSliders = () => {
    setMaterialChange(0);
    setLabourChange(0);
    setShippingChange(0);
    setPriceChange(0);
  };

  const hasChanges = materialChange !== 0 || labourChange !== 0 || shippingChange !== 0 || priceChange !== 0;

  return (
    <div className="space-y-3">
      {/* Summary Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between rounded-lg p-2 text-sm font-semibold transition-colors hover:bg-muted/50"
      >
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span>What-If Analysis</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
            Test scenarios
          </Badge>
          <div className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
            <ChevronDownIcon />
          </div>
        </div>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="space-y-4 rounded-xl border bg-muted/30 p-4">
          {/* Preset Scenarios */}
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Quick Scenarios</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {presetResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setMaterialChange(result.scenario.materialCostChange);
                    setLabourChange(result.scenario.labourCostChange);
                    setShippingChange(result.scenario.shippingCostChange);
                    setPriceChange(result.scenario.salePriceChange);
                  }}
                  className={`rounded-lg border p-2 text-left text-xs transition-colors hover:bg-muted ${
                    result.profit > params.baseProfit
                      ? 'border-emerald-200 dark:border-emerald-800'
                      : result.profit < params.baseProfit
                        ? 'border-red-200 dark:border-red-800'
                        : ''
                  }`}
                >
                  <p className="font-medium truncate">{result.scenario.name}</p>
                  <p className={`mt-1 font-semibold ${
                    result.profit > 0 ? 'text-emerald-500' : 'text-red-500'
                  }`}>
                    {formatCurrency(result.profit, currency)}
                  </p>
                  <p className={`text-[10px] ${
                    result.profitChange > 0
                      ? 'text-emerald-500'
                      : result.profitChange < 0
                        ? 'text-red-500'
                        : 'text-muted-foreground'
                  }`}>
                    {result.profitChange > 0 ? '+' : ''}{formatCurrency(result.profitChange, currency)}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Sliders */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Custom Scenario</p>
              {hasChanges && (
                <Button variant="ghost" size="sm" onClick={resetSliders} className="h-6 text-xs">
                  Reset
                </Button>
              )}
            </div>

            {/* Material Cost Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Material Cost</span>
                <span className={`font-medium ${materialChange > 0 ? 'text-red-500' : materialChange < 0 ? 'text-emerald-500' : ''}`}>
                  {materialChange > 0 ? '+' : ''}{materialChange}%
                </span>
              </div>
              <Slider
                value={[materialChange]}
                onValueChange={([v]) => setMaterialChange(v)}
                min={-50}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            {/* Labour Cost Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Labour Cost</span>
                <span className={`font-medium ${labourChange > 0 ? 'text-red-500' : labourChange < 0 ? 'text-emerald-500' : ''}`}>
                  {labourChange > 0 ? '+' : ''}{labourChange}%
                </span>
              </div>
              <Slider
                value={[labourChange]}
                onValueChange={([v]) => setLabourChange(v)}
                min={-50}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            {/* Shipping Cost Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping Cost</span>
                <span className={`font-medium ${shippingChange > 0 ? 'text-red-500' : shippingChange < 0 ? 'text-emerald-500' : ''}`}>
                  {shippingChange > 0 ? '+' : ''}{shippingChange}%
                </span>
              </div>
              <Slider
                value={[shippingChange]}
                onValueChange={([v]) => setShippingChange(v)}
                min={-50}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            {/* Sale Price Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sale Price</span>
                <span className={`font-medium ${priceChange > 0 ? 'text-emerald-500' : priceChange < 0 ? 'text-red-500' : ''}`}>
                  {priceChange > 0 ? '+' : ''}{priceChange}%
                </span>
              </div>
              <Slider
                value={[priceChange]}
                onValueChange={([v]) => setPriceChange(v)}
                min={-30}
                max={50}
                step={5}
                className="w-full"
              />
            </div>
          </div>

          {/* Result Preview */}
          {hasChanges && (
            <div className={`rounded-xl p-4 ${
              customResult.profit > params.baseProfit
                ? 'bg-emerald-50 dark:bg-emerald-950/30'
                : customResult.profit < params.baseProfit
                  ? 'bg-red-50 dark:bg-red-950/30'
                  : 'bg-muted/50'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Scenario Profit</p>
                  <p className={`text-2xl font-bold ${
                    customResult.profit > 0 ? 'text-emerald-500' : 'text-red-500'
                  }`}>
                    {formatCurrency(customResult.profit, currency)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">vs Current</p>
                  <p className={`text-lg font-semibold ${
                    customResult.profitChange > 0 ? 'text-emerald-500' : customResult.profitChange < 0 ? 'text-red-500' : ''
                  }`}>
                    {customResult.profitChange > 0 ? '+' : ''}{formatCurrency(customResult.profitChange, currency)}
                  </p>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Margin: {customResult.margin.toFixed(1)}%</span>
                <span className={`${
                  customResult.marginChange > 0 ? 'text-emerald-500' : customResult.marginChange < 0 ? 'text-red-500' : ''
                }`}>
                  ({customResult.marginChange > 0 ? '+' : ''}{customResult.marginChange.toFixed(1)}pp)
                </span>
              </div>
              {onApplyPrice && customResult.newSalePrice !== params.baseSalePrice && (
                <Button
                  size="sm"
                  onClick={() => onApplyPrice(customResult.newSalePrice)}
                  className="mt-3 w-full"
                >
                  Apply {formatCurrency(customResult.newSalePrice, currency)} Price
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
