import { calculateProfit } from './fees';

export interface ScenarioConfig {
  name: string;
  materialCostChange: number;    // percentage change, e.g., 10 for +10%
  labourCostChange: number;
  shippingCostChange: number;
  salePriceChange: number;
}

export interface ScenarioResult {
  scenario: ScenarioConfig;
  profit: number;
  margin: number;
  profitChange: number;     // vs base case (amount)
  marginChange: number;     // vs base case (percentage points)
  newSalePrice: number;
  newCost: number;
}

export interface ScenarioParams {
  baseMaterialCost: number;
  baseLabourCost: number;
  baseShippingCost: number;   // Seller's shipping cost (if paying)
  baseSalePrice: number;
  platformFees: number;
  vatRate: number;
  isVatRegistered: boolean;
  baseProfit: number;
  baseMargin: number;
}

// Common preset scenarios
export const SCENARIO_PRESETS: ScenarioConfig[] = [
  {
    name: 'Supplier Price +10%',
    materialCostChange: 10,
    labourCostChange: 0,
    shippingCostChange: 0,
    salePriceChange: 0,
  },
  {
    name: 'Supplier Price +20%',
    materialCostChange: 20,
    labourCostChange: 0,
    shippingCostChange: 0,
    salePriceChange: 0,
  },
  {
    name: 'Shipping Cost +25%',
    materialCostChange: 0,
    labourCostChange: 0,
    shippingCostChange: 25,
    salePriceChange: 0,
  },
  {
    name: 'Sale Price -10%',
    materialCostChange: 0,
    labourCostChange: 0,
    shippingCostChange: 0,
    salePriceChange: -10,
  },
  {
    name: 'Sale Price -20%',
    materialCostChange: 0,
    labourCostChange: 0,
    shippingCostChange: 0,
    salePriceChange: -20,
  },
  {
    name: 'Premium Price +15%',
    materialCostChange: 0,
    labourCostChange: 0,
    shippingCostChange: 0,
    salePriceChange: 15,
  },
  {
    name: 'Cost Increase +15%',
    materialCostChange: 15,
    labourCostChange: 15,
    shippingCostChange: 15,
    salePriceChange: 0,
  },
  {
    name: 'Bulk Discount -20% cost',
    materialCostChange: -20,
    labourCostChange: 0,
    shippingCostChange: 0,
    salePriceChange: 0,
  },
];

/**
 * Calculate scenario result given parameter changes
 */
export function calculateScenario(
  params: ScenarioParams,
  scenario: ScenarioConfig
): ScenarioResult {
  const {
    baseMaterialCost,
    baseLabourCost,
    baseShippingCost,
    baseSalePrice,
    platformFees,
    vatRate,
    isVatRegistered,
    baseProfit,
    baseMargin,
  } = params;

  // Apply percentage changes
  const newMaterialCost = Math.round(baseMaterialCost * (1 + scenario.materialCostChange / 100));
  const newLabourCost = Math.round(baseLabourCost * (1 + scenario.labourCostChange / 100));
  const newShippingCost = Math.round(baseShippingCost * (1 + scenario.shippingCostChange / 100));
  const newSalePrice = Math.round(baseSalePrice * (1 + scenario.salePriceChange / 100));

  // Calculate new total cost
  const newCost = newMaterialCost + newLabourCost + newShippingCost;

  // Calculate new profit
  // Note: Platform fees would change with price, but we simplify by using the ratio
  const feeRatio = baseSalePrice > 0 ? platformFees / baseSalePrice : 0;
  const newFees = Math.round(newSalePrice * feeRatio);

  const { profit, margin } = calculateProfit({
    revenue: newSalePrice,
    productCost: newCost,
    platformFees: newFees,
    vatRate,
    isVatRegistered,
  });

  return {
    scenario,
    profit,
    margin,
    profitChange: profit - baseProfit,
    marginChange: margin - baseMargin,
    newSalePrice,
    newCost,
  };
}

/**
 * Calculate all preset scenarios
 */
export function calculateAllScenarios(params: ScenarioParams): ScenarioResult[] {
  return SCENARIO_PRESETS.map(scenario => calculateScenario(params, scenario));
}

/**
 * Calculate custom scenario with slider values
 */
export function calculateCustomScenario(
  params: ScenarioParams,
  changes: {
    materialCostChange: number;
    labourCostChange: number;
    shippingCostChange: number;
    salePriceChange: number;
  }
): ScenarioResult {
  const scenario: ScenarioConfig = {
    name: 'Custom',
    ...changes,
  };
  return calculateScenario(params, scenario);
}

/**
 * Find the worst-case scenario from a list
 */
export function findWorstCaseScenario(results: ScenarioResult[]): ScenarioResult | null {
  if (results.length === 0) return null;
  return results.reduce((worst, current) =>
    current.profit < worst.profit ? current : worst
  );
}

/**
 * Find the best-case scenario from a list
 */
export function findBestCaseScenario(results: ScenarioResult[]): ScenarioResult | null {
  if (results.length === 0) return null;
  return results.reduce((best, current) =>
    current.profit > best.profit ? current : best
  );
}
