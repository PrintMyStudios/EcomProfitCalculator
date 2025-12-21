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
  costPerUnit: number; // in minor units (from preferred supplier or manual)
  // NEW: Array of supplier links (many-to-many)
  supplierLinks: MaterialSupplierLink[];
  // DEPRECATED: Keep for migration, will be removed
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

// ============================================
// Suppliers (Unified - for materials AND products)
// ============================================

// Supplier type discriminator
export type SupplierType = 'materials' | 'products' | 'both';

// Platform for product suppliers (dropship/POD/resale)
export type SupplierPlatform =
  | 'aliexpress'
  | 'alibaba'
  | 'cjdropshipping'
  | 'printful'
  | 'printify'
  | 'gooten'
  | 'wholesale'
  | 'local'
  | 'other';

// Contact information shared across all suppliers
export interface SupplierContact {
  email?: string;
  phone?: string;
  contactName?: string;
}

// Materials supplier additional fields
export interface MaterialsSupplierFields {
  accountNumber?: string;
  customerReference?: string;
  minimumOrderValue?: number; // in minor units
  leadTimeDays?: number;
  freeShippingThreshold?: number; // in minor units
}

// Product supplier additional fields (dropship/POD/resale)
export interface ProductSupplierFields {
  platform: SupplierPlatform;
  shipsFrom?: string; // e.g., "China", "USA", "UK"
  shippingTimeDaysMin?: number;
  shippingTimeDaysMax?: number;
  processingTimeDays?: number;
  handlesReturns?: boolean;
  isPrintOnDemand?: boolean;
}

// Unified Supplier interface
export interface Supplier {
  id: string;
  userId: string;
  name: string;
  supplierType: SupplierType;
  currency: Currency;
  website?: string;
  notes?: string;
  contact?: SupplierContact;
  // Conditional fields based on supplierType
  materialsFields?: MaterialsSupplierFields;
  productsFields?: ProductSupplierFields;
  isFavourite: boolean;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Type guards for supplier type checking
export function isMaterialsSupplier(supplier: Supplier): boolean {
  return supplier.supplierType === 'materials' || supplier.supplierType === 'both';
}

export function isProductsSupplier(supplier: Supplier): boolean {
  return supplier.supplierType === 'products' || supplier.supplierType === 'both';
}

// ============================================
// Material-Supplier Links (Many-to-Many)
// ============================================

// Quality rating for supplier-material relationship
export type QualityRating = 1 | 2 | 3 | 4 | 5;

// Stock availability status
export type StockStatus =
  | 'in_stock'
  | 'low_stock'
  | 'out_of_stock'
  | 'discontinued'
  | 'unknown';

// The link between a Material and a Supplier
export interface MaterialSupplierLink {
  id: string;
  supplierId: string;
  supplierName: string; // Denormalized for display
  costPerUnit: number; // in minor units
  currency: Currency;
  sku?: string;
  productUrl?: string;
  qualityRating?: QualityRating;
  stockStatus: StockStatus;
  lastCheckedDate?: Date;
  minimumOrderQuantity?: number;
  packSize?: number;
  isPreferred: boolean;
  costHistory: CostHistoryEntry[];
  createdAt: Date;
  updatedAt: Date;
}

// Helper to get the preferred supplier link
export function getPreferredSupplierLink(
  supplierLinks: MaterialSupplierLink[]
): MaterialSupplierLink | undefined {
  return supplierLinks.find((link) => link.isPreferred);
}

// Helper to get the lowest cost supplier link
export function getLowestCostSupplierLink(
  supplierLinks: MaterialSupplierLink[]
): MaterialSupplierLink | undefined {
  if (supplierLinks.length === 0) return undefined;
  return supplierLinks.reduce((lowest, link) =>
    link.costPerUnit < lowest.costPerUnit ? link : lowest
  );
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

// ============================================
// Bundles (Multiple products sold together)
// ============================================

export interface Bundle {
  id: string;
  userId: string;
  name: string;
  description?: string;
  productIds: string[]; // References to Product IDs
  // Cost is auto-calculated from products
  calculatedCost: number; // Sum of product costs, in minor units
  // Optional suggested price for the bundle
  suggestedPrice?: number; // in minor units
  // Meta
  isFavourite: boolean;
  tags?: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
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
