'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useSavedCalculations } from '@/hooks/use-saved-calculations';
import { useSettingsStore } from '@/stores/settings';
import { toMajorUnits, getCurrencySymbol } from '@/lib/constants/currencies';
import { TableSkeleton } from '@/components/skeletons';
import {
  History,
  Calculator,
  MoreVertical,
  Trash2,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Package,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Platform colors for visual identification
const PLATFORM_COLORS: Record<string, string> = {
  etsy: 'bg-orange-500',
  ebay: 'bg-red-500',
  amazon: 'bg-amber-500',
  shopify: 'bg-green-500',
  tiktok: 'bg-black',
};

const PLATFORM_NAMES: Record<string, string> = {
  etsy: 'Etsy',
  ebay: 'eBay',
  amazon: 'Amazon',
  shopify: 'Shopify',
  tiktok: 'TikTok Shop',
};

export default function HistoryPage() {
  const { calculations, isLoading, deleteCalculation, clearAllCalculations } = useSavedCalculations();
  const currency = useSettingsStore((state) => state.currency);
  const symbol = getCurrencySymbol(currency);

  const [isClearing, setIsClearing] = useState(false);

  const formatCurrency = (amountInMinorUnits: number) => {
    const major = toMajorUnits(amountInMinorUnits, currency);
    return `${symbol}${major.toFixed(2)}`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCalculation(id);
      toast.success('Calculation deleted');
    } catch (error) {
      console.error('Failed to delete calculation:', error);
      toast.error('Failed to delete calculation');
    }
  };

  const handleClearAll = async () => {
    setIsClearing(true);
    try {
      await clearAllCalculations();
      toast.success('All calculations cleared');
    } catch (error) {
      console.error('Failed to clear calculations:', error);
      toast.error('Failed to clear calculations');
    } finally {
      setIsClearing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded" />
          </div>
        </div>
        <TableSkeleton rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl flex items-center gap-2">
            <History className="h-7 w-7" />
            Saved Calculations
          </h1>
          <p className="text-muted-foreground">
            View and manage your saved profit calculations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/calculator">
            <Button variant="outline" className="gap-2">
              <Calculator className="h-4 w-4" />
              New Calculation
            </Button>
          </Link>
          {calculations.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-destructive hover:text-destructive">
                  Clear All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear all calculations?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all {calculations.length} saved calculations.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearAll}
                    disabled={isClearing}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isClearing ? 'Clearing...' : 'Clear All'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {/* Empty State */}
      {calculations.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No saved calculations</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground max-w-sm">
              Your calculation history will appear here. Use the calculator to analyse
              profit and margins for your products.
            </p>
            <Link href="/calculator" className="mt-6">
              <Button className="gap-2">
                <Calculator className="h-4 w-4" />
                Start Calculating
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        /* Calculations List */
        <div className="space-y-4">
          {calculations.map((calc) => {
            const isProfitable = calc.result.profit > 0;
            const margin = calc.result.margin;

            return (
              <Card key={calc.id} className="group hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    {/* Left side: Product info */}
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div
                        className={cn(
                          'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                          calc.itemType === 'product' ? 'bg-primary/10' : 'bg-muted'
                        )}
                      >
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold truncate">{calc.itemName}</h3>
                          <Badge
                            variant="outline"
                            className={cn(
                              'text-xs',
                              PLATFORM_COLORS[calc.platformKey]
                                ? `border-${calc.platformKey}`
                                : ''
                            )}
                          >
                            <span
                              className={cn(
                                'w-2 h-2 rounded-full mr-1.5',
                                PLATFORM_COLORS[calc.platformKey] || 'bg-gray-500'
                              )}
                            />
                            {PLATFORM_NAMES[calc.platformKey] || calc.platformKey}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {formatDate(calc.timestamp)}
                        </p>
                      </div>
                    </div>

                    {/* Right side: Results */}
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <div className="text-sm text-muted-foreground">Sale Price</div>
                        <div className="font-medium">
                          {formatCurrency(calc.input.salePrice)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Profit</div>
                        <div
                          className={cn(
                            'font-semibold flex items-center gap-1 justify-end',
                            isProfitable ? 'text-emerald-600' : 'text-red-600'
                          )}
                        >
                          {isProfitable ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                          {formatCurrency(calc.result.profit)}
                        </div>
                      </div>
                      <div className="text-right hidden sm:block">
                        <div className="text-sm text-muted-foreground">Margin</div>
                        <div
                          className={cn(
                            'font-medium',
                            margin >= 30
                              ? 'text-emerald-600'
                              : margin >= 15
                                ? 'text-amber-600'
                                : 'text-red-600'
                          )}
                        >
                          {margin.toFixed(1)}%
                        </div>
                      </div>

                      {/* Actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/calculator${calc.itemType === 'product' && calc.itemId ? `?productId=${calc.itemId}` : ''}`}
                              className="gap-2"
                            >
                              <RotateCcw className="h-4 w-4" />
                              Re-calculate
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(calc.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Mobile: Additional info */}
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t sm:hidden">
                    <div>
                      <div className="text-xs text-muted-foreground">Sale Price</div>
                      <div className="text-sm font-medium">
                        {formatCurrency(calc.input.salePrice)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Margin</div>
                      <div
                        className={cn(
                          'text-sm font-medium',
                          margin >= 30
                            ? 'text-emerald-600'
                            : margin >= 15
                              ? 'text-amber-600'
                              : 'text-red-600'
                        )}
                      >
                        {margin.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Summary Stats */}
      {calculations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Summary</CardTitle>
            <CardDescription>Overview of your saved calculations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Total Calculations</div>
                <div className="text-2xl font-bold">{calculations.length}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Profitable</div>
                <div className="text-2xl font-bold text-emerald-600">
                  {calculations.filter((c) => c.result.profit > 0).length}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Avg. Margin</div>
                <div className="text-2xl font-bold">
                  {calculations.length > 0
                    ? (
                        calculations.reduce((sum, c) => sum + c.result.margin, 0) /
                        calculations.length
                      ).toFixed(1)
                    : 0}
                  %
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Profit</div>
                <div className="text-2xl font-bold">
                  {formatCurrency(
                    calculations.reduce((sum, c) => sum + c.result.profit, 0)
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
