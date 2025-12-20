import type { Metadata } from 'next';
import { AmazonCalculator } from '@/components/calculator/amazon-calculator';

export const metadata: Metadata = {
  title: 'Free Amazon FBA Fee Calculator 2025 - Calculate Your Profit & Margins',
  description:
    'Calculate your Amazon FBA fees, profit, and margins instantly. Includes referral fees (15%), FBA fulfillment fees, and storage costs. Free, no signup required.',
  keywords: [
    'Amazon FBA calculator',
    'Amazon FBA profit calculator',
    'Amazon seller fees',
    'Amazon referral fee',
    'FBA fees calculator',
    'Amazon margin calculator',
    'how much does Amazon take',
    'Amazon seller fees 2025',
    'Amazon FBA fees 2025',
    'FBA fulfillment fees',
  ],
  openGraph: {
    title: 'Free Amazon FBA Fee Calculator 2025',
    description:
      'Calculate your Amazon FBA fees and profit margins instantly. See exactly how much you keep after all fees.',
    type: 'website',
    locale: 'en_GB',
    siteName: 'EcomProfitCalculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Amazon FBA Fee Calculator 2025',
    description:
      'Calculate your Amazon FBA fees and profit margins instantly. See exactly how much you keep after all fees.',
  },
  alternates: {
    canonical: '/calculators/amazon-fba-calculator',
  },
};

// FAQ structured data for rich snippets
const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What fees does Amazon charge FBA sellers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Amazon FBA sellers pay several fees: Referral fee (typically 15% of item price), FBA fulfillment fees (based on size and weight), monthly storage fees, and optional services like labeling or removal. The referral fee is charged on the item price only, not shipping.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does Amazon take from a sale?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Amazon typically takes 15% of the item price as a referral fee for most categories. On top of this, FBA fulfillment fees vary based on product size and weight. For example, on a £20 item, Amazon would take £3 in referral fees, plus additional FBA fees ranging from £2-5 depending on the product.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the Amazon referral fee?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Amazon referral fee is a percentage Amazon charges on each sale, typically 15% for most categories. This fee is calculated on the item price only and does not include shipping costs. Some categories have different rates - for example, Amazon Devices are 45% while Personal Computers are 6%.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I calculate my Amazon FBA profit margin?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'To calculate your Amazon FBA profit margin: Profit = Sale Price - Product Cost - Amazon Referral Fee (15%) - FBA Fulfillment Fee - Storage Fees. Margin = (Profit ÷ Sale Price) × 100. Use our free calculator above to see your exact profit and margin instantly.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are Amazon FBA fees charged on shipping?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No, Amazon referral fees are only charged on the item price, not on shipping costs. However, if you offer free shipping to customers, you need to factor the FBA fulfillment fee into your costs, as Amazon charges you separately for picking, packing, and shipping your products.',
      },
    },
  ],
};

export default function AmazonFbaCalculatorPage() {
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
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-amber-500/20 to-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative container mx-auto px-4 py-12 md:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium mb-4">
              Amazon FBA Calculator
            </span>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              Calculate Your{' '}
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                Amazon Profits
              </span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl">
              Calculate your Amazon FBA fees, profit, and margins instantly.
              <br className="hidden sm:inline" />
              See exactly how much you keep after all fees.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Calculator */}
        <div className="mx-auto max-w-4xl">
          <AmazonCalculator />
        </div>

        {/* CTA with gradient border */}
        <div className="mx-auto mt-12 max-w-2xl">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl opacity-50 group-hover:opacity-75 blur-sm transition-opacity" />
            <div className="relative rounded-lg bg-card p-6 text-center md:p-8">
              <h2 className="text-xl font-semibold md:text-2xl">
                Want to save calculations &amp; compare platforms?
              </h2>
              <p className="mt-2 text-muted-foreground">
                Create a free account to save your products, compare fees across Amazon, Etsy, eBay,
                and more.
              </p>
              <a
                href="/signup"
                className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-gradient-to-r from-amber-500 to-orange-500 px-6 text-sm font-medium text-white hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/25 transition-all"
              >
                Sign Up Free
              </a>
            </div>
          </div>
        </div>

        {/* How Amazon FBA Fees Work */}
        <div className="mx-auto mt-16 max-w-3xl">
          <h2 className="text-2xl font-bold md:text-3xl">
            How <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Amazon FBA Fees</span> Work in 2025
          </h2>
          <div className="mt-6 space-y-4 text-muted-foreground">
            <p>
              Understanding Amazon&apos;s fee structure is essential for pricing your products
              profitably. Here&apos;s a complete breakdown of what Amazon charges FBA sellers:
            </p>

            <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-4 transition-all hover:shadow-md hover:border-amber-500/30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">%</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Referral Fee: 15%</h3>
                  <p className="text-sm">
                    Charged on the item price (not shipping). Most categories are 15%, but some vary from 6% to 45%.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-4 transition-all hover:shadow-md hover:border-amber-500/30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">📦</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">FBA Fulfillment Fees</h3>
                  <p className="text-sm">
                    Amazon picks, packs, and ships your products. Fees vary by size and weight (£2.50-£5+).
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-4 transition-all hover:shadow-md hover:border-amber-500/30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">🏪</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Monthly Storage Fees</h3>
                  <p className="text-sm">
                    £0.70/cubic foot (Jan-Sep) and £1.40/cubic foot (Oct-Dec). Higher fees during peak season.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-4 transition-all hover:shadow-md hover:border-amber-500/30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">+</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Optional Fees</h3>
                  <p className="text-sm">
                    Inventory removal (£0.50-£0.80), labeling (£0.15-£0.30), long-term storage (£6.90/cubic foot).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Amazon FBA vs FBM */}
        <div className="mx-auto mt-16 max-w-3xl">
          <h2 className="text-2xl font-bold md:text-3xl">FBA vs FBM: Which is Right for You?</h2>
          <div className="mt-6 space-y-4 text-muted-foreground">
            <p>
              Amazon sellers can choose between Fulfillment by Amazon (FBA) or Fulfillment by
              Merchant (FBM). Each has different fee structures and benefits:
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-4 transition-all hover:shadow-md">
                <h3 className="font-semibold text-foreground">Fulfillment by Amazon (FBA)</h3>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• Prime eligibility increases sales</li>
                  <li>• Amazon handles customer service</li>
                  <li>• Higher fees but better conversion</li>
                  <li>• Best for: Popular, fast-selling items</li>
                </ul>
              </div>

              <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-4 transition-all hover:shadow-md">
                <h3 className="font-semibold text-foreground">Fulfillment by Merchant (FBM)</h3>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• You handle storage and shipping</li>
                  <li>• Lower Amazon fees (15% referral only)</li>
                  <li>• More control over packaging</li>
                  <li>• Best for: Slow-moving or oversized items</li>
                </ul>
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
