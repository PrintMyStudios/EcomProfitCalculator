'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import { ChartContainer } from './chart-container';
import { useSettingsStore } from '@/stores/settings';
import { getCurrencySymbol } from '@/lib/constants/currencies';

export interface PlatformComparisonData {
  platform: string;
  profit: number;
  fees: number;
  margin: number;
  color: string;
}

interface PlatformComparisonChartProps {
  data: PlatformComparisonData[];
  className?: string;
}

const PLATFORM_COLORS: Record<string, string> = {
  Etsy: '#F56400',
  eBay: '#E53238',
  Amazon: '#FF9900',
  Shopify: '#96BF48',
  'TikTok Shop': '#000000',
};

export function PlatformComparisonChart({ data, className }: PlatformComparisonChartProps) {
  const currency = useSettingsStore((state) => state.currency);
  const symbol = getCurrencySymbol(currency);

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { color: string; name: string; value: number; dataKey: string }[]; label?: string }) => {
    if (active && payload && payload.length) {
      const platformData = data.find((d) => d.platform === label);
      return (
        <div className="rounded-lg border bg-background p-3 shadow-md">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {symbol}{entry.value.toFixed(2)}
            </p>
          ))}
          {platformData && (
            <p className="text-sm text-muted-foreground mt-1">
              Margin: {platformData.margin.toFixed(1)}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <ChartContainer
      title="Platform Comparison"
      description="Compare profit and fees across platforms"
      className={className}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={true} vertical={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${symbol}${value}`}
            className="text-muted-foreground"
          />
          <YAxis
            type="category"
            dataKey="platform"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={80}
            className="text-muted-foreground"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="profit" name="Profit" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-profit-${index}`}
                fill={PLATFORM_COLORS[entry.platform] || '#10b981'}
              />
            ))}
          </Bar>
          <Bar dataKey="fees" name="Fees" fill="#ef4444" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
