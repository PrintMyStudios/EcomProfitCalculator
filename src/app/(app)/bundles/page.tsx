'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useBundles } from '@/hooks/use-bundles';
import { useProducts } from '@/hooks/use-products';
import { useSettingsStore } from '@/stores/settings';
import { toMajorUnits, getCurrencySymbol, formatCurrency } from '@/lib/constants/currencies';
import { bundleSchema, type BundleFormValues, calculateBundleDiscount } from '@/lib/validations/bundle';
import { TableSkeleton } from '@/components/skeletons';
import {
  Gift,
  Plus,
  MoreVertical,
  Trash2,
  Star,
  Calculator,
  Package,
  Pencil,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Bundle, Product } from '@/types';

export default function BundlesPage() {
  const { bundles, isLoading, createBundle, updateBundle, deleteBundle, toggleFavourite } =
    useBundles();
  const { products, isLoading: productsLoading } = useProducts();
  const currency = useSettingsStore((state) => state.currency);
  const symbol = getCurrencySymbol(currency);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if we have enough products
  const hasEnoughProducts = products.length >= 2;

  const form = useForm<BundleFormValues>({
    resolver: zodResolver(bundleSchema),
    defaultValues: {
      name: '',
      description: '',
      productIds: [],
      suggestedPrice: undefined,
      notes: '',
      tags: [],
      isFavourite: false,
    },
  });

  // Watch selected products for cost calculation
  const selectedProductIds = form.watch('productIds');
  const suggestedPrice = form.watch('suggestedPrice');

  // Calculate bundle cost from selected products
  const bundleCost = useMemo(() => {
    return selectedProductIds.reduce((sum, id) => {
      const product = products.find((p) => p.id === id);
      return sum + (product?.calculatedCost || 0);
    }, 0);
  }, [selectedProductIds, products]);

  // Calculate discount if suggested price is set
  const discount = useMemo(() => {
    if (!suggestedPrice || suggestedPrice >= toMajorUnits(bundleCost, currency)) return 0;
    const suggestedPriceMinor = suggestedPrice * 100; // Convert to minor units
    return calculateBundleDiscount(bundleCost, suggestedPriceMinor);
  }, [bundleCost, suggestedPrice, currency]);

  const openCreateForm = () => {
    setEditingBundle(null);
    form.reset({
      name: '',
      description: '',
      productIds: [],
      suggestedPrice: undefined,
      notes: '',
      tags: [],
      isFavourite: false,
    });
    setIsFormOpen(true);
  };

  const openEditForm = (bundle: Bundle) => {
    setEditingBundle(bundle);
    form.reset({
      name: bundle.name,
      description: bundle.description || '',
      productIds: bundle.productIds,
      suggestedPrice: bundle.suggestedPrice
        ? toMajorUnits(bundle.suggestedPrice, currency)
        : undefined,
      notes: bundle.notes || '',
      tags: bundle.tags || [],
      isFavourite: bundle.isFavourite,
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (values: BundleFormValues) => {
    setIsSubmitting(true);
    try {
      // Convert suggested price to minor units if set
      const formData = {
        ...values,
        suggestedPrice: values.suggestedPrice
          ? Math.round(values.suggestedPrice * 100)
          : undefined,
      };

      if (editingBundle) {
        await updateBundle(editingBundle.id, formData, products);
        toast.success('Bundle updated');
      } else {
        await createBundle(formData, products);
        toast.success('Bundle created');
      }
      setIsFormOpen(false);
      form.reset();
    } catch (error) {
      console.error('Failed to save bundle:', error);
      toast.error('Failed to save bundle');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBundle(id);
      toast.success('Bundle deleted');
    } catch (error) {
      console.error('Failed to delete bundle:', error);
      toast.error('Failed to delete bundle');
    }
  };

  const handleToggleFavourite = async (id: string, current: boolean) => {
    try {
      await toggleFavourite(id, current);
    } catch (error) {
      console.error('Failed to update favourite:', error);
    }
  };

  // Get product names for display
  const getProductNames = (productIds: string[]) => {
    return productIds
      .map((id) => products.find((p) => p.id === id)?.name)
      .filter(Boolean) as string[];
  };

  if (isLoading || productsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-28 bg-muted animate-pulse rounded" />
            <div className="h-4 w-48 bg-muted animate-pulse rounded" />
          </div>
        </div>
        <TableSkeleton rows={3} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl flex items-center gap-2">
            <Gift className="h-7 w-7" />
            Bundles
          </h1>
          <p className="text-muted-foreground">
            Sell multiple products together at a combined price
          </p>
        </div>
        {hasEnoughProducts && (
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateForm} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Bundle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingBundle ? 'Edit Bundle' : 'Create Bundle'}
                </DialogTitle>
                <DialogDescription>
                  Select 2 or more products to sell together
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  {/* Bundle Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bundle Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Starter Kit Bundle" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe what's included in this bundle..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Product Selection */}
                  <FormField
                    control={form.control}
                    name="productIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Products (select 2 or more)</FormLabel>
                        <div className="border rounded-lg divide-y max-h-64 overflow-y-auto">
                          {products.map((product) => {
                            const isSelected = field.value.includes(product.id);
                            return (
                              <div
                                key={product.id}
                                className={cn(
                                  'flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors',
                                  isSelected && 'bg-primary/5'
                                )}
                                onClick={() => {
                                  const newValue = isSelected
                                    ? field.value.filter((id) => id !== product.id)
                                    : [...field.value, product.id];
                                  field.onChange(newValue);
                                }}
                              >
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={(checked) => {
                                    const newValue = checked
                                      ? [...field.value, product.id]
                                      : field.value.filter((id) => id !== product.id);
                                    field.onChange(newValue);
                                  }}
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">{product.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {product.productType === 'handmade' ? 'Handmade' : 'Sourced'}
                                  </p>
                                </div>
                                <span className="text-sm font-medium">
                                  {formatCurrency(product.calculatedCost, currency)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        <FormDescription>
                          {selectedProductIds.length} product(s) selected
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Cost Summary */}
                  {selectedProductIds.length >= 2 && (
                    <Card className="bg-muted/50">
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Combined Cost</span>
                            <span className="font-medium">
                              {formatCurrency(bundleCost, currency)}
                            </span>
                          </div>

                          {/* Suggested Price */}
                          <FormField
                            control={form.control}
                            name="suggestedPrice"
                            render={({ field }) => (
                              <FormItem>
                                <div className="flex items-center justify-between">
                                  <FormLabel className="text-sm text-muted-foreground">
                                    Suggested Bundle Price
                                  </FormLabel>
                                  {discount > 0 && (
                                    <span className="text-xs font-medium text-emerald-600">
                                      {discount.toFixed(0)}% off
                                    </span>
                                  )}
                                </div>
                                <FormControl>
                                  <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                      {symbol}
                                    </span>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      className="pl-8"
                                      placeholder={toMajorUnits(bundleCost, currency).toFixed(2)}
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(
                                          e.target.value ? parseFloat(e.target.value) : undefined
                                        )
                                      }
                                    />
                                  </div>
                                </FormControl>
                                <FormDescription>
                                  Optional: Set a discounted price for the bundle
                                </FormDescription>
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Notes */}
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes (optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Internal notes about this bundle..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsFormOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting
                        ? 'Saving...'
                        : editingBundle
                          ? 'Update Bundle'
                          : 'Create Bundle'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Not Enough Products State */}
      {!hasEnoughProducts && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Gift className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Create Product Bundles</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground max-w-sm">
              Bundles let you sell multiple products together at a combined price.
              You need at least 2 products to create a bundle.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>You have {products.length} product{products.length !== 1 ? 's' : ''}</span>
            </div>
            <Link href="/products" className="mt-6">
              <Button className="gap-2">
                Go to Products
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {hasEnoughProducts && bundles.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Gift className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No bundles yet</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground max-w-sm">
              Create bundles to sell multiple products together at a discounted price.
            </p>
            <Button onClick={openCreateForm} className="mt-6 gap-2">
              <Plus className="h-4 w-4" />
              Create Your First Bundle
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Bundles List */}
      {hasEnoughProducts && bundles.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bundles.map((bundle) => {
            const productNames = getProductNames(bundle.productIds);
            const discount = bundle.suggestedPrice
              ? calculateBundleDiscount(bundle.calculatedCost, bundle.suggestedPrice)
              : 0;

            return (
              <Card key={bundle.id} className="group hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Gift className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{bundle.name}</CardTitle>
                        <CardDescription>
                          {bundle.productIds.length} products
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleToggleFavourite(bundle.id, bundle.isFavourite)}
                      >
                        <Star
                          className={cn(
                            'h-4 w-4',
                            bundle.isFavourite
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-muted-foreground'
                          )}
                        />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditForm(bundle)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/calculator?bundleCost=${bundle.calculatedCost}`}>
                              <Calculator className="h-4 w-4 mr-2" />
                              Use in Calculator
                            </Link>
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete bundle?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete &quot;{bundle.name}&quot;. This action
                                  cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(bundle.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Product List */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {productNames.slice(0, 3).map((name, i) => (
                      <span
                        key={i}
                        className="text-xs bg-muted px-2 py-0.5 rounded-full truncate max-w-[120px]"
                      >
                        {name}
                      </span>
                    ))}
                    {productNames.length > 3 && (
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                        +{productNames.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Combined Cost</span>
                      <span className="font-medium">
                        {formatCurrency(bundle.calculatedCost, currency)}
                      </span>
                    </div>
                    {bundle.suggestedPrice && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Bundle Price</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-emerald-600">
                            {formatCurrency(bundle.suggestedPrice, currency)}
                          </span>
                          {discount > 0 && (
                            <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded dark:bg-emerald-900 dark:text-emerald-300">
                              -{discount.toFixed(0)}%
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
