// User & Settings
// Sellers can do multiple things - this is multi-select during onboarding
export type SellerType = 'handmade' | 'dropship' | 'print_on_demand' | 'resale';

export type Currency = 'GBP' | 'USD' | 'EUR' | 'CAD' | 'AUD' | 'JPY' | 'CHF' | 'SEK' | 'NOK' | 'DKK';

export interface UserProfile {
  id: string;
  email: string;
  sellerTypes: SellerType[]; // Multi-select: what types of selling do you do?
  country: string;
  currency: Currency;
  vatRegistered: boolean;
  vatNumber?: string;
  defaultHourlyRate: number; // in minor units
  defaultTargetMargin: number; // percentage
  primaryPlatform: PlatformKey;
  // UI preferences - which features to show in nav
  showMaterialsLibrary: boolean;
  showSuppliers: boolean;
  showTimeTracking: boolean;
  // Onboarding status
  onboardingCompleted: boolean;
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

// Product type discriminator
export type ProductType = 'handmade' | 'sourced';

// Base product fields shared by all product types
interface BaseProduct {
  id: string;
  userId: string;
  name: string;
  sku?: string;
  notes?: string;
  tags?: string[]; // for organization
  isFavourite: boolean;
  calculatedCost: number; // auto-calculated, in minor units
  createdAt: Date;
  updatedAt: Date;
}

// Handmade product: materials + labour + packaging
export interface HandmadeProduct extends BaseProduct {
  productType: 'handmade';
  materials: ProductMaterial[];
  labourHours?: number;
  labourRate?: number; // in minor units
  labourTasks?: LabourTask[];
  packagingCost: number; // in minor units
}

// Sourced product: dropship, POD, or resale - simple supplier cost
export interface SourcedProduct extends BaseProduct {
  productType: 'sourced';
  supplierId?: string;
  supplierName?: string; // for quick entry without creating a supplier
  supplierCost: number; // in minor units
  supplierShippingCost: number; // in minor units
  supplierUrl?: string;
  sourceType: 'dropship' | 'print_on_demand' | 'resale' | 'wholesale';
}

export type Product = HandmadeProduct | SourcedProduct;

// Type guard helpers
export function isHandmadeProduct(product: Product): product is HandmadeProduct {
  return product.productType === 'handmade';
}

export function isSourcedProduct(product: Product): product is SourcedProduct {
  return product.productType === 'sourced';
}

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

// Payment Methods
export type PaymentMethod = 'platform_included' | 'paypal' | 'stripe' | 'square' | 'manual';

// Overhead/Fixed Costs
export interface OverheadItem {
  id: string;
  name: string;
  amount: number;  // Monthly cost in minor units
  category?: 'rent' | 'utilities' | 'software' | 'insurance' | 'marketing' | 'other';
}

// Discount Analysis
export interface DiscountAnalysisResult {
  discountPercent: number;
  discountedPrice: number;
  originalPrice: number;
  discount: number;
  fees: number;
  profit: number;
  margin: number;
  isProfitable: boolean;
}

// Batch Pricing
export interface BatchTier {
  quantity: number;
  unitCost: number;
  profitPerUnit: number;
  totalProfit: number;
  margin: number;
}

// Scenario Analysis
export interface ScenarioConfig {
  name: string;
  materialCostChange: number;    // percentage change, e.g., 10 for +10%
  labourCostChange: number;
  shippingCostChange: number;
  salePriceChange: number;
}

export interface ScenarioResult {
  scenario: ScenarioConfig;
  profit: number;
  margin: number;
  profitChange: number;     // vs base case
  marginChange: number;
}
