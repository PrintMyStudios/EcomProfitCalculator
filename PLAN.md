# PLAN.md - EcomProfitCalculator

## Current Focus
M5 - Platform & Shipping Templates

## Milestones
- [x] M0 - Project setup ✅
- [x] M1 - Free Etsy calculator (SEO landing page) ✅
- [x] M2 - Auth + onboarding wizard ✅
- [x] M3 - Core calculator (both product types) ✅
- [x] M3.5 - Calculator Pro Features ✅
- [x] M4 - Product management ✅
- [ ] M5 - Platform & shipping templates (+ weight-based shipping)
- [ ] M6 - Comparison, history, dashboard
- [ ] M7 - Stripe subscriptions
- [ ] M8 - All SEO pages + polish + launch (+ advanced export)
- [ ] M9 - Wholesale/B2B Mode

---

## M0 - Project Setup ✅ COMPLETE
**Goal:** Scaffold the project with all core dependencies and folder structure.

**Done when:**
- [x] Next.js 14 with App Router initialized
- [x] TypeScript configured strictly
- [x] Tailwind CSS v4 installed and configured
- [x] shadcn/ui initialized with base components (button, input, card)
- [x] Firebase config scaffolded (needs credentials in .env.local)
- [x] Folder structure matches CLAUDE.md spec
- [x] Git initialized and pushed to GitHub
- [x] ESLint configured
- [x] `npm run dev` works
- [x] Core calculation library (fees, profit, rounding)
- [x] Type definitions for all entities
- [x] Platform fee constants (Etsy, eBay, Amazon, Shopify, TikTok)
- [x] Currency constants with VAT rates (10 currencies)
- [x] Zustand settings store with hybrid seller support
- [x] useAuth hook scaffolded

---

## M1 - Free Etsy Calculator (SEO Landing Page) ✅ COMPLETE
**Goal:** Ship a free, no-login Etsy fee calculator that ranks in search and funnels users to signup.

**Done when:**
- [x] `/calculators/etsy-fee-calculator` page exists (SSG)
- [x] SEO meta tags and Open Graph configured
- [x] Structured data (FAQ schema) for rich snippets
- [x] Calculator component: product cost, sale price, shipping inputs
- [x] Etsy fee calculation: 6.5% + 4% + £0.20 + £0.15
- [x] Results show: fees breakdown, profit, margin, break-even price

**Bonus (completed early from M8):**
- [x] Homepage landing page with hero, features, pricing sections
- [x] `/calculators/ebay-fee-calculator` page with SEO
- [x] `/calculators/amazon-fba-calculator` page with SEO
- [x] `/calculators/shopify-profit-calculator` page with SEO
- [x] `/calculators/tiktok-shop-calculator` page with SEO
- [x] No login required to use
- [x] CTA: "Save & compare across platforms → Sign up free"
- [x] Mobile responsive, dark mode supported
- [x] Free shipping toggle (seller pays shipping)
- [x] VAT registered toggle (UK 20%)
- [x] Links to other calculator pages (coming soon)

---

## M2 - Auth + Onboarding Wizard ✅ COMPLETE
**Goal:** Users can create accounts and configure their seller profile.

**Done when:**
- [x] Firebase Auth integrated (email + Google)
- [x] `/login`, `/signup`, `/forgot-password` pages
- [x] Protected routes redirect unauthenticated users
- [x] Onboarding wizard after first signup:
  - [x] "What do you sell?" → Multi-select: Handmade, Dropship, Print-on-Demand, Resale
  - [x] Country selection (15 countries)
  - [x] VAT registered? (Yes/No/Not sure)
  - [x] Primary marketplace (Etsy, eBay, Amazon, Shopify, TikTok)
  - [x] Currency (auto-suggested from country)
- [x] User profile saved to Firestore
- [x] Feature visibility auto-configured based on seller types
- [x] App layout with responsive sidebar navigation
- [x] Mobile hamburger menu
- [x] User dropdown with logout
- [x] Dashboard with quick actions and getting started guide

---

## M3 - Core Calculator (Both Product Types) ✅ COMPLETE
**Goal:** Full calculator with fee calculations, VAT handling, and margin analysis.

**Done when:**
- [x] Calculator page at `/app/calculator`
- [x] Product cost input:
  - [x] HandmadeProduct: materials + labour + packaging breakdown
  - [x] SourcedProduct: supplier cost + shipping (simple)
  - [x] Or manual cost entry without saved product
- [x] Sale price input with currency formatting
- [x] Shipping cost input (seller-paid vs buyer-paid toggle)
- [x] Platform selector (Etsy, eBay, Amazon, Shopify, TikTok)
- [x] Fee calculation for selected platform
- [x] VAT handling based on user's registration status
- [x] Results display:
  - [x] Total fees breakdown
  - [x] Profit (in minor units, displayed in currency)
  - [x] Margin percentage
  - [x] Break-even price
  - [x] Target price (for target margin %)
- [x] Rounding options (.99, .50, .00, custom)
- [x] Calculations complete in < 100ms
- [x] Tests for all calculation functions (65 tests passing)

---

## M3.5 - Calculator Pro Features ✅ COMPLETE
**Goal:** Add high-value analysis features to make the calculator truly comprehensive.

**Done when:**
- [x] **Payment Processing Fees:**
  - [x] PayPal (3.6% + 30p), Stripe (2.9% + 30p), Square (2.7% + 20p) fee calculations
  - [x] Payment method selector in Platform section
  - [x] Auto-detects when platform includes payment processing
  - [x] Fees shown in total breakdown
- [x] **Discount Analysis:**
  - [x] Shows profit at 10%, 15%, 20%, 25%, 30%, 40%, 50% off
  - [x] Calculates maximum discount before loss (binary search)
  - [x] Collapsible table with profit/margin at each level
  - [x] Green/red status indicators for profitable vs loss-making
- [x] **Batch/Quantity Pricing:**
  - [x] Calculates profit at 1, 5, 10, 25, 50, 100 units
  - [x] Shows unit cost, profit per unit, total profit, margin
  - [x] Highlights most profitable quantity tier
- [x] **Scenario What-If Analysis:**
  - [x] Interactive sliders for material, labour, shipping, price changes
  - [x] Quick presets: "Supplier +10%", "Sale -20%", "Premium +15%", etc.
  - [x] Real-time profit/margin preview with comparison to current
  - [x] Apply scenario price button
- [x] Premium UI with glassmorphism, gradients, platform colors
- [x] Animated circular margin gauge with glow effects

**Files Created:**
- `src/components/calculator/discount-analysis-table.tsx`
- `src/components/calculator/payment-method-selector.tsx`
- `src/components/calculator/batch-pricing-table.tsx`
- `src/components/calculator/scenario-sliders.tsx`
- `src/components/calculator/circular-gauge.tsx`
- `src/components/calculator/icons.tsx`
- `src/components/ui/slider.tsx`
- `src/lib/calculations/discount-analysis.ts`
- `src/lib/calculations/batch-pricing.ts`
- `src/lib/calculations/scenarios.ts`
- `src/lib/calculations/overhead.ts`
- `src/lib/constants/payment-methods.ts`

---

## M4 - Product Management ✅ COMPLETE
**Goal:** Users can save products/materials/suppliers and reuse them in calculations.

**Done when:**
- [x] **Materials Library** (for handmade sellers):
  - [x] Materials CRUD with real-time Firebase sync
  - [x] Material: name, unit, cost, supplier links (many-to-many), category, notes, cost history
  - [x] Favourite and usage count tracking
  - [x] Multi-supplier linking with cost, SKU, quality rating, stock status per link
  - [x] Preferred supplier designation (auto-updates material cost)
  - [x] Quick-add supplier from material card (hover action)
  - [x] Stock status badges and warnings on cards
  - [x] Search, filter by category, sort by name/cost/recent
  - [x] Invoice/Bulk purchase splitting (calculate per-unit cost from total)
  - [x] VAT warning for cost inputs (VAT-registered users)
- [x] **Suppliers** (unified for ALL seller types):
  - [x] Suppliers CRUD with real-time Firebase sync
  - [x] Unified Supplier entity with type: materials / products / both
  - [x] Core fields: name, type, currency, website, notes, contact info
  - [x] Materials supplier fields: account number, lead time, min order value
  - [x] Products supplier fields: platform, ships from, shipping/processing time, returns handling
  - [x] Type filter, platform filter, favourites, search
  - [x] Suppliers visible for ALL seller types (not just dropshippers)
- [x] **Products** (unified, two types):
  - [x] Products list with type filter (Handmade / Sourced)
  - [x] HandmadeProduct: name, materials + quantities, labour tasks, packaging
  - [x] SourcedProduct: name, supplier, cost, shipping, source type (dropship/POD/resale/wholesale)
  - [x] Auto-calculate product cost
  - [x] Tags and favourites
  - [x] Materials selector with search and favourites filter
  - [x] Labour tasks editor with timer integration
  - [x] VAT warning for cost inputs
  - [x] "Use in Calculator" action
- [x] **Bundles** (multiple products sold together):
  - [x] Bundles page at `/bundles`
  - [x] Create bundle from 2+ products
  - [x] Auto-calculated combined cost
  - [x] Optional suggested price with discount percentage
  - [x] "Use in Calculator" action
  - [x] Gate: requires 2+ products to create bundle
- [x] **Calculator ← Product Integration**:
  - [x] Calculator reads `productId` from URL params
  - [x] Loads product and pre-fills cost
  - [x] Shows linked product badge with clear button
  - [x] Toast notification on product load
- [x] **Saved Calculations (History)**:
  - [x] Save calculations to Firestore
  - [x] History page (renamed to "Calculations")
  - [x] Re-calculate action with product linking
  - [x] Delete individual or clear all
  - [x] Summary stats (total, profitable, avg margin)
- [x] All data persisted to Firestore
- [x] Empty states guide user through workflow
- [x] Skeleton loading components for all pages
- [x] CSS animations with reduced-motion support
- [x] Onboarding wizard with confetti celebration
- [ ] **Product Variants** (deferred to future):
  - [ ] Variant dimensions: size, colour, material, style
  - [ ] Variant-specific costs and weights

**Files Created:**
- `src/app/(app)/materials/page.tsx`
- `src/app/(app)/suppliers/page.tsx`
- `src/app/(app)/products/page.tsx`
- `src/app/(app)/bundles/page.tsx`
- `src/app/(app)/history/page.tsx`
- `src/components/materials/material-form.tsx`
- `src/components/materials/material-card.tsx`
- `src/components/materials/supplier-link-card.tsx`
- `src/components/materials/add-supplier-link-dialog.tsx`
- `src/components/materials/material-suppliers-section.tsx`
- `src/components/suppliers/supplier-form.tsx`
- `src/components/suppliers/supplier-card.tsx`
- `src/components/products/product-form.tsx`
- `src/components/products/materials-selector.tsx`
- `src/components/products/labour-tasks-editor.tsx`
- `src/components/skeletons/index.tsx`
- `src/components/vat-warning.tsx`
- `src/components/timer.tsx`
- `src/lib/firebase/materials.ts`
- `src/lib/firebase/suppliers.ts`
- `src/lib/validations/material.ts`
- `src/lib/validations/supplier.ts`
- `src/lib/validations/product.ts`
- `src/lib/validations/bundle.ts`
- `src/lib/validations/material-supplier-link.ts`
- `src/hooks/use-materials.ts`
- `src/hooks/use-suppliers.ts`
- `src/hooks/use-products.ts`
- `src/hooks/use-bundles.ts`
- `src/hooks/use-saved-calculations.ts`
- `src/styles/animations.css`
- `src/components/ui/dialog.tsx`
- `src/components/ui/alert-dialog.tsx`
- `src/components/ui/textarea.tsx`
- `src/components/ui/sonner.tsx`
- `src/components/ui/tooltip.tsx`
- `src/components/ui/alert.tsx`

---

## M5 - Platform & Shipping Templates (+ Weight-Based Shipping)
**Goal:** Manage platform fees and shipping options with weight-based calculations.

**Done when:**
- [ ] **Platform Templates**:
  - [ ] Platform templates CRUD
  - [ ] Default templates for Etsy, eBay, Amazon, Shopify, TikTok
  - [ ] Custom platform template creation
  - [ ] Fee term editor (percentage/fixed, on item/shipping/subtotal)
- [ ] **Shipping Templates**:
  - [ ] Shipping templates CRUD
  - [ ] Template: carrier, service, cost, weight limits, delivery time
  - [ ] Favourite marking for quick access
  - [ ] Templates selectable in calculator
- [ ] **Weight-Based Shipping Bands**:
  - [ ] Weight bands with min/max/cost (e.g., 0-100g = £1.50, 101-250g = £2.50)
  - [ ] Multiple shipping profiles (UK Standard, UK Express, EU, International)
  - [ ] Auto-calculate shipping from product weight
  - [ ] Support for dimensional weight (L×W×H ÷ 5000)
  - [ ] Combined shipping rules (additional items discount)
  - [ ] Free shipping threshold calculator
  - [ ] Carrier presets (Royal Mail, Evri, DPD, etc.)

---

## M6 - Comparison, History, Dashboard
**Goal:** Compare platforms, save calculations, view trends.

**Done when:**
- [ ] Platform comparison view (same product, all platforms side-by-side)
- [ ] Saved calculations (persist to Firestore)
- [ ] Calculation history list with filters
- [ ] Dashboard page at `/app/dashboard`:
  - [ ] Recent calculations
  - [ ] Profit trends chart
  - [ ] Top products by margin
  - [ ] Platform comparison summary
- [ ] Boost plan generator (3-step price ladder)
- [ ] Volume/quantity pricing with discount tiers
- [ ] Margin warnings when discount drops below target

---

## M7 - Stripe Subscriptions
**Goal:** Monetize with subscription tiers.

**Done when:**
- [ ] Stripe account connected
- [ ] Products/prices created in Stripe (Starter free, Pro paid)
- [ ] Checkout flow from pricing page
- [ ] Webhook handler for subscription events
- [ ] Subscription status stored in Firestore
- [ ] Feature gating based on tier:
  - [ ] Starter: 5 products, 10 materials, 1 platform
  - [ ] Pro: unlimited
- [ ] Upgrade prompts when hitting limits
- [ ] Billing management page (Stripe Customer Portal)
- [ ] Pricing page with tier comparison

---

## M8 - All SEO Pages + Polish + Launch (+ Advanced Export)
**Goal:** Complete all SEO landing pages and polish for launch.

**Done when:**
- [ ] SEO calculator pages for all platforms:
  - [ ] `/calculators/ebay-fee-calculator`
  - [ ] `/calculators/amazon-fba-calculator`
  - [ ] `/calculators/shopify-profit-calculator`
  - [ ] `/calculators/tiktok-shop-calculator`
- [ ] Homepage with value proposition
- [ ] Command palette (Cmd+K) for navigation
- [ ] Time tracking (maker mode)
- [ ] **Advanced Export**:
  - [ ] Export to PDF with professional formatting
  - [ ] Export to CSV for spreadsheet analysis
  - [ ] PDF branding (business name, logo upload, contact details)
  - [ ] Quotation/price list generator
  - [ ] Batch export (multiple products in one document)
  - [ ] Include/exclude sections (fees breakdown, discount analysis, etc.)
  - [ ] Shareable calculation links
- [ ] Bulk operations (select multiple, delete, export)
- [ ] Performance audit (Core Web Vitals pass)
- [ ] Accessibility audit (keyboard nav, screen reader)
- [ ] Error boundaries and graceful error handling
- [ ] Analytics integration
- [ ] Launch checklist complete

---

## M9 - Wholesale/B2B Mode
**Goal:** Add wholesale pricing calculator for sellers who also sell B2B (trade, retailers, bulk buyers).

**Done when:**
- [ ] **Onboarding Addition**:
  - [ ] "Do you sell wholesale/trade?" question in onboarding
  - [ ] Wholesale mode toggle in settings
  - [ ] Feature visibility based on wholesale seller status
- [ ] **3-Tier Margin System**:
  - [ ] Sample tier: 1-11 units (RRP pricing, highest margin)
  - [ ] Multipack tier: 12-47 units (small discount for retailers)
  - [ ] Carton/Case tier: 48+ units (bulk wholesale pricing)
  - [ ] Configurable tier thresholds
  - [ ] Per-tier target margins (e.g., Sample 60%, Multipack 45%, Carton 35%)
  - [ ] Auto-calculate prices from costs + target margins
- [ ] **Pack Size Configuration**:
  - [ ] Define pack sizes (single, 3-pack, 6-pack, 12-pack, case of 48)
  - [ ] Pack-specific costs (packaging, inserts, barcode labels)
  - [ ] Pack-specific weights for shipping
  - [ ] Generate recommended retail prices per pack
- [ ] **Wholesale Calculator Page**:
  - [ ] `/app/wholesale` page with wholesale-specific UI
  - [ ] Input: unit cost, target margins per tier
  - [ ] Output: price ladder (sample → multipack → carton)
  - [ ] MOQ (minimum order quantity) display
  - [ ] Volume discount visualization
- [ ] **Wholesale Price List Export**:
  - [ ] Generate PDF trade price list
  - [ ] Include RRP, trade price, margin columns
  - [ ] Barcode/SKU columns
  - [ ] Terms & conditions section
- [ ] **SEO Landing Page**:
  - [ ] `/calculators/wholesale-pricing-calculator` public page
  - [ ] Target keywords: "wholesale pricing calculator", "trade pricing tool"
  - [ ] Free calculator for lead generation

---

## Parking Lot
Ideas for future versions:

**Product & Listing Management:**
- Listings/bundles (combine multiple products)
- Product collections (group related products)
- SKU/barcode management
- Product images with cost overlay

**Integrations & Automation:**
- Marketplace API integrations (sync fees automatically)
- Import products from Etsy/eBay/Shopify
- Sync prices back to marketplaces
- Accounting software integration (Xero, QuickBooks)
- Cost alerts (notify when supplier prices change)

**Analytics & Insights:**
- Advanced analytics (seasonal trends, competitor pricing)
- Competitor price tracking
- Price history graphs per product
- Profit forecasting
- Best-selling product analysis
- Side-by-side product comparison

**Pricing Tools:**
- AI pricing suggestions based on market data
- Dynamic pricing rules (auto-adjust based on demand)
- Price ladder visualizations
- Bundle pricing optimizer
- Clearance/liquidation pricing calculator

**Business Tools:**
- Teams / multi-user workspaces
- Client/customer management (for wholesale)
- Invoice generator from calculations
- Order tracking
- Inventory tracking with reorder alerts

**Platform & Access:**
- PWA / offline mode
- Mobile app (React Native)
- White-label version for accountants/consultants
- Embeddable calculator widget for blogs
- Chrome extension for quick calculations

---

## Design Decisions & Problems Solved

### Currency Storage: Minor Units
**Problem:** Floating point precision errors in financial calculations (e.g., £10.10 + £20.20 = £30.299999...).
**Solution:** Store all monetary values in minor units (pence/cents). £10.50 = 1050. Only convert to display format at render time.
**Benefit:** Exact integer arithmetic, no rounding errors in calculations.

### Hybrid Seller Support
**Problem:** Users sell both handmade (materials + labour) and sourced (supplier cost) products, but most apps only support one model.
**Solution:** Support both product types with unified profit calculation. Onboarding asks "What do you sell?" and configures feature visibility.
**Benefit:** One app serves makers, dropshippers, POD sellers, and resellers.

### Platform Fee Abstraction
**Problem:** Each marketplace has different fee structures (percentage vs fixed, on item vs shipping vs subtotal).
**Solution:** Abstract fee structure as array of `FeeTerm` objects with `type`, `percentage`, `fixedFee`, and `appliesTo` fields.
**Benefit:** Easy to add new platforms, easy to create custom platform templates.

### VAT Handling
**Problem:** VAT calculation varies by registration status, product type, and marketplace location.
**Solution:** VAT flag in settings determines calculation mode. Non-registered sellers see inclusive prices; registered sellers see VAT separated.
**Benefit:** Accurate profit calculations for all seller types.

### Wholesale vs Retail: Same App, Different Modes
**Problem:** Wholesale pricing has different concepts (tiers, MOQ, pack sizes) than retail selling.
**Decision:** Integrate wholesale as a "mode" with feature flag, not a separate app.
**Benefit:** Users get one account, shared products, and can see both retail and wholesale margins. SEO landing pages target both audiences.

### Break-Even Discount Calculation
**Problem:** Finding maximum discount before loss requires solving for when profit = 0, but fee calculations are complex.
**Solution:** Binary search algorithm that tests discounts and narrows to the break-even point within 0.1% accuracy.
**Benefit:** Accurate "max discount" shown regardless of platform fee complexity.

### Product Variants
**Problem:** Size/colour variants have different costs (more fabric for XL) but many apps treat all variants identically.
**Solution:** Variant-specific cost and weight fields, with bulk operations for efficiency.
**Benefit:** Accurate per-variant profitability analysis.

### Weight-Based Shipping
**Problem:** Fixed shipping costs are inaccurate; actual costs depend on weight and destination.
**Solution:** Weight bands with min/max ranges and carrier profiles. Calculate shipping from product weight automatically.
**Benefit:** More accurate profit calculations, especially for heavy or light items.

### Unified Supplier System
**Problem:** Suppliers were only shown for dropshippers, but handmade sellers also buy from suppliers (materials). Users wanted to track multiple suppliers per material with different prices/quality/stock status.
**Solution:** Unified Supplier entity that works for ALL seller types with conditional fields based on type (materials/products/both). Materials link to multiple suppliers via MaterialSupplierLink with per-link cost, SKU, quality rating, and stock status.
**Benefit:** One supplier management system for all seller types. Materials can have multiple supplier options with "preferred" designation. Stock status warnings help identify supply chain issues.

### Material-Supplier Links (Many-to-Many)
**Problem:** Users source the same material from multiple suppliers with different prices and availability.
**Solution:** Embedded `supplierLinks` array on Material with denormalized supplier name, per-link cost, SKU, quality rating (1-5), stock status, and cost history.
**Benefit:** Quick comparison of supplier options, preferred supplier auto-updates material cost, stock warnings surface on material cards.
