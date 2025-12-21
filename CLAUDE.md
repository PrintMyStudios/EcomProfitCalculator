# CLAUDE.md - EcomProfitCalculator

## Project Overview
A pricing and profit calculator that helps indie sellers on Etsy, eBay, Shopify, Amazon, and TikTok Shop price products profitably—within 3 minutes of first launch.

**Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Firebase (Auth + Firestore), Stripe, Zustand
**Target:** Indie sellers and small shops (web app, mobile + desktop responsive)
**Business Model:** Freemium with Stripe subscriptions
**Roadmap:** See PLAN.md for milestones

## Commands
```bash
npm run dev       # Dev server (Next.js)
npm run test      # Run tests (Vitest)
npm run build     # Production build
npm run lint      # ESLint
npm run start     # Start production server
```

## Structure
```
src/
├── app/                      # Next.js App Router
│   ├── (marketing)/          # Public pages (SSG for SEO)
│   │   ├── page.tsx          # Homepage
│   │   ├── pricing/          # Pricing page
│   │   └── calculators/      # Free SEO calculator pages
│   │       ├── etsy-fee-calculator/
│   │       ├── ebay-fee-calculator/
│   │       └── [platform]/
│   ├── (auth)/               # Auth pages
│   │   ├── login/
│   │   ├── signup/
│   │   └── forgot-password/
│   └── (app)/                # Main app (requires auth)
│       ├── layout.tsx        # App shell with nav
│       ├── dashboard/
│       ├── calculator/
│       ├── products/
│       ├── bundles/          # Multiple products sold together
│       ├── materials/        # Maker mode only
│       ├── suppliers/
│       ├── history/          # Saved calculations
│       ├── shipping/
│       ├── platforms/
│       └── settings/
├── components/
│   ├── ui/                   # shadcn/ui primitives
│   ├── calculator/           # Calculator components:
│   │   ├── discount-analysis-table.tsx
│   │   ├── payment-method-selector.tsx
│   │   ├── batch-pricing-table.tsx
│   │   ├── scenario-sliders.tsx
│   │   ├── circular-gauge.tsx
│   │   └── icons.tsx
│   ├── marketing/            # Landing page components
│   └── app/                  # Main app components
├── lib/
│   ├── firebase/             # Firebase config, auth helpers, firestore
│   ├── stripe/               # Stripe config, checkout, webhooks
│   ├── calculations/         # Pure calculation functions:
│   │   ├── fees.ts           # Platform fee calculations
│   │   ├── rounding.ts       # Price rounding utilities
│   │   ├── discount-analysis.ts  # Discount profit analysis
│   │   ├── batch-pricing.ts  # Quantity pricing
│   │   ├── scenarios.ts      # What-if analysis
│   │   └── overhead.ts       # Fixed cost allocation
│   ├── constants/            # Platform fees, VAT rates, currencies, payment methods
│   └── utils.ts              # Helper functions
├── stores/                   # Zustand stores (client-side state)
├── types/                    # TypeScript type definitions
└── hooks/                    # Custom React hooks
```

## Seller Types (Hybrid Support)
Sellers can do **multiple things** - onboarding is multi-select, not either/or.

**Seller Types:**
- `handmade` - Make products from raw materials
- `dropship` - Source from suppliers (AliExpress, etc.)
- `print_on_demand` - Use POD services (Printful, etc.)
- `resale` - Buy wholesale and resell

**Product Types:**
- `HandmadeProduct` - Materials + labour + packaging breakdown
- `SourcedProduct` - Simple supplier cost (dropship, POD, resale, wholesale)

**Feature Visibility:**
Based on seller types selected, features auto-show/hide (but can be toggled):
- Materials Library → shown if `handmade`
- Suppliers → shown if `dropship` | `print_on_demand` | `resale`
- Time Tracking → shown if `handmade`

All sellers share: calculator engine, platform fees, VAT, shipping templates, history.

## Code Style
- Functional components with hooks only
- Server Components by default, 'use client' only when needed
- Types in `/types`, co-located when component-specific
- Calculations: pure functions in `/lib/calculations`, no side effects
- Firebase: server-side in API routes, client-side with hooks
- Naming: PascalCase components, camelCase functions, kebab-case files
- CSS: Tailwind utilities, avoid custom CSS
- Testing: Vitest for calculations, Playwright for E2E

## Key Calculations
All monetary values stored as **minor units** (pence/cents) to avoid floating point errors.

**Product Cost (Maker):**
```
materialsCost = Σ(quantity × unitCost)
labourCost = hours × hourlyRate
productCost = materialsCost + labourCost + packagingCost
```

**Product Cost (Dropship):**
```
productCost = supplierCost + supplierShippingCost
```

**Platform Fees:**
```
Fee types:
- Percentage on 'item': price × fee%
- Percentage on 'shipping': shippingCost × fee%
- Percentage on 'subtotal': (price + shipping) × fee%
- Fixed per 'order': added once
- Fixed per 'item': fee × quantity

totalFees = Σ(all applicable fee terms)
```

**Profit (VAT-registered):**
```
receiptsExVAT = (price + sellerShipping) / (1 + vatRate)
profit = receiptsExVAT - productCost - platformFees
margin = (profit / receiptsExVAT) × 100
```

**Profit (non-VAT):**
```
profit = price + sellerShipping - productCost - platformFees
margin = (profit / price) × 100
```

**Discount Analysis:**
```
For each discount % (10, 15, 20, 25, 30, 40, 50):
  discountedPrice = salePrice × (1 - discount%)
  fees = platformFees(discountedPrice)
  profit = discountedPrice - productCost - fees
  isProfitable = profit > 0

breakEvenDiscount = binary search for max discount where profit > 0
```

**Payment Processing Fees:**
```
PayPal: 3.6% + £0.30 per transaction
Stripe: 2.9% + £0.30 per transaction
Square: 2.7% + £0.20 per transaction
Platform Included: £0 (Etsy, eBay, Shopify, TikTok include payment processing)
```

**Batch Pricing:**
```
For each quantity (1, 5, 10, 25, 50, 100):
  unitCost = baseUnitCost + (fixedCosts / quantity)
  totalProfit = profitPerUnit × quantity
  margin = profitPerUnit / salePrice × 100
```

## Platform Fee Defaults
| Platform | Fees |
|----------|------|
| Etsy | 6.5% transaction + 4% payment + £0.20 fixed + £0.15 listing |
| eBay | 10% transaction + 2.9% payment |
| Amazon | 15% transaction |
| Shopify | 2.9% transaction + 2.9% payment |
| TikTok Shop | 5% transaction + 2.9% payment |

## Currencies & VAT
Supported: GBP, USD, EUR, CAD, AUD, JPY, CHF, SEK, NOK, DKK
Each has country-specific VAT/tax rates and registration thresholds.

## Subscription Tiers
| Tier | Price | Limits |
|------|-------|--------|
| Free | £0 | Landing calculators only, no account |
| Starter | £0 | 5 products, 10 materials, 1 platform, 7-day history |
| Pro | £9-12/mo | Unlimited everything |

## Firebase Structure
```
users/{userId}/
├── profile          # Settings, mode, VAT status, currency
├── materials/       # Maker mode
├── suppliers/       # Dropship mode
├── products/
├── shippingTemplates/
├── platformTemplates/
├── calculations/    # Saved history
└── timeSessions/    # Time tracking (maker)
```

## SEO Strategy
Free calculator landing pages at `/calculators/[platform]-fee-calculator`:
- SSG with platform-specific meta tags
- Structured data for rich snippets
- Embedded calculator (no login)
- CTA funnels to signup

## Performance Targets
- Calculations: <100ms
- LCP: <2.5s (landing pages)
- Works at 1.5-2x font scale
- Fully keyboard navigable

## Notes
- Rounding: always UP to protect margins (.99, .50, .00 endings)
- Empty states guide workflow: Materials/Suppliers → Products → Calculator
- Bundles feature locked until 2+ products exist
- Dark mode required throughout
- Never store monetary values as floats—use minor units (integers)

---

## TODO for George

### Immediate
- [ ] Create Firebase project at https://console.firebase.google.com
- [ ] Enable Authentication (Email/Password + Google)
- [ ] Create Firestore database
- [ ] Copy Firebase config to `.env.local`
- [ ] Create Stripe account at https://stripe.com
- [ ] Set up Stripe products/prices for subscription tiers

### Before Launch
- [ ] Register domain
- [ ] Set up Vercel project and connect GitHub repo
- [ ] Configure custom domain in Vercel
- [ ] Set up Firebase production environment
- [ ] Configure Stripe webhook endpoint
- [ ] Test full signup → subscription flow

### Marketing
- [ ] Write SEO content for calculator landing pages
- [ ] Create Open Graph images for social sharing
- [ ] Set up Google Analytics / Plausible
- [ ] Plan launch announcement (Reddit, Twitter, Etsy forums)

---

## Claude Code Agents

Agents are launched via the Task tool. These prompts serve as reference templates.

### Completed Agents (M0-M3.5)
- [x] SEO Landing Pages (Etsy, eBay, Amazon, Shopify, TikTok)
- [x] Homepage with features, pricing, FAQ
- [x] Auth System (login, signup, forgot-password)
- [x] Onboarding Wizard (5 steps, multi-select seller types)
- [x] App Shell & Navigation (sidebar, mobile menu, user dropdown)
- [x] Dashboard with quick actions
- [x] Core Calculator (product cost, fees, profit, margin)
- [x] Calculator Pro Features:
  - [x] Payment Processing (PayPal, Stripe, Square)
  - [x] Discount Analysis (10-50% off profit table)
  - [x] Batch/Quantity Pricing (1-100 units)
  - [x] Scenario What-If Analysis (sliders + presets)
  - [x] Premium UI (glassmorphism, gradients, animated gauge)

### M4 Agents (Current)

**Agent: Materials Library**
```
Build materials management at /app/materials (for handmade sellers).

Requirements:
- Materials CRUD (create, read, update, delete)
- Fields: name, unit, cost per unit, supplier, category, notes
- Cost history tracking
- Favourite and usage count
- Save to Firestore under users/{userId}/materials
- Search and filter
- Empty state guiding workflow

Use shadcn/ui data table, forms, dialogs.
```

**Agent: Suppliers Management**
```
Build suppliers management at /app/suppliers (for sourced product sellers).

Requirements:
- Suppliers CRUD
- Fields: name, platform (AliExpress, Printful, etc.), currency, website, notes
- Save to Firestore under users/{userId}/suppliers

Use shadcn/ui data table, forms, dialogs.
```

**Agent: Product Management**
```
Build product management at /app/products.

Requirements:
- List view with search/filter by type
- Two product types (see types/index.ts):
  - HandmadeProduct: materials + quantities, labour, packaging
  - SourcedProduct: supplier, cost, shipping, source type
- Create/Edit forms for each type
- Product cost auto-calculates
- Save to Firestore under users/{userId}/products
- Delete with confirmation
- Tags and favourites
- Select saved product in calculator

Use shadcn/ui data table, forms, dialogs.
```
