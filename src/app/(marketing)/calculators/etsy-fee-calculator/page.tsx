import type { Metadata } from 'next';
import { EtsyCalculator } from '@/components/calculator/etsy-calculator';

export const metadata: Metadata = {
  title: 'Free Etsy Fee Calculator 2025 - Calculate Your Profit & Margins',
  description:
    'Calculate your Etsy fees, profit, and margins instantly. Includes transaction fees (6.5%), payment processing (4% + £0.20), and listing fees (£0.15). Free, no signup required.',
  keywords: [
    'Etsy fee calculator',
    'Etsy profit calculator',
    'Etsy seller fees',
    'Etsy transaction fee',
    'Etsy payment processing fee',
    'Etsy margin calculator',
    'how much does Etsy take',
    'Etsy fees 2025',
  ],
  openGraph: {
    title: 'Free Etsy Fee Calculator 2025',
    description:
      'Calculate your Etsy fees and profit margins instantly. See exactly how much you keep after all fees.',
    type: 'website',
    locale: 'en_GB',
    siteName: 'EcomProfitCalculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Etsy Fee Calculator 2025',
    description:
      'Calculate your Etsy fees and profit margins instantly. See exactly how much you keep after all fees.',
  },
  alternates: {
    canonical: '/calculators/etsy-fee-calculator',
  },
};

// FAQ structured data for rich snippets
const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What fees does Etsy charge sellers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Etsy charges several fees: Transaction fee (6.5% of item price + shipping), Payment processing fee (4% + £0.20 per transaction), and Listing fee (£0.15 per item). These fees are deducted from your earnings automatically.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does Etsy take from a sale?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For a typical sale, Etsy takes approximately 10.5% of the total (item + shipping) plus fixed fees of around £0.35. For example, on a £20 item with £3 shipping, Etsy would take about £2.77 in fees.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are Etsy fees charged on shipping?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Etsy charges transaction fees (6.5%) and payment processing fees (4%) on the shipping cost as well as the item price. This is why free shipping can sometimes be more profitable - you can build the shipping cost into the item price.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I calculate my Etsy profit margin?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'To calculate your Etsy profit margin: Profit = Sale Price - Product Cost - Etsy Fees - Shipping Cost (if you pay it). Margin = (Profit ÷ Sale Price) × 100. Use our free calculator above to see your exact profit and margin instantly.',
      },
    },
  ],
};

export default function EtsyFeeCalculatorPage() {
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
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-orange-500/20 to-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative container mx-auto px-4 py-12 md:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-medium mb-4">
              Etsy Fee Calculator
            </span>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              Calculate Your{' '}
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                Etsy Profits
              </span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl">
              Calculate your Etsy fees, profit, and margins instantly.
              <br className="hidden sm:inline" />
              See exactly how much you keep after all fees.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Calculator */}
        <div className="mx-auto max-w-4xl">
          <EtsyCalculator />
        </div>

        {/* CTA with gradient border */}
        <div className="mx-auto mt-12 max-w-2xl">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl opacity-50 group-hover:opacity-75 blur-sm transition-opacity" />
            <div className="relative rounded-lg bg-card p-6 text-center md:p-8">
              <h2 className="text-xl font-semibold md:text-2xl">
                Want to save calculations &amp; compare platforms?
              </h2>
              <p className="mt-2 text-muted-foreground">
                Create a free account to save your products, compare fees across Etsy, eBay, Amazon,
                and more.
              </p>
              <a
                href="/signup"
                className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-gradient-to-r from-orange-500 to-amber-500 px-6 text-sm font-medium text-white hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/25 transition-all"
              >
                Sign Up Free
              </a>
            </div>
          </div>
        </div>

        {/* How Etsy Fees Work */}
        <div className="mx-auto mt-16 max-w-3xl">
          <h2 className="text-2xl font-bold md:text-3xl">
            How <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Etsy Fees</span> Work in 2025
          </h2>
          <div className="mt-6 space-y-4 text-muted-foreground">
            <p>
              Understanding Etsy&apos;s fee structure is crucial for pricing your products profitably.
              Here&apos;s a complete breakdown of what Etsy charges sellers:
            </p>

            <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-4 transition-all hover:shadow-md hover:border-orange-500/30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center">
                  <span className="text-orange-600 dark:text-orange-400 font-bold">%</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Transaction Fee: 6.5%</h3>
                  <p className="text-sm">
                    Charged on the total sale amount (item price + shipping).
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-4 transition-all hover:shadow-md hover:border-orange-500/30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center">
                  <span className="text-orange-600 dark:text-orange-400 font-bold">£</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Payment Processing: 4% + £0.20</h3>
                  <p className="text-sm">
                    Etsy Payments fee applies to total plus fixed amount per transaction.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-4 transition-all hover:shadow-md hover:border-orange-500/30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center">
                  <span className="text-orange-600 dark:text-orange-400 font-bold">+</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Listing Fee: £0.15</h3>
                  <p className="text-sm">
                    Charged when you list an item and when it sells (auto-renew).
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
              href="/calculators/ebay-fee-calculator"
              className="group relative overflow-hidden rounded-xl border bg-card/50 backdrop-blur-sm p-4 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
              <span className="font-semibold">eBay Fee Calculator</span>
              <span className="mt-1 block text-sm text-muted-foreground">
                Calculate eBay fees and profit
              </span>
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
              href="/calculators/shopify-profit-calculator"
              className="group relative overflow-hidden rounded-xl border bg-card/50 backdrop-blur-sm p-4 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
              <span className="font-semibold">Shopify Profit Calculator</span>
              <span className="mt-1 block text-sm text-muted-foreground">Calculate Shopify fees and profit</span>
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
