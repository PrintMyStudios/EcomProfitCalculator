'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import {
  materialSupplierLinkSchema,
  type MaterialSupplierLinkFormValues,
  STOCK_STATUS_OPTIONS,
  QUALITY_RATINGS,
} from '@/lib/validations/material-supplier-link';
import { getCurrencySymbol, toMajorUnits, toMinorUnits } from '@/lib/constants/currencies';
import type { Supplier, MaterialSupplierLink, Currency } from '@/types';
import { isMaterialsSupplier } from '@/types';
import { Star, Package, Link2 } from 'lucide-react';

interface AddSupplierLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suppliers: Supplier[];
  materialCurrency: Currency;
  existingLink?: MaterialSupplierLink;
  existingSupplierIds: string[];
  onSubmit: (data: MaterialSupplierLinkFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

export function AddSupplierLinkDialog({
  open,
  onOpenChange,
  suppliers,
  materialCurrency,
  existingLink,
  existingSupplierIds,
  onSubmit,
  isSubmitting = false,
}: AddSupplierLinkDialogProps) {
  // Filter to only materials suppliers that aren't already linked (unless editing)
  const availableSuppliers = suppliers.filter((s) => {
    if (!isMaterialsSupplier(s)) return false;
    if (existingLink && s.id === existingLink.supplierId) return true;
    return !existingSupplierIds.includes(s.id);
  });

  const form = useForm<MaterialSupplierLinkFormValues>({
    resolver: zodResolver(materialSupplierLinkSchema),
    defaultValues: {
      supplierId: existingLink?.supplierId || '',
      supplierName: existingLink?.supplierName || '',
      costPerUnit: existingLink ? toMajorUnits(existingLink.costPerUnit, existingLink.currency) : 0,
      currency: existingLink?.currency || materialCurrency,
      sku: existingLink?.sku || '',
      productUrl: existingLink?.productUrl || '',
      qualityRating: existingLink?.qualityRating,
      stockStatus: existingLink?.stockStatus || 'unknown',
      minimumOrderQuantity: existingLink?.minimumOrderQuantity,
      packSize: existingLink?.packSize,
      isPreferred: existingLink?.isPreferred || false,
    },
  });

  // Reset form when dialog opens/closes or existingLink changes
  useEffect(() => {
    if (open) {
      form.reset({
        supplierId: existingLink?.supplierId || '',
        supplierName: existingLink?.supplierName || '',
        costPerUnit: existingLink ? toMajorUnits(existingLink.costPerUnit, existingLink.currency) : 0,
        currency: existingLink?.currency || materialCurrency,
        sku: existingLink?.sku || '',
        productUrl: existingLink?.productUrl || '',
        qualityRating: existingLink?.qualityRating,
        stockStatus: existingLink?.stockStatus || 'unknown',
        minimumOrderQuantity: existingLink?.minimumOrderQuantity,
        packSize: existingLink?.packSize,
        isPreferred: existingLink?.isPreferred || false,
      });
    }
  }, [open, existingLink, materialCurrency, form]);

  // Watch supplierId to auto-fill supplier name and currency
  const selectedSupplierId = form.watch('supplierId');
  useEffect(() => {
    if (selectedSupplierId && !existingLink) {
      const supplier = suppliers.find((s) => s.id === selectedSupplierId);
      if (supplier) {
        form.setValue('supplierName', supplier.name);
        form.setValue('currency', supplier.currency);
      }
    }
  }, [selectedSupplierId, suppliers, form, existingLink]);

  const handleSubmit = async (values: MaterialSupplierLinkFormValues) => {
    // Convert cost to minor units
    const transformedValues = {
      ...values,
      costPerUnit: toMinorUnits(values.costPerUnit, values.currency as Currency),
    };
    await onSubmit(transformedValues);
  };

  const selectedCurrency = form.watch('currency');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20">
              <Link2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <DialogTitle>
                {existingLink ? 'Edit Supplier Link' : 'Link Supplier'}
              </DialogTitle>
              <DialogDescription>
                {existingLink
                  ? 'Update the cost and details for this supplier'
                  : 'Add a supplier with their cost for this material'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-4">
            {/* Supplier Selection */}
            {!existingLink && (
              <FormField
                control={form.control}
                name="supplierId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Supplier <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a supplier" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableSuppliers.length === 0 ? (
                          <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            No available suppliers. Create one first.
                          </div>
                        ) : (
                          availableSuppliers.map((supplier) => (
                            <SelectItem key={supplier.id} value={supplier.id}>
                              {supplier.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Editing: show supplier name as read-only */}
            {existingLink && (
              <div>
                <p className="text-sm font-medium mb-1">Supplier</p>
                <p className="text-sm text-muted-foreground">{existingLink.supplierName}</p>
              </div>
            )}

            {/* Cost and SKU row */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="costPerUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Cost per Unit <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                          {getCurrencySymbol(selectedCurrency as Currency)}
                        </span>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          className="pl-8"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., AP-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Stock Status and Quality row */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="stockStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Package className="inline-block w-3.5 h-3.5 mr-1" />
                      Stock Status
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STOCK_STATUS_OPTIONS.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-2 h-2 rounded-full ${status.color}`}
                              />
                              {status.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="qualityRating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">
                      <Star className="inline-block w-3.5 h-3.5 mr-1" />
                      Quality
                    </FormLabel>
                    <Select
                      onValueChange={(v) => field.onChange(v ? parseInt(v) : undefined)}
                      value={field.value?.toString() || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Rate quality" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Not rated</SelectItem>
                        {QUALITY_RATINGS.map((rating) => (
                          <SelectItem key={rating.value} value={rating.value.toString()}>
                            {'★'.repeat(rating.value)}{'☆'.repeat(5 - rating.value)} {rating.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* MOQ and Pack Size row */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="minimumOrderQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Min. Order Qty</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="1"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="packSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Pack Size</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="1"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Product URL */}
            <FormField
              control={form.control}
              name="productUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Product URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preferred checkbox */}
            <FormField
              control={form.control}
              name="isPreferred"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 bg-muted/50">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="cursor-pointer">
                      Set as preferred supplier
                    </FormLabel>
                    <p className="text-xs text-muted-foreground">
                      The preferred supplier&apos;s cost will be used as the material&apos;s default cost
                    </p>
                  </div>
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || availableSuppliers.length === 0}
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white border-0"
              >
                {isSubmitting ? 'Saving...' : existingLink ? 'Update' : 'Add Supplier'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
