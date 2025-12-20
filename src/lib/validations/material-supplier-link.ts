import { z } from 'zod';
import type { StockStatus, QualityRating, Currency } from '@/types';

// Stock status options with labels and colors
export const STOCK_STATUS_OPTIONS = [
  { value: 'in_stock' as StockStatus, label: 'In Stock', color: 'bg-green-500' },
  { value: 'low_stock' as StockStatus, label: 'Low Stock', color: 'bg-yellow-500' },
  { value: 'out_of_stock' as StockStatus, label: 'Out of Stock', color: 'bg-red-500' },
  { value: 'discontinued' as StockStatus, label: 'Discontinued', color: 'bg-gray-500' },
  { value: 'unknown' as StockStatus, label: 'Unknown', color: 'bg-gray-400' },
] as const;

// Quality rating labels
export const QUALITY_RATINGS = [
  { value: 1 as QualityRating, label: 'Poor' },
  { value: 2 as QualityRating, label: 'Fair' },
  { value: 3 as QualityRating, label: 'Good' },
  { value: 4 as QualityRating, label: 'Very Good' },
  { value: 5 as QualityRating, label: 'Excellent' },
] as const;

// Validation schema for material-supplier link form
export const materialSupplierLinkSchema = z.object({
  supplierId: z.string().min(1, 'Please select a supplier'),
  supplierName: z.string().min(1, 'Supplier name is required'),
  costPerUnit: z.number().min(0, 'Cost must be 0 or greater'),
  currency: z.string().min(1, 'Currency is required'),
  sku: z
    .string()
    .max(100, 'SKU must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  productUrl: z
    .string()
    .max(500, 'URL must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  qualityRating: z.number().min(1).max(5).optional(),
  stockStatus: z.enum(['in_stock', 'low_stock', 'out_of_stock', 'discontinued', 'unknown']),
  minimumOrderQuantity: z.number().min(1).optional(),
  packSize: z.number().min(1).optional(),
  isPreferred: z.boolean(),
});

export type MaterialSupplierLinkFormValues = z.infer<typeof materialSupplierLinkSchema>;

// Transform form values to the link object
export function transformLinkFormToInput(values: MaterialSupplierLinkFormValues) {
  return {
    supplierId: values.supplierId,
    supplierName: values.supplierName,
    costPerUnit: values.costPerUnit,
    currency: values.currency as Currency,
    sku: values.sku?.trim() || undefined,
    productUrl: values.productUrl?.trim() || undefined,
    qualityRating: values.qualityRating as QualityRating | undefined,
    stockStatus: values.stockStatus as StockStatus,
    minimumOrderQuantity: values.minimumOrderQuantity || undefined,
    packSize: values.packSize || undefined,
    isPreferred: values.isPreferred,
  };
}

// Get stock status config by value
export function getStockStatusConfig(status: string) {
  return STOCK_STATUS_OPTIONS.find((s) => s.value === status);
}

// Get quality rating config by value
export function getQualityRatingConfig(rating: number) {
  return QUALITY_RATINGS.find((r) => r.value === rating);
}
