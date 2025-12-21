import { z } from 'zod';

// Product types
export type ProductType = 'handmade' | 'sourced';
export type SourceType = 'dropship' | 'print_on_demand' | 'resale' | 'wholesale';

// Labour task schema
export const labourTaskSchema = z.object({
  name: z.string().min(1, 'Task name is required'),
  minutes: z.number().min(0, 'Minutes must be 0 or greater'),
  ratePerHour: z.number().min(0, 'Rate must be 0 or greater'),
});

export type LabourTaskFormValues = z.infer<typeof labourTaskSchema>;

// Product material schema (for handmade products)
export const productMaterialSchema = z.object({
  materialId: z.string().min(1, 'Material is required'),
  materialName: z.string().optional(), // For display
  costPerUnit: z.number().optional(), // For display/calculation
  unit: z.string().optional(), // For display
  quantity: z.number().min(0.01, 'Quantity must be greater than 0'),
});

export type ProductMaterialFormValues = z.infer<typeof productMaterialSchema>;

// Base product schema (shared fields)
const baseProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200, 'Name must be less than 200 characters'),
  sku: z.string().max(50, 'SKU must be less than 50 characters').optional().or(z.literal('')),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional().or(z.literal('')),
  tags: z.array(z.string()).optional(),
  isFavourite: z.boolean().optional(),
});

// Handmade product schema
export const handmadeProductSchema = baseProductSchema.extend({
  productType: z.literal('handmade'),
  materials: z.array(productMaterialSchema),
  labourTasks: z.array(labourTaskSchema).optional(),
  // Simple labour fields (alternative to tasks)
  labourMinutes: z.number().min(0).optional(),
  labourRate: z.number().min(0).optional(),
  packagingCost: z.number().min(0, 'Packaging cost must be 0 or greater'),
});

export type HandmadeProductFormValues = z.infer<typeof handmadeProductSchema>;

// Sourced product schema
export const sourcedProductSchema = baseProductSchema.extend({
  productType: z.literal('sourced'),
  sourceType: z.enum(['dropship', 'print_on_demand', 'resale', 'wholesale']),
  supplierId: z.string().optional().or(z.literal('')),
  supplierName: z.string().optional().or(z.literal('')),
  supplierCost: z.number().min(0, 'Supplier cost must be 0 or greater'),
  supplierShippingCost: z.number().min(0, 'Shipping cost must be 0 or greater'),
  supplierUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

export type SourcedProductFormValues = z.infer<typeof sourcedProductSchema>;

// Combined product schema (union)
export const productSchema = z.discriminatedUnion('productType', [
  handmadeProductSchema,
  sourcedProductSchema,
]);

export type ProductFormValues = z.infer<typeof productSchema>;

// Source type options for UI
export const SOURCE_TYPE_OPTIONS = [
  { value: 'dropship', label: 'Dropshipping', description: 'Supplier ships directly to customer' },
  { value: 'print_on_demand', label: 'Print on Demand', description: 'Printed when ordered (e.g., Printful)' },
  { value: 'resale', label: 'Resale', description: 'Buy and resell products' },
  { value: 'wholesale', label: 'Wholesale', description: 'Buy in bulk at wholesale prices' },
] as const;

// Calculate handmade product cost
export function calculateHandmadeCost(
  materials: ProductMaterialFormValues[],
  labourTasks: LabourTaskFormValues[] = [],
  labourMinutes?: number,
  labourRate?: number,
  packagingCost: number = 0
): number {
  // Materials cost
  const materialsCost = materials.reduce((sum, m) => {
    const unitCost = m.costPerUnit || 0;
    return sum + unitCost * m.quantity;
  }, 0);

  // Labour cost from tasks
  const taskLabourCost = labourTasks.reduce((sum, task) => {
    return sum + (task.minutes / 60) * task.ratePerHour;
  }, 0);

  // Labour cost from simple fields
  const simpleLabourCost = labourMinutes && labourRate
    ? (labourMinutes / 60) * labourRate
    : 0;

  // Use whichever labour calculation is present
  const labourCost = taskLabourCost > 0 ? taskLabourCost : simpleLabourCost;

  return materialsCost + labourCost + packagingCost;
}

// Calculate sourced product cost
export function calculateSourcedCost(
  supplierCost: number,
  supplierShippingCost: number = 0
): number {
  return supplierCost + supplierShippingCost;
}
