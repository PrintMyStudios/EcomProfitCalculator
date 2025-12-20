export interface OverheadItem {
  id: string;
  name: string;
  amount: number;  // Monthly cost in minor units
  category?: 'rent' | 'utilities' | 'software' | 'insurance' | 'marketing' | 'other';
}

export interface OverheadAllocationResult {
  totalMonthly: number;
  totalYearly: number;
  perUnitAllocation: number;
  items: OverheadItem[];
}

export interface OverheadAllocationParams {
  items: OverheadItem[];
  estimatedMonthlySales: number;
}

/**
 * Common overhead presets for different seller types
 */
export const OVERHEAD_PRESETS: Record<string, OverheadItem[]> = {
  home_seller: [
    { id: 'etsy_sub', name: 'Etsy Plus subscription', amount: 1000, category: 'software' },
    { id: 'packaging', name: 'Packaging supplies', amount: 2000, category: 'other' },
    { id: 'utilities', name: 'Home office utilities', amount: 3000, category: 'utilities' },
  ],
  small_business: [
    { id: 'rent', name: 'Studio/workspace rent', amount: 30000, category: 'rent' },
    { id: 'utilities', name: 'Utilities', amount: 8000, category: 'utilities' },
    { id: 'insurance', name: 'Business insurance', amount: 5000, category: 'insurance' },
    { id: 'software', name: 'Software subscriptions', amount: 3000, category: 'software' },
    { id: 'marketing', name: 'Marketing/ads', amount: 5000, category: 'marketing' },
  ],
  studio: [
    { id: 'rent', name: 'Studio rent', amount: 50000, category: 'rent' },
    { id: 'utilities', name: 'Utilities', amount: 15000, category: 'utilities' },
    { id: 'insurance', name: 'Insurance', amount: 8000, category: 'insurance' },
    { id: 'equipment', name: 'Equipment maintenance', amount: 5000, category: 'other' },
    { id: 'software', name: 'Software/tools', amount: 5000, category: 'software' },
    { id: 'marketing', name: 'Marketing', amount: 10000, category: 'marketing' },
  ],
};

/**
 * Calculate overhead allocation per unit sold
 */
export function calculateOverheadAllocation(params: OverheadAllocationParams): OverheadAllocationResult {
  const { items, estimatedMonthlySales } = params;

  const totalMonthly = items.reduce((sum, item) => sum + item.amount, 0);
  const totalYearly = totalMonthly * 12;

  // Avoid division by zero
  const perUnitAllocation = estimatedMonthlySales > 0
    ? Math.round(totalMonthly / estimatedMonthlySales)
    : 0;

  return {
    totalMonthly,
    totalYearly,
    perUnitAllocation,
    items,
  };
}

/**
 * Calculate profit with overhead allocation
 */
export function calculateProfitWithOverhead(params: {
  baseProfit: number;
  overheadPerUnit: number;
  quantity: number;
}): {
  adjustedProfit: number;
  totalOverhead: number;
  profitBeforeOverhead: number;
} {
  const { baseProfit, overheadPerUnit, quantity } = params;
  const totalOverhead = overheadPerUnit * quantity;
  const adjustedProfit = baseProfit - totalOverhead;

  return {
    adjustedProfit,
    totalOverhead,
    profitBeforeOverhead: baseProfit,
  };
}

/**
 * Get category totals from overhead items
 */
export function getOverheadByCategory(items: OverheadItem[]): Record<string, number> {
  const categoryTotals: Record<string, number> = {};

  for (const item of items) {
    const category = item.category || 'other';
    categoryTotals[category] = (categoryTotals[category] || 0) + item.amount;
  }

  return categoryTotals;
}

/**
 * Generate a unique ID for overhead items
 */
export function generateOverheadId(): string {
  return `overhead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
