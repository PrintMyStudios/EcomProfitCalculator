'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSettingsStore } from '@/stores/settings';
import { useProducts } from '@/hooks/use-products';
import { useMaterials } from '@/hooks/use-materials';
import { toMajorUnits, getCurrencySymbol } from '@/lib/constants/currencies';
import {
  ProfitTrendsChart,
  PlatformComparisonChart,
  CostBreakdownChart,
  type ProfitTrendsData,
  type PlatformComparisonData,
  type CostBreakdownData,
} from '@/components/charts';
import { Package, Layers, TrendingUp, Calculator, Plus, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const { user, userProfile } = useAuth();
  const { showMaterialsLibrary, showSuppliers, currency } = useSettingsStore();
  const { products, isLoading: productsLoading } = useProducts();
  const { materials, loading: materialsLoading } = useMaterials();

  const symbol = getCurrencySymbol(currency);

  // Calculate stats from products
  const stats = useMemo(() => {
    if (!products.length) {
      return {
        totalProducts: 0,
        totalMaterials: 0,
        avgCost: 0,
        hasData: false,
      };
    }

    const totalCost = products.reduce((sum, p) => sum + p.calculatedCost, 0);
    const avgCost = totalCost / products.length;

    return {
      totalProducts: products.length,
      totalMaterials: materials.length,
      avgCost: toMajorUnits(avgCost, currency),
      hasData: products.length > 0,
    };
  }, [products, materials, currency]);

  // Generate sample chart data based on products
  const chartData = useMemo(() => {
    // Sample profit trends data - in real app, this would come from calculation history
    const profitTrends: ProfitTrendsData[] = [
      { date: 'Week 1', profit: 120, margin: 35, revenue: 350 },
      { date: 'Week 2', profit: 180, margin: 38, revenue: 480 },
      { date: 'Week 3', profit: 150, margin: 32, revenue: 470 },
      { date: 'Week 4', profit: 220, margin: 42, revenue: 520 },
    ];

    // Platform comparison - sample data
    const platformComparison: PlatformComparisonData[] = [
      { platform: 'Etsy', profit: 45, fees: 12, margin: 35, color: '#F56400' },
      { platform: 'eBay', profit: 38, fees: 15, margin: 28, color: '#E53238' },
      { platform: 'Amazon', profit: 32, fees: 22, margin: 22, color: '#FF9900' },
      { platform: 'Shopify', profit: 52, fees: 8, margin: 45, color: '#96BF48' },
    ];

    // Cost breakdown - derive from products if available
    let costBreakdown: CostBreakdownData[] = [];
    if (stats.hasData) {
      const handmadeProducts = products.filter((p) => p.productType === 'handmade');
      const sourcedProducts = products.filter((p) => p.productType === 'sourced');

      // Calculate average breakdown
      let materialsCost = 0;
      let labourCost = 0;
      let packagingCost = 0;
      let supplierCost = 0;

      handmadeProducts.forEach((p) => {
        if (p.productType === 'handmade') {
          packagingCost += toMajorUnits(p.packagingCost, currency);
          // We'd need to calculate materials and labour from the saved data
          // For now use product cost proportionally
          materialsCost += toMajorUnits(p.calculatedCost, currency) * 0.6;
          labourCost += toMajorUnits(p.calculatedCost, currency) * 0.3;
        }
      });

      sourcedProducts.forEach((p) => {
        if (p.productType === 'sourced') {
          supplierCost += toMajorUnits(p.supplierCost, currency);
        }
      });

      costBreakdown = [
        { name: 'Materials', value: materialsCost, color: '#ef4444' },
        { name: 'Labour', value: labourCost, color: '#f59e0b' },
        { name: 'Packaging', value: packagingCost, color: '#10b981' },
        { name: 'Supplier Costs', value: supplierCost, color: '#8b5cf6' },
      ].filter((item) => item.value > 0);
    }

    return { profitTrends, platformComparison, costBreakdown };
  }, [products, stats.hasData, currency]);

  const quickActions = [
    {
      title: 'Calculator',
      description: 'Calculate profit and margins',
      href: '/calculator',
      icon: Calculator,
      show: true,
    },
    {
      title: 'Add Product',
      description: 'Create a new product',
      href: '/products',
      icon: Package,
      show: true,
    },
    {
      title: 'Materials',
      description: 'Manage your materials library',
      href: '/materials',
      icon: Layers,
      show: showMaterialsLibrary,
    },
    {
      title: 'Suppliers',
      description: 'Manage your suppliers',
      href: '/suppliers',
      icon: TrendingUp,
      show: showSuppliers,
    },
  ].filter((action) => action.show);

  const isLoading = productsLoading || materialsLoading;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s an overview of your pricing and profit calculations.
          </p>
        </div>
        <Link href="/calculator">
          <Button className="gap-2">
            <Calculator className="h-4 w-4" />
            Open Calculator
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Products</CardDescription>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoading ? (
                <div className="h-9 w-12 animate-pulse rounded bg-muted" />
              ) : (
                stats.totalProducts
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalProducts === 1 ? 'product' : 'products'} in library
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Materials</CardDescription>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoading ? (
                <div className="h-9 w-12 animate-pulse rounded bg-muted" />
              ) : (
                stats.totalMaterials
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalMaterials === 1 ? 'material' : 'materials'} tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Avg. Product Cost</CardDescription>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoading ? (
                <div className="h-9 w-20 animate-pulse rounded bg-muted" />
              ) : stats.avgCost > 0 ? (
                `${symbol}${stats.avgCost.toFixed(2)}`
              ) : (
                '--'
              )}
            </div>
            <p className="text-xs text-muted-foreground">across all products</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Calculations</CardDescription>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">saved calculations</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className="group h-full cursor-pointer transition-all hover:border-primary hover:bg-muted/50 hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <action.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                  </div>
                  <CardTitle className="text-base">{action.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Charts Section - Only show when there's data or show sample data */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Analytics</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <ProfitTrendsChart data={chartData.profitTrends} />
          <PlatformComparisonChart data={chartData.platformComparison} />
        </div>
      </div>

      {/* Cost Breakdown - Only show if there's actual product data */}
      {chartData.costBreakdown.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <CostBreakdownChart data={chartData.costBreakdown} />
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Cost Summary</CardTitle>
              <CardDescription>Breakdown of your average product costs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chartData.costBreakdown.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="font-medium">{symbol}{item.value.toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between font-semibold">
                    <span>Total</span>
                    <span>
                      {symbol}
                      {chartData.costBreakdown.reduce((sum, item) => sum + item.value, 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Getting Started - Show if no products */}
      {!isLoading && stats.totalProducts === 0 && (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Complete these steps to get the most out of EcomProfitCalculator
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                1
              </div>
              <div className="flex-1">
                <p className="font-medium">Add your first product</p>
                <p className="text-sm text-muted-foreground">
                  Create a product with your costs to start calculating profits
                </p>
              </div>
              <Link href="/products">
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                2
              </div>
              <div className="flex-1">
                <p className="font-medium">Use the calculator</p>
                <p className="text-sm text-muted-foreground">
                  See your profit margins and fees across platforms
                </p>
              </div>
              <Link href="/calculator">
                <Button variant="outline" size="sm">
                  Open Calculator
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                3
              </div>
              <div className="flex-1">
                <p className="font-medium">Compare platforms</p>
                <p className="text-sm text-muted-foreground">
                  See how fees differ between Etsy, eBay, Amazon and more
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
