import type { Metadata } from 'next';
import { ShopifyCalculator } from '@/components/calculator/shopify-calculator';

export const metadata: Metadata = {
  title: 'Free Shopify Profit Calculator 2025 - Calculate Your Fees & Margins',
  description:
    'Calculate your Shopify store profit, fees, and margins instantly. Includes transaction fees (2.9%) and payment processing (2.9%). Free, no signup required.',
  keywords: [
    'Shopify profit calculator',
    'Shopify fee calculator',
    'Shopify transaction fees',
    'Shopify payment processing',
    'Shopify margin calculator',
    'Shopify fees 2025',
    'Shopify seller fees',
    'Shopify cost calculator',
  ],
  openGraph: {
    title: 'Free Shopify Profit Calculator 2025',
    description:
      'Calculate your Shopify store profit and margins instantly. See exactly how much you keep after all fees.',
    type: 'website',
    locale: 'en_GB',
    siteName: 'EcomProfitCalculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Shopify Profit Calculator 2025',
    description:
      'Calculate your Shopify store profit and margins instantly. See exactly how much you keep after all fees.',
  },
  alternates: {
    canonical: '/calculators/shopify-profit-calculator',
  },
};

// FAQ structured data for rich snippets
const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What fees does Shopify charge sellers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Shopify charges transaction fees and payment processing fees. The standard rates are 2.9% transaction fee on the sale amount (item + shipping) and 2.9% payment processing fee on the total. These fees vary depending on your Shopify plan - Basic, Shopify, or Advanced.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does Shopify take from each sale?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'On the Basic Shopify plan, Shopify takes approximately 5.8% of your total sale (2.9% + 2.9%). For example, on a £25 sale, Shopify would take about £1.45 in fees. Advanced plans have lower fees, starting at 5.4%.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are Shopify fees charged on shipping?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Shopify charges both transaction fees and payment processing fees on the shipping cost as well as the item price. Both percentages apply to the total sale amount including shipping.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I calculate my profit on Shopify?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'To calculate your Shopify profit: Profit = Sale Price - Product Cost - Shopify Fees - Shipping Cost (if you pay it). Margin = (Profit ÷ Sale Price) × 100. Use our free calculator above to see your exact profit and margin instantly.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Shopify have lower fees than Etsy or Amazon?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Shopify typically has lower transaction fees (5.8% total) compared to Etsy (approximately 10.5%) and Amazon (15% referral fee). However, Shopify requires a monthly subscription fee, while Etsy and Amazon charge per-listing or per-sale fees instead.',
      },
    },
  ],
};

export default function ShopifyProfitCalculatorPage() {
  return (
    <>
      {/* Structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      {/* Hero section with gradient */}
      <section className="relative overflow-hidden border-b">
        {/* Decorative gradient orb */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-green-500/20 to-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-green-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative container mx-auto px-4 py-12 md:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-medium mb-4">
              Shopify Profit Calculator
            </span>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              Calculate Your{' '}
              <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                Shopify Profits
              </span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl">
              Calculate your Shopify fees, profit, and margins instantly.
              <br className="hidden sm:inline" />
              See exactly how much you keep after all fees.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Calculator */}
        <div className="mx-auto max-w-4xl">
          <ShopifyCalculator />
        </div>

        {/* CTA with gradient border */}
        <div className="mx-auto mt-12 max-w-2xl">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl opacity-50 group-hover:opacity-75 blur-sm transition-opacity" />
            <div className="relative rounded-lg bg-card p-6 text-center md:p-8">
              <h2 className="text-xl font-semibold md:text-2xl">
                Want to save calculations &amp; compare platforms?
              </h2>
              <p className="mt-2 text-muted-foreground">
                Create a free account to save your products, compare fees across Shopify, Etsy, eBay,
                Amazon, and more.
              </p>
              <a
                href="/signup"
                className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-gradient-to-r from-green-500 to-emerald-500 px-6 text-sm font-medium text-white hover:from-green-600 hover:to-emerald-600 shadow-lg shadow-green-500/25 transition-all"
              >
                Sign Up Free
              </a>
            </div>
          </div>
        </div>

        {/* How Shopify Fees Work */}
        <div className="mx-auto mt-16 max-w-3xl">
          <h2 className="text-2xl font-bold md:text-3xl">
            How <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">Shopify Fees</span> Work in 2025
          </h2>
          <div className="mt-6 space-y-4 text-muted-foreground">
            <p>
              Shopify uses a straightforward pricing model with monthly subscription fees plus
              transaction and payment processing fees. Here&apos;s what you need to know:
            </p>

            <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-4 transition-all hover:shadow-md hover:border-green-500/30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 font-bold">%</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Transaction Fee: 2.9%</h3>
                  <p className="text-sm">
                    Charged on the total sale amount (item price + shipping). This fee varies by plan:
                    Basic Shopify (2.9%), Shopify (2.7%), Advanced (2.4%). Lower tiers have higher
                    fees.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-4 transition-all hover:shadow-md hover:border-green-500/30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 font-bold">£</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Payment Processing: 2.9%</h3>
                  <p className="text-sm">
                    Shopify Payments processing fee. Like the transaction fee, this percentage applies
                    to the total sale including shipping. Advanced plans get lower rates (2.4%).
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-4 transition-all hover:shadow-md hover:border-green-500/30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 font-bold">+</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Monthly Subscription</h3>
                  <p className="text-sm">
                    Basic Shopify starts at £25/month, Shopify at £65/month, and Advanced at £399/month.
                    Higher tiers offer lower transaction fees and additional features.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mx-auto mt-16 max-w-3xl">
          <h2 className="text-2xl font-bold md:text-3xl">Frequently Asked Questions</h2>
          <div className="mt-6 space-y-4">
            {faqStructuredData.mainEntity.map((faq, index) => (
              <div key={index} className="rounded-xl border bg-card/50 backdrop-blur-sm p-4 transition-all hover:shadow-md">
                <h3 className="font-semibold">{faq.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {faq.acceptedAnswer.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Other calculators */}
        <div className="mx-auto mt-16 max-w-3xl">
          <h2 className="text-2xl font-bold md:text-3xl">Other Platform Calculators</h2>
          <p className="mt-2 text-muted-foreground">
            Selling on multiple platforms? Check out our other free calculators:
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <a
              href="/calculators/etsy-fee-calculator"
              className="group relative overflow-hidden rounded-xl border bg-card/50 backdrop-blur-sm p-4 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-500" />
              <span className="font-semibold">Etsy Fee Calculator</span>
              <span className="mt-1 block text-sm text-muted-foreground">
                Calculate Etsy fees and profit
              </span>
            </a>
            <a
              href="/calculators/ebay-fee-calculator"
              className="group relative overflow-hidden rounded-xl border bg-card/50 backdrop-blur-sm p-4 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
              <span className="font-semibold">eBay Fee Calculator</span>
              <span className="mt-1 block text-sm text-muted-foreground">Calculate eBay fees and profit</span>
            </a>
            <a
              href="/calculators/amazon-fba-calculator"
              className="group relative overflow-hidden rounded-xl border bg-card/50 backdrop-blur-sm p-4 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
              <span className="font-semibold">Amazon FBA Calculator</span>
              <span className="mt-1 block text-sm text-muted-foreground">Calculate Amazon fees and profit</span>
            </a>
            <a
              href="/calculators/tiktok-shop-calculator"
              className="group relative overflow-hidden rounded-xl border bg-card/50 backdrop-blur-sm p-4 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-red-500" />
              <span className="font-semibold">TikTok Shop Calculator</span>
              <span className="mt-1 block text-sm text-muted-foreground">Calculate TikTok Shop fees and profit</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
