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

Use these prompts to run parallel agents for faster development.

### How Agents Work
- Agents run **independently** in separate contexts
- They **don't communicate** with each other directly
- The **main Claude instance coordinates** results
- Run them in **parallel** when tasks don't depend on each other
- Each agent sees the full CLAUDE.md for context

### Agent Prompts (copy these to run)

**Agent 1: SEO Landing Page**
```
Build the Etsy fee calculator SEO landing page at /calculators/etsy-fee-calculator.

Requirements from CLAUDE.md:
- SSG page with SEO meta tags and Open Graph
- Structured data (FAQ schema) for rich snippets
- Embedded calculator component (no auth required)
- Inputs: product cost, sale price, shipping
- Calculate Etsy fees: 6.5% + 4% + £0.20 + £0.15
- Show: fees breakdown, profit, margin
- CTA: "Save & compare → Sign up free"
- Mobile responsive, dark mode support
- Use shadcn/ui components

Read CLAUDE.md for full context. Use existing /lib/calculations and /lib/constants.
```

**Agent 2: Auth System**
```
Build the authentication system with Firebase.

Requirements:
- /login page with email + Google sign-in
- /signup page with email + Google
- /forgot-password page
- useAuth hook (already scaffolded in /hooks/use-auth.ts)
- Protected route wrapper component
- Redirect unauthenticated users to /login
- After login, redirect to /app/dashboard

Use Firebase Auth from /lib/firebase. Use shadcn/ui for forms.
Read CLAUDE.md for full context.
```

**Agent 3: Onboarding Wizard**
```
Build the onboarding wizard shown after first signup.

Steps:
1. "What do you sell?" - Multi-select: Handmade, Dropship, Print-on-Demand, Resale
2. Country selection (dropdown)
3. "Are you VAT registered?" - Yes / No / Not sure
4. Primary marketplace - Etsy, eBay, Amazon, Shopify, TikTok
5. Currency (auto-suggested from country)

Save to Firestore under users/{userId}/profile.
Update Zustand store (src/stores/settings.ts).
Use shadcn/ui components, add step indicator.
Read CLAUDE.md for full context.
```

**Agent 4: App Shell & Navigation**
```
Build the main app shell layout for /app/* routes.

Requirements:
- Sidebar navigation (collapsible on mobile)
- Nav items: Dashboard, Calculator, Products, Materials*, Suppliers*, Shipping, Platforms, History, Settings
- Items marked * should show/hide based on user's sellerTypes (from settings store)
- Dark mode toggle in header
- User avatar/menu with logout
- Breadcrumb support
- Mobile-friendly hamburger menu

Use shadcn/ui sidebar component. Read settings from Zustand store.
Read CLAUDE.md for full context.
```

**Agent 5: Calculator Core**
```
Build the main calculator page at /app/calculator.

Requirements:
- Product selector (or manual cost entry)
- Sale price input with currency formatting
- Shipping cost input (toggle: seller pays / buyer pays)
- Platform selector (Etsy, eBay, etc.)
- Quantity input
- Results panel showing:
  - Fees breakdown (itemized)
  - Profit (in currency)
  - Margin (percentage)
  - Break-even price
  - Target price (for X% margin)
- Rounding options (.99, .50, .00)
- "Save calculation" button

Use /lib/calculations for all math. Use shadcn/ui.
Read CLAUDE.md for full context.
```

**Agent 6: Product Management**
```
Build product management at /app/products.

Requirements:
- List view with search/filter
- Two product types (see types/index.ts):
  - HandmadeProduct: materials + labour + packaging
  - SourcedProduct: supplier cost + shipping
- Create/Edit forms for each type
- Product cost auto-calculates
- Save to Firestore under users/{userId}/products
- Delete with confirmation
- Favourite toggle

Use shadcn/ui data table, forms, dialogs.
Read CLAUDE.md for full context.
```
