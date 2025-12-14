// User & Settings
export type UserMode = 'maker' | 'dropship';

export type Currency = 'GBP' | 'USD' | 'EUR' | 'CAD' | 'AUD' | 'JPY' | 'CHF' | 'SEK' | 'NOK' | 'DKK';

export interface UserProfile {
  id: string;
  email: string;
  mode: UserMode;
  country: string;
  currency: Currency;
  vatRegistered: boolean;
  vatNumber?: string;
  defaultHourlyRate: number; // in minor units
  defaultTargetMargin: number; // percentage
  primaryPlatform: PlatformKey;
  createdAt: Date;
  updatedAt: Date;
}

// Materials (Maker mode)
export interface Material {
  id: string;
  userId: string;
  name: string;
  unit: string; // 'sheet', 'ml', 'g', 'piece', etc.
  costPerUnit: number; // in minor units
  supplier?: string;
  supplierSku?: string;
  category?: string;
  notes?: string;
  isFavourite: boolean;
  usageCount: number;
  costHistory: CostHistoryEntry[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CostHistoryEntry {
  cost: number; // in minor units
  date: Date;
}

// Suppliers (Dropship mode)
export interface Supplier {
  id: string;
  userId: string;
  name: string;
  platform: 'aliexpress' | 'alibaba' | 'cjdropshipping' | 'printful' | 'other';
  currency: Currency;
  website?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Products
export interface ProductMaterial {
  materialId: string;
  quantity: number;
}

export interface LabourTask {
  name: string;
  minutes: number;
  ratePerHour: number; // in minor units
}

// Maker product with full cost breakdown
export interface MakerProduct {
  id: string;
  userId: string;
  name: string;
  sku?: string;
  materials: ProductMaterial[];
  labourHours?: number;
  labourRate?: number; // in minor units
  labourTasks?: LabourTask[];
  packagingCost: number; // in minor units
  notes?: string;
  calculatedCost: number; // auto-calculated, in minor units
  createdAt: Date;
  updatedAt: Date;
}

// Dropship product with simple cost
export interface DropshipProduct {
  id: string;
  userId: string;
  name: string;
  sku?: string;
  supplierId: string;
  supplierCost: number; // in minor units
  supplierShippingCost: number; // in minor units
  supplierUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Product = MakerProduct | DropshipProduct;

// Shipping Templates
export interface ShippingTemplate {
  id: string;
  userId: string;
  name: string;
  carrier: string;
  serviceType: string;
  cost: number; // in minor units
  maxWeight?: number; // in grams
  maxDimensions?: string;
  deliveryDaysMin?: number;
  deliveryDaysMax?: number;
  isTracked: boolean;
  requiresSignature: boolean;
  isFavourite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Platform Fees
export type PlatformKey = 'etsy' | 'ebay' | 'amazon' | 'shopify' | 'tiktok' | 'custom';

export type FeeType = 'percentage' | 'fixed';
export type FeeBase = 'item' | 'shipping' | 'subtotal' | 'order';

export interface FeeTerm {
  label: string;
  type: FeeType;
  base: FeeBase;
  value: number; // percentage (0-100) or fixed amount in minor units
}

export interface PlatformTemplate {
  id: string;
  userId?: string; // null for system defaults
  name: string;
  platformKey: PlatformKey;
  fees: FeeTerm[];
  vatOnShipping: boolean;
  isCustom: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Calculations
export interface CalculationInput {
  productCost: number; // in minor units
  salePrice: number; // in minor units
  shippingCost: number; // in minor units
  sellerPaysShipping: boolean;
  quantity: number;
  platformKey: PlatformKey;
  vatRate: number; // percentage (e.g., 20 for 20%)
  isVatRegistered: boolean;
}

export interface CalculationResult {
  revenue: number; // in minor units
  totalCost: number; // in minor units
  totalFees: number; // in minor units
  feesBreakdown: { label: string; amount: number }[];
  profit: number; // in minor units
  margin: number; // percentage
  breakEvenPrice: number; // in minor units
  targetPrice: number; // in minor units (for target margin)
  receiptsExVat?: number; // in minor units, for VAT-registered
}

export interface SavedCalculation {
  id: string;
  userId: string;
  itemType: 'product' | 'listing';
  itemId: string;
  itemName: string;
  input: CalculationInput;
  result: CalculationResult;
  platformKey: PlatformKey;
  timestamp: Date;
}

// Time Tracking (Maker mode)
export interface TimeSession {
  id: string;
  userId: string;
  itemType: 'product' | 'material';
  itemId: string;
  itemName: string;
  sessionType: 'manufacturing' | 'design';
  startTime: Date;
  endTime?: Date;
  durationMinutes?: number;
  itemsCompleted?: number;
  perItemMinutes?: number;
  notes?: string;
}

// Subscription
export type SubscriptionTier = 'free' | 'starter' | 'pro';

export interface Subscription {
  tier: SubscriptionTier;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodEnd?: Date;
}
