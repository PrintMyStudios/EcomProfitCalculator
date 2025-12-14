# PLAN.md - EcomProfitCalculator

## Current Focus
M2 - Auth + Onboarding Wizard

## Milestones
- [x] M0 - Project setup ✅
- [x] M1 - Free Etsy calculator (SEO landing page) ✅
- [ ] M2 - Auth + onboarding wizard
- [ ] M3 - Core calculator (both product types)
- [ ] M4 - Product management
- [ ] M5 - Platform & shipping templates
- [ ] M6 - Comparison, history, dashboard
- [ ] M7 - Stripe subscriptions
- [ ] M8 - All SEO pages + polish + launch

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
- [x] No login required to use
- [x] CTA: "Save & compare across platforms → Sign up free"
- [x] Mobile responsive, dark mode supported
- [x] Free shipping toggle (seller pays shipping)
- [x] VAT registered toggle (UK 20%)
- [x] Links to other calculator pages (coming soon)

---

## M2 - Auth + Onboarding Wizard
**Goal:** Users can create accounts and configure their seller profile.

**Done when:**
- [ ] Firebase Auth integrated (email + Google)
- [ ] `/login`, `/signup`, `/forgot-password` pages
- [ ] Protected routes redirect unauthenticated users
- [ ] Onboarding wizard after first signup:
  - [ ] "What do you sell?" → Multi-select: Handmade, Dropship, Print-on-Demand, Resale
  - [ ] Country selection
  - [ ] VAT registered? (Yes/No/Not sure)
  - [ ] Primary marketplace (Etsy, eBay, Amazon, Shopify, TikTok)
  - [ ] Currency (auto-suggested from country)
- [ ] User profile saved to Firestore
- [ ] Feature visibility auto-configured based on seller types
- [ ] App layout with navigation (shows/hides features based on profile)
- [ ] Logout functionality

---

## M3 - Core Calculator (Both Product Types)
**Goal:** Full calculator with fee calculations, VAT handling, and margin analysis.

**Done when:**
- [ ] Calculator page at `/app/calculator`
- [ ] Product cost input:
  - [ ] HandmadeProduct: materials + labour + packaging breakdown
  - [ ] SourcedProduct: supplier cost + shipping (simple)
  - [ ] Or manual cost entry without saved product
- [ ] Sale price input with currency formatting
- [ ] Shipping cost input (seller-paid vs buyer-paid toggle)
- [ ] Platform selector (Etsy, eBay, Amazon, Shopify, TikTok)
- [ ] Fee calculation for selected platform
- [ ] VAT handling based on user's registration status
- [ ] Results display:
  - [ ] Total fees breakdown
  - [ ] Profit (in minor units, displayed in currency)
  - [ ] Margin percentage
  - [ ] Break-even price
  - [ ] Target price (for target margin %)
- [ ] Rounding options (.99, .50, .00, custom)
- [ ] Calculations complete in < 100ms
- [ ] Tests for all calculation functions

---

## M4 - Product Management
**Goal:** Users can save products/materials/suppliers and reuse them in calculations.

**Done when:**
- [ ] **Materials Library** (for handmade sellers):
  - [ ] Materials CRUD
  - [ ] Material: name, unit, cost, supplier, category, notes, cost history
  - [ ] Favourite and usage count tracking
- [ ] **Suppliers** (for sourced products):
  - [ ] Suppliers CRUD
  - [ ] Supplier: name, platform (AliExpress, Printful, etc.), currency, website, notes
- [ ] **Products** (unified, two types):
  - [ ] Products list with type filter (Handmade / Sourced)
  - [ ] HandmadeProduct: name, materials + quantities, labour, packaging
  - [ ] SourcedProduct: name, supplier, cost, shipping, source type (dropship/POD/resale/wholesale)
  - [ ] Auto-calculate product cost
  - [ ] Tags and favourites
- [ ] All data persisted to Firestore
- [ ] Select saved product in calculator
- [ ] Material cost changes propagate to handmade products
- [ ] Empty states guide user through workflow

---

## M5 - Platform & Shipping Templates
**Goal:** Manage platform fees and shipping options.

**Done when:**
- [ ] Platform templates CRUD
- [ ] Default templates for Etsy, eBay, Amazon, Shopify, TikTok
- [ ] Custom platform template creation
- [ ] Fee term editor (percentage/fixed, on item/shipping/subtotal)
- [ ] Shipping templates CRUD
- [ ] Template: carrier, service, cost, weight limits, delivery time
- [ ] Favourite marking for quick access
- [ ] Templates selectable in calculator

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

## M8 - All SEO Pages + Polish + Launch
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
- [ ] CSV export for calculations
- [ ] Bulk operations (select multiple, delete, export)
- [ ] Performance audit (Core Web Vitals pass)
- [ ] Accessibility audit (keyboard nav, screen reader)
- [ ] Error boundaries and graceful error handling
- [ ] Analytics integration
- [ ] Launch checklist complete

---

## Parking Lot
Ideas for future versions:
- Listings/bundles (combine multiple products)
- Marketplace API integrations (sync fees automatically)
- PWA / offline mode
- Teams / multi-user workspaces
- Advanced analytics (seasonal trends, competitor pricing)
- Inventory tracking
- Cost alerts (notify when supplier prices change)
- AI pricing suggestions based on market data
- White-label version for accountants/consultants
- Mobile app (React Native)
