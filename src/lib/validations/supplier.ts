import { z } from 'zod';
import type { SupplierType, SupplierPlatform } from '@/types';

// Supplier types with labels and descriptions
export const SUPPLIER_TYPES = [
  {
    value: 'materials' as SupplierType,
    label: 'Materials',
    description: 'For buying craft supplies, raw materials',
  },
  {
    value: 'products' as SupplierType,
    label: 'Products',
    description: 'For dropshipping, POD, or reselling',
  },
  {
    value: 'both' as SupplierType,
    label: 'Both',
    description: 'Provides materials and finished products',
  },
] as const;

// Supplier platforms with colors for badges (for product suppliers)
export const SUPPLIER_PLATFORMS = [
  { value: 'aliexpress' as SupplierPlatform, label: 'AliExpress', color: 'bg-orange-500' },
  { value: 'alibaba' as SupplierPlatform, label: 'Alibaba', color: 'bg-yellow-500' },
  { value: 'cjdropshipping' as SupplierPlatform, label: 'CJ Dropshipping', color: 'bg-blue-500' },
  { value: 'printful' as SupplierPlatform, label: 'Printful', color: 'bg-purple-500' },
  { value: 'printify' as SupplierPlatform, label: 'Printify', color: 'bg-pink-500' },
  { value: 'gooten' as SupplierPlatform, label: 'Gooten', color: 'bg-teal-500' },
  { value: 'wholesale' as SupplierPlatform, label: 'Wholesale', color: 'bg-indigo-500' },
  { value: 'local' as SupplierPlatform, label: 'Local Supplier', color: 'bg-green-500' },
  { value: 'other' as SupplierPlatform, label: 'Other', color: 'bg-gray-500' },
] as const;

// Contact fields schema
const contactSchema = z.object({
  contactName: z
    .string()
    .max(100, 'Contact name must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  email: z
    .string()
    .email('Invalid email address')
    .max(200, 'Email must be less than 200 characters')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .max(50, 'Phone must be less than 50 characters')
    .optional()
    .or(z.literal('')),
});

// Materials supplier fields schema
const materialsFieldsSchema = z.object({
  accountNumber: z
    .string()
    .max(100, 'Account number must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  customerReference: z
    .string()
    .max(100, 'Customer reference must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  minimumOrderValue: z.number().min(0).optional(),
  leadTimeDays: z.number().min(0).max(365).optional(),
  freeShippingThreshold: z.number().min(0).optional(),
});

// Product supplier fields schema
const productsFieldsSchema = z.object({
  platform: z.string().min(1, 'Platform is required'),
  shipsFrom: z
    .string()
    .max(100, 'Ships from must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  shippingTimeDaysMin: z.number().min(0).max(365).optional(),
  shippingTimeDaysMax: z.number().min(0).max(365).optional(),
  processingTimeDays: z.number().min(0).max(365).optional(),
  handlesReturns: z.boolean().optional(),
  isPrintOnDemand: z.boolean().optional(),
});

// Base supplier schema (common fields)
const baseSupplierSchema = z.object({
  name: z
    .string()
    .min(1, 'Supplier name is required')
    .max(100, 'Name must be less than 100 characters'),
  supplierType: z.enum(['materials', 'products', 'both']),
  currency: z.string().min(1, 'Currency is required'),
  website: z
    .string()
    .max(500, 'Website URL must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  notes: z
    .string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional()
    .or(z.literal('')),
  contact: contactSchema.optional(),
});

// Full supplier schema with conditional fields
export const supplierSchema = baseSupplierSchema.extend({
  materialsFields: materialsFieldsSchema.optional(),
  productsFields: productsFieldsSchema.optional(),
});

export type SupplierFormValues = z.infer<typeof supplierSchema>;

// Transform form values to Firestore input
export function transformSupplierFormToInput(values: SupplierFormValues) {
  const base = {
    name: values.name.trim(),
    supplierType: values.supplierType as SupplierType,
    currency: values.currency,
    website: values.website?.trim() || undefined,
    notes: values.notes?.trim() || undefined,
  };

  // Clean up contact fields
  const contact = values.contact
    ? {
        contactName: values.contact.contactName?.trim() || undefined,
        email: values.contact.email?.trim() || undefined,
        phone: values.contact.phone?.trim() || undefined,
      }
    : undefined;

  // Only include contact if at least one field is set
  const hasContact = contact && Object.values(contact).some(Boolean);

  // Clean up materials fields
  const materialsFields =
    (values.supplierType === 'materials' || values.supplierType === 'both') &&
    values.materialsFields
      ? {
          accountNumber: values.materialsFields.accountNumber?.trim() || undefined,
          customerReference: values.materialsFields.customerReference?.trim() || undefined,
          minimumOrderValue: values.materialsFields.minimumOrderValue || undefined,
          leadTimeDays: values.materialsFields.leadTimeDays || undefined,
          freeShippingThreshold: values.materialsFields.freeShippingThreshold || undefined,
        }
      : undefined;

  // Only include materialsFields if at least one field is set
  const hasMaterialsFields = materialsFields && Object.values(materialsFields).some(Boolean);

  // Clean up products fields
  const productsFields =
    (values.supplierType === 'products' || values.supplierType === 'both') &&
    values.productsFields
      ? {
          platform: values.productsFields.platform as SupplierPlatform,
          shipsFrom: values.productsFields.shipsFrom?.trim() || undefined,
          shippingTimeDaysMin: values.productsFields.shippingTimeDaysMin || undefined,
          shippingTimeDaysMax: values.productsFields.shippingTimeDaysMax || undefined,
          processingTimeDays: values.productsFields.processingTimeDays || undefined,
          handlesReturns: values.productsFields.handlesReturns || undefined,
          isPrintOnDemand: values.productsFields.isPrintOnDemand || undefined,
        }
      : undefined;

  // Only include productsFields if at least one field is set
  const hasProductsFields = productsFields && Object.values(productsFields).some(Boolean);

  return {
    ...base,
    ...(hasContact ? { contact } : {}),
    ...(hasMaterialsFields ? { materialsFields } : {}),
    ...(hasProductsFields ? { productsFields } : {}),
  };
}

// Get platform config by value
export function getSupplierPlatformConfig(platform: string) {
  return SUPPLIER_PLATFORMS.find((p) => p.value === platform);
}

// Get supplier type config by value
export function getSupplierTypeConfig(type: string) {
  return SUPPLIER_TYPES.find((t) => t.value === type);
}
