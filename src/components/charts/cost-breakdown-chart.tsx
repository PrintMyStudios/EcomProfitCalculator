'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { ChartContainer } from './chart-container';
import { useSettingsStore } from '@/stores/settings';
import { getCurrencySymbol } from '@/lib/constants/currencies';

export interface CostBreakdownData {
  name: string;
  value: number;
  color: string;
}

interface CostBreakdownChartProps {
  data: CostBreakdownData[];
  className?: string;
}

const COST_COLORS: Record<string, string> = {
  Materials: '#ef4444',
  Labour: '#f59e0b',
  'Platform Fees': '#8b5cf6',
  Shipping: '#06b6d4',
  Packaging: '#10b981',
  Other: '#6b7280',
};

export function CostBreakdownChart({ data, className }: CostBreakdownChartProps) {
  const currency = useSettingsStore((state) => state.currency);
  const symbol = getCurrencySymbol(currency);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number; payload: CostBreakdownData }[] }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
      return (
        <div className="rounded-lg border bg-background p-3 shadow-md">
          <p className="font-medium">{item.name}</p>
          <p className="text-sm" style={{ color: item.payload.color }}>
            {symbol}{item.value.toFixed(2)} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: { payload?: { value: string; color: string }[] }) => (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload?.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-muted-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );

  // Assign colors to data items
  const coloredData = data.map((item) => ({
    ...item,
    color: COST_COLORS[item.name] || item.color || '#6b7280',
  }));

  return (
    <ChartContainer
      title="Cost Breakdown"
      description="Distribution of costs across categories"
      className={className}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={coloredData}
            cx="50%"
            cy="45%"
            outerRadius={90}
            innerRadius={50}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
          >
            {coloredData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
