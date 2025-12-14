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
│       ├── materials/        # Maker mode only
│       ├── products/
│       ├── suppliers/        # Dropship mode only
│       ├── shipping/
│       ├── platforms/
│       ├── history/
│       └── settings/
├── components/
│   ├── ui/                   # shadcn/ui primitives
│   ├── calculator/           # Shared calculator components
│   ├── marketing/            # Landing page components
│   └── app/                  # Main app components
├── lib/
│   ├── firebase/             # Firebase config, auth helpers, firestore
│   ├── stripe/               # Stripe config, checkout, webhooks
│   ├── calculations/         # Pure calculation functions
│   ├── constants/            # Platform fees, VAT rates, currencies
│   └── utils.ts              # Helper functions
├── stores/                   # Zustand stores (client-side state)
├── types/                    # TypeScript type definitions
└── hooks/                    # Custom React hooks
```

## User Modes
Two distinct modes selected during onboarding:

### Maker Mode (Handmade/Crafts)
- Materials library with cost tracking
- Products built from materials + labour + packaging
- Time tracking for manufacturing
- Full cost breakdown

### Dropship Mode (Resellers)
- Supplier management
- Products with simple supplier cost + shipping
- No materials, labour, or packaging breakdown
- Streamlined UI

Both modes share: calculator engine, platform fees, VAT, shipping templates, history.

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
