import { z } from 'zod';

// Bundle form schema
export const bundleSchema = z.object({
  name: z
    .string()
    .min(1, 'Bundle name is required')
    .max(200, 'Name must be less than 200 characters'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  productIds: z
    .array(z.string())
    .min(2, 'Select at least 2 products'),
  suggestedPrice: z
    .number()
    .min(0, 'Price must be 0 or greater')
    .optional(),
  notes: z
    .string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional()
    .or(z.literal('')),
  tags: z.array(z.string()).optional(),
  isFavourite: z.boolean().optional(),
});

export type BundleFormValues = z.infer<typeof bundleSchema>;

// Calculate bundle cost from products
export function calculateBundleCost(productCosts: number[]): number {
  return productCosts.reduce((sum, cost) => sum + cost, 0);
}

// Calculate discount percentage if suggested price is set
export function calculateBundleDiscount(
  totalCost: number,
  suggestedPrice: number
): number {
  if (suggestedPrice >= totalCost || suggestedPrice <= 0) return 0;
  return ((totalCost - suggestedPrice) / totalCost) * 100;
}
