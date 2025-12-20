import type { Metadata } from 'next';
import { EbayCalculator } from '@/components/calculator/ebay-calculator';

export const metadata: Metadata = {
  title: 'Free eBay Fee Calculator 2025 - Calculate Your Profit & Margins',
  description:
    'Calculate your eBay fees, profit, and margins instantly. Includes final value fee (10%) and payment processing (2.9%). Free, no signup required.',
  keywords: [
    'eBay fee calculator',
    'eBay profit calculator',
    'eBay seller fees',
    'eBay final value fee',
    'eBay payment processing fee',
    'eBay margin calculator',
    'how much does eBay take',
    'eBay fees 2025',
    'eBay selling fees',
  ],
  openGraph: {
    title: 'Free eBay Fee Calculator 2025',
    description:
      'Calculate your eBay fees and profit margins instantly. See exactly how much you keep after all fees.',
    type: 'website',
    locale: 'en_GB',
    siteName: 'EcomProfitCalculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free eBay Fee Calculator 2025',
    description:
      'Calculate your eBay fees and profit margins instantly. See exactly how much you keep after all fees.',
  },
  alternates: {
    canonical: '/calculators/ebay-fee-calculator',
  },
};

// FAQ structured data for rich snippets
const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What fees does eBay charge sellers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'eBay charges two main fees: Final value fee (10% of the total sale amount including shipping) and Payment processing fee (2.9% of the total). These fees are automatically deducted from your earnings when an item sells.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does eBay take from a sale?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For a typical sale, eBay takes approximately 12.9% of the total sale amount (item price + shipping). For example, on a £20 item with £3 shipping, eBay would take about £2.97 in fees, leaving you with £20.03.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does eBay charge fees on shipping?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, eBay charges both the final value fee (10%) and payment processing fee (2.9%) on the shipping cost as well as the item price. The total amount the buyer pays (item + shipping) is used to calculate your fees.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I calculate my eBay profit margin?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'To calculate your eBay profit margin: Profit = Sale Price - Product Cost - eBay Fees - Shipping Cost (if you pay it). Margin = (Profit ÷ Sale Price) × 100. Use our free calculator above to see your exact profit and margin instantly.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is eBay cheaper than Etsy for sellers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'eBay typically charges around 12.9% in total fees (10% final value + 2.9% payment processing), while Etsy charges around 10.5% plus fixed fees (6.5% transaction + 4% payment + £0.20 + £0.15 listing). For higher-priced items, eBay may be slightly cheaper, but for lower-priced items, Etsy could be more cost-effective.',
      },
    },
  ],
};

export default function EbayFeeCalculatorPage() {
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
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-blue-500/20 to-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative container mx-auto px-4 py-12 md:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium mb-4">
              eBay Fee Calculator
            </span>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              Calculate Your{' '}
              <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                eBay Profits
              </span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl">
              Calculate your eBay fees, profit, and margins instantly.
              <br className="hidden sm:inline" />
              See exactly how much you keep after all fees.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Calculator */}
        <div className="mx-auto max-w-4xl">
          <EbayCalculator />
        </div>

        {/* CTA with gradient border */}
        <div className="mx-auto mt-12 max-w-2xl">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl opacity-50 group-hover:opacity-75 blur-sm transition-opacity" />
            <div className="relative rounded-lg bg-card p-6 text-center md:p-8">
              <h2 className="text-xl font-semibold md:text-2xl">
                Want to save calculations &amp; compare platforms?
              </h2>
              <p className="mt-2 text-muted-foreground">
                Create a free account to save your products, compare fees across eBay, Etsy, Amazon,
                and more.
              </p>
              <a
                href="/signup"
                className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 px-6 text-sm font-medium text-white hover:from-blue-600 hover:to-indigo-600 shadow-lg shadow-blue-500/25 transition-all"
              >
                Sign Up Free
              </a>
            </div>
          </div>
        </div>

        {/* How eBay Fees Work */}
        <div className="mx-auto mt-16 max-w-3xl">
          <h2 className="text-2xl font-bold md:text-3xl">
            How <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">eBay Fees</span> Work in 2025
          </h2>
          <div className="mt-6 space-y-4 text-muted-foreground">
            <p>
              Understanding eBay&apos;s fee structure is essential for pricing your products
              profitably. Here&apos;s a complete breakdown of what eBay charges sellers:
            </p>

            <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-4 transition-all hover:shadow-md hover:border-blue-500/30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">%</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Final Value Fee: 10%</h3>
                  <p className="text-sm">
                    Charged on the total sale amount (item price + shipping).
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-4 transition-all hover:shadow-md hover:border-blue-500/30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">£</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Payment Processing: 2.9%</h3>
                  <p className="text-sm">
                    eBay Managed Payments processing fee on the total sale amount.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-4 transition-all hover:shadow-md hover:border-blue-500/30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">No Listing Fees!</h3>
                  <p className="text-sm">
                    Unlike Etsy, you only pay when your item sells. No upfront costs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* eBay vs Other Platforms */}
        <div className="mx-auto mt-16 max-w-3xl">
          <h2 className="text-2xl font-bold md:text-3xl">eBay vs Other Platforms</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-left font-semibold">Platform</th>
                  <th className="pb-3 text-right font-semibold">Total Fees</th>
                  <th className="pb-3 text-right font-semibold">Best For</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b">
                  <td className="py-3 font-medium text-foreground">eBay</td>
                  <td className="py-3 text-right">~12.9%</td>
                  <td className="py-3 text-right">General items, electronics</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 font-medium text-foreground">Etsy</td>
                  <td className="py-3 text-right">~10.5% + £0.35</td>
                  <td className="py-3 text-right">Handmade, vintage, crafts</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 font-medium text-foreground">Amazon</td>
                  <td className="py-3 text-right">~15%</td>
                  <td className="py-3 text-right">High-volume, branded items</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-foreground">Shopify</td>
                  <td className="py-3 text-right">~5.8%</td>
                  <td className="py-3 text-right">Your own brand/store</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            *Fees are approximate and may vary based on category, seller level, and location.
          </p>
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

        {/* Tips for eBay Sellers */}
        <div className="mx-auto mt-16 max-w-3xl">
          <h2 className="text-2xl font-bold md:text-3xl">Tips to Maximize eBay Profits</h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-4 transition-all hover:shadow-md hover:border-blue-500/30">
              <h3 className="font-semibold">Offer Free Shipping</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Items with free shipping rank higher in search results. Build the shipping cost
                into your item price to stay competitive.
              </p>
            </div>
            <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-4 transition-all hover:shadow-md hover:border-blue-500/30">
              <h3 className="font-semibold">Price Competitively</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Research similar sold listings to understand market prices. Price too high and you
                won&apos;t sell; too low and you lose profit.
              </p>
            </div>
            <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-4 transition-all hover:shadow-md hover:border-blue-500/30">
              <h3 className="font-semibold">Factor in All Costs</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Don&apos;t forget packaging materials, shipping supplies, and your time. Use this
                calculator to ensure your price covers everything.
              </p>
            </div>
            <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-4 transition-all hover:shadow-md hover:border-blue-500/30">
              <h3 className="font-semibold">Understand VAT Requirements</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                If you&apos;re VAT registered in the UK, you must charge VAT on your sales. Your
                profit is calculated on receipts excluding VAT.
              </p>
            </div>
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
