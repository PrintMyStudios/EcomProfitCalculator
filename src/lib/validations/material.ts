import { z } from 'zod';

// Material units
export const MATERIAL_UNITS = [
  { value: 'g', label: 'grams (g)' },
  { value: 'kg', label: 'kilograms (kg)' },
  { value: 'oz', label: 'ounces (oz)' },
  { value: 'lb', label: 'pounds (lb)' },
  { value: 'ml', label: 'millilitres (ml)' },
  { value: 'l', label: 'litres (l)' },
  { value: 'cm', label: 'centimetres (cm)' },
  { value: 'm', label: 'metres (m)' },
  { value: 'inch', label: 'inches (in)' },
  { value: 'yard', label: 'yards (yd)' },
  { value: 'piece', label: 'pieces' },
  { value: 'sheet', label: 'sheets' },
  { value: 'roll', label: 'rolls' },
  { value: 'pack', label: 'packs' },
] as const;

export type MaterialUnit = typeof MATERIAL_UNITS[number]['value'];

// Material categories
export const MATERIAL_CATEGORIES = [
  { value: 'fabric', label: 'Fabric & Textiles' },
  { value: 'paper', label: 'Paper & Card' },
  { value: 'wood', label: 'Wood' },
  { value: 'metal', label: 'Metal' },
  { value: 'plastic', label: 'Plastic & Resin' },
  { value: 'paint', label: 'Paint & Finishes' },
  { value: 'yarn', label: 'Yarn & Thread' },
  { value: 'beads', label: 'Beads & Findings' },
  { value: 'leather', label: 'Leather' },
  { value: 'clay', label: 'Clay & Ceramics' },
  { value: 'glass', label: 'Glass' },
  { value: 'packaging', label: 'Packaging' },
  { value: 'adhesive', label: 'Adhesives & Glue' },
  { value: 'hardware', label: 'Hardware & Fixtures' },
  { value: 'other', label: 'Other' },
] as const;

export type MaterialCategory = typeof MATERIAL_CATEGORIES[number]['value'];

// Validation schema for material form
export const materialSchema = z.object({
  name: z
    .string()
    .min(1, 'Material name is required')
    .max(100, 'Name must be less than 100 characters'),
  unit: z
    .string()
    .min(1, 'Unit is required'),
  costPerUnit: z
    .number({ message: 'Cost must be a number' })
    .min(0, 'Cost must be 0 or greater'),
  supplier: z
    .string()
    .max(100, 'Supplier name must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  supplierSku: z
    .string()
    .max(50, 'SKU must be less than 50 characters')
    .optional()
    .or(z.literal('')),
  category: z
    .string()
    .optional()
    .or(z.literal('')),
  notes: z
    .string()
    .max(500, 'Notes must be less than 500 characters')
    .optional()
    .or(z.literal('')),
});

export type MaterialFormValues = z.infer<typeof materialSchema>;

// Transform form values to Firestore input
export function transformMaterialFormToInput(values: MaterialFormValues) {
  return {
    name: values.name.trim(),
    unit: values.unit,
    costPerUnit: values.costPerUnit,
    supplier: values.supplier?.trim() || undefined,
    supplierSku: values.supplierSku?.trim() || undefined,
    category: values.category || undefined,
    notes: values.notes?.trim() || undefined,
  };
}
