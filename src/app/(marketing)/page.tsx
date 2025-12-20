import Link from 'next/link';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calculator,
  TrendingUp,
  Target,
  CheckCircle2,
  XCircle,
  Package,
  Sparkles,
  ArrowRight,
  BarChart3,
  Settings,
  Zap,
  ShoppingBag,
  ShoppingCart,
  Store,
  Smartphone,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'EcomProfitCalculator - Know Your True Profit Before You List',
  description:
    'Free profit calculator for Etsy, eBay, Amazon, Shopify, and TikTok Shop sellers. Calculate marketplace fees, track materials & costs, and know your true profit margins before listing.',
  keywords: [
    'profit calculator',
    'Etsy fee calculator',
    'eBay fee calculator',
    'Amazon FBA calculator',
    'Shopify profit calculator',
    'TikTok Shop calculator',
    'marketplace fees',
    'seller profit margins',
    'ecommerce calculator',
  ],
  openGraph: {
    title: 'EcomProfitCalculator - Know Your True Profit Before You List',
    description:
      'Free profit calculator for online sellers. Calculate fees across all major marketplaces.',
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Know Your True Profit{' '}
            <span className="text-primary">Before You List</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl md:text-2xl">
            Calculate marketplace fees, track costs, and see your real profit margins across Etsy, eBay, Amazon, Shopify, and TikTok Shop.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="text-base">
              <Link href="/calculators/etsy-fee-calculator">
                <Calculator className="mr-2 h-5 w-5" />
                Try Free Calculator
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base">
              <Link href="/signup">
                Sign Up Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Platform Logos Row */}
      <section className="border-y bg-muted/30 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            <Badge variant="outline" className="px-4 py-2 text-sm font-semibold">
              Etsy
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm font-semibold">
              eBay
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm font-semibold">
              Amazon
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm font-semibold">
              Shopify
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm font-semibold">
              TikTok Shop
            </Badge>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            The Hidden Cost of Not Knowing Your Numbers
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Every online seller faces the same challenges when pricing products
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 dark:bg-destructive/20">
                <XCircle className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="mb-2 font-semibold">Marketplace Fees Eat Your Profit</h3>
              <p className="text-sm text-muted-foreground">
                Each platform has different fee structures. Transaction fees, payment processing, listing costs, ads - they quickly add up to 15-30% of your sale price.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 dark:bg-destructive/20">
                <XCircle className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="mb-2 font-semibold">Confusion Across Platforms</h3>
              <p className="text-sm text-muted-foreground">
                Should you sell on Etsy or eBay? Amazon or Shopify? Without knowing the true profit on each platform, you are leaving money on the table.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 dark:bg-destructive/20">
                <XCircle className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="mb-2 font-semibold">Working for Free</h3>
              <p className="text-sm text-muted-foreground">
                You price at £20, but after fees, materials, and shipping, you only make £2. Or worse - you actually lose money on every sale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-y bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything You Need to Price Profitably
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful features designed for indie sellers, handmade creators, and dropshippers
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
                  <Calculator className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Multi-Platform Support</CardTitle>
                <CardDescription>
                  Calculate fees for Etsy, eBay, Amazon FBA, Shopify, and TikTok Shop. Compare which platform gives you the best profit margins.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Materials & Cost Tracking</CardTitle>
                <CardDescription>
                  Perfect for handmade sellers. Track material costs, labour hours, and packaging to know your true product cost.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Supplier Cost Tracking</CardTitle>
                <CardDescription>
                  Ideal for dropshippers and POD sellers. Manage supplier costs, shipping, and fulfillment fees across multiple products.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Break-Even Price Calculator</CardTitle>
                <CardDescription>
                  Instantly see the minimum price you need to charge to cover all costs and marketplace fees.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Target Margin Pricing</CardTitle>
                <CardDescription>
                  Set your desired profit margin (e.g., 40%) and we will calculate the exact price you need to list at.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
                  <Settings className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>VAT Handling for UK Sellers</CardTitle>
                <CardDescription>
                  Automatically handle VAT calculations whether you are registered or not. Works with multiple currencies and tax rates.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Get accurate profit calculations in three simple steps
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-3">
          <div className="relative flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
              1
            </div>
            <h3 className="mb-2 text-xl font-semibold">Add Your Costs</h3>
            <p className="text-muted-foreground">
              Enter materials, labour, packaging, or supplier costs
            </p>
          </div>
          <div className="relative flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
              2
            </div>
            <h3 className="mb-2 text-xl font-semibold">Set Your Price</h3>
            <p className="text-muted-foreground">
              Choose your platform and enter your desired selling price
            </p>
          </div>
          <div className="relative flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
              3
            </div>
            <h3 className="mb-2 text-xl font-semibold">See Your Profit</h3>
            <p className="text-muted-foreground">
              Instantly view fees, profit, margin, and break-even price
            </p>
          </div>
        </div>
      </section>

      {/* Calculator Links Section */}
      <section className="border-y bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Free Profit Calculators
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Try our platform-specific calculators - no account required
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Etsy Calculator */}
            <Card className="group transition-all hover:border-primary hover:shadow-md dark:hover:border-primary/50">
              <CardHeader>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 dark:bg-orange-500/20 dark:group-hover:bg-orange-500/30">
                  <ShoppingBag className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle>Etsy Fee Calculator</CardTitle>
                <CardDescription>
                  Calculate transaction fees, payment processing, listing costs, and Offsite Ads for your Etsy shop
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/calculators/etsy-fee-calculator">
                    Try Calculator
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* eBay Calculator */}
            <Card className="group transition-all hover:border-primary hover:shadow-md dark:hover:border-primary/50">
              <CardHeader>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 dark:bg-blue-500/20 dark:group-hover:bg-blue-500/30">
                  <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>eBay Fee Calculator</CardTitle>
                <CardDescription>
                  Calculate final value fees, insertion fees, and optional upgrade costs for eBay listings
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/calculators/ebay-fee-calculator">
                    Try Calculator
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Amazon FBA Calculator */}
            <Card className="group transition-all hover:border-primary hover:shadow-md dark:hover:border-primary/50">
              <CardHeader>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10 group-hover:bg-amber-500/20 dark:bg-amber-500/20 dark:group-hover:bg-amber-500/30">
                  <ShoppingCart className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <CardTitle>Amazon FBA Calculator</CardTitle>
                <CardDescription>
                  Calculate referral fees, FBA fulfillment costs, storage fees, and total Amazon expenses
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/calculators/amazon-fba-calculator">
                    Try Calculator
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Shopify Calculator */}
            <Card className="group transition-all hover:border-primary hover:shadow-md dark:hover:border-primary/50">
              <CardHeader>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10 group-hover:bg-green-500/20 dark:bg-green-500/20 dark:group-hover:bg-green-500/30">
                  <Store className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Shopify Profit Calculator</CardTitle>
                <CardDescription>
                  Calculate transaction fees, payment processing, and plan costs for your Shopify store
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/calculators/shopify-profit-calculator">
                    Try Calculator
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* TikTok Shop Calculator */}
            <Card className="group transition-all hover:border-primary hover:shadow-md dark:hover:border-primary/50">
              <CardHeader>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-pink-500/10 group-hover:bg-pink-500/20 dark:bg-pink-500/20 dark:group-hover:bg-pink-500/30">
                  <Smartphone className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                </div>
                <CardTitle>TikTok Shop Calculator</CardTitle>
                <CardDescription>
                  Calculate commission fees, transaction fees, and seller costs for TikTok Shop products
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/calculators/tiktok-shop-calculator">
                    Try Calculator
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Coming Soon - More Platforms */}
            <Card className="border-dashed">
              <CardHeader>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <Sparkles className="h-6 w-6 text-muted-foreground" />
                </div>
                <CardTitle className="text-muted-foreground">More Coming Soon</CardTitle>
                <CardDescription>
                  We are working on calculators for Depop, Vinted, Facebook Marketplace, and more
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button variant="ghost" className="w-full" disabled>
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="border-y bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Start free, upgrade when you need more
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
            {/* Free Tier */}
            <Card>
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>Try our calculators</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">£0</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>Landing page calculators</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>All platform fee calculations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>No account required</span>
                  </li>
                </ul>
                <Button asChild variant="outline" className="mt-6 w-full">
                  <Link href="/calculators/etsy-fee-calculator">Try Calculator</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Starter Tier */}
            <Card>
              <CardHeader>
                <CardTitle>Starter</CardTitle>
                <CardDescription>Perfect for new sellers</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">£0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>5 saved products</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>10 materials library items</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>1 platform</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>7-day calculation history</span>
                  </li>
                </ul>
                <Button asChild className="mt-6 w-full">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Pro Tier */}
            <Card className="border-primary">
              <CardHeader>
                <div className="mb-2 flex items-center gap-2">
                  <CardTitle>Pro</CardTitle>
                  <Badge className="ml-auto">
                    <Sparkles className="mr-1 h-3 w-3" />
                    Popular
                  </Badge>
                </div>
                <CardDescription>For serious sellers</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">£9</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>Unlimited products</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>Unlimited materials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>All platforms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>Unlimited history</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>Supplier management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>Shipping templates</span>
                  </li>
                </ul>
                <Button asChild className="mt-6 w-full">
                  <Link href="/signup">Start Free Trial</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-3 font-semibold">
                Do I need an account to use the calculator?
              </h3>
              <p className="text-sm text-muted-foreground">
                No! Our free calculator landing pages work without an account. However, creating
                a free account lets you save products, track materials, and access your
                calculation history.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-3 font-semibold">
                Which platforms do you support?
              </h3>
              <p className="text-sm text-muted-foreground">
                We currently support Etsy, eBay, Amazon, Shopify, and TikTok Shop. Each platform
                has different fee structures, and we keep our calculations up-to-date with the
                latest changes.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-3 font-semibold">
                How do you handle VAT calculations?
              </h3>
              <p className="text-sm text-muted-foreground">
                During setup, you tell us if you&apos;re VAT registered. We then calculate your
                profit either VAT-inclusive (for registered sellers) or VAT-exclusive (for
                non-registered sellers). We support multiple currencies and country-specific tax
                rates.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-3 font-semibold">
                Can I track both handmade and dropshipping products?
              </h3>
              <p className="text-sm text-muted-foreground">
                Absolutely! Our system supports multiple seller types. You can track handmade
                products with materials and labour costs, dropshipped products with supplier
                costs, or any combination. The interface adapts to show only the features you
                need.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-3 font-semibold">
                What&apos;s the difference between Starter and Pro?
              </h3>
              <p className="text-sm text-muted-foreground">
                Starter is great for testing with up to 5 products and 1 platform. Pro removes
                all limits - unlimited products, materials, all platforms, supplier management,
                and shipping templates. Pro is ideal for sellers managing multiple products across
                different marketplaces.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Price Profitably?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join hundreds of sellers who know their margins before they list
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="text-base">
                <Link href="/signup">
                  <Zap className="mr-2 h-5 w-5" />
                  Sign Up Free
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base">
                <Link href="/calculators/etsy-fee-calculator">
                  Try Calculator First
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
