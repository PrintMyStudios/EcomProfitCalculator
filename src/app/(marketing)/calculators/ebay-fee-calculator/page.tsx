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

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Hero section */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            Free eBay Fee Calculator
          </h1>
          <p className="mt-4 text-lg text-muted-foreground md:text-xl">
            Calculate your eBay fees, profit, and margins instantly.
            <br className="hidden sm:inline" />
            See exactly how much you keep after all fees.
          </p>
        </div>

        {/* Calculator */}
        <div className="mx-auto mt-8 max-w-4xl md:mt-12">
          <EbayCalculator />
        </div>

        {/* CTA */}
        <div className="mx-auto mt-12 max-w-2xl rounded-lg border bg-muted/50 p-6 text-center md:p-8">
          <h2 className="text-xl font-semibold md:text-2xl">
            Want to save calculations &amp; compare platforms?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Create a free account to save your products, compare fees across eBay, Etsy, Amazon,
            and more.
          </p>
          <a
            href="/signup"
            className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Sign Up Free
          </a>
        </div>

        {/* How eBay Fees Work */}
        <div className="mx-auto mt-16 max-w-3xl">
          <h2 className="text-2xl font-bold md:text-3xl">How eBay Fees Work in 2025</h2>
          <div className="mt-6 space-y-6 text-muted-foreground">
            <p>
              Understanding eBay&apos;s fee structure is essential for pricing your products
              profitably. Here&apos;s a complete breakdown of what eBay charges sellers:
            </p>

            <div className="rounded-lg border p-4">
              <h3 className="font-semibold text-foreground">Final Value Fee: 10%</h3>
              <p className="mt-1 text-sm">
                Charged on the total sale amount (item price + shipping). This is eBay&apos;s
                main commission for using their marketplace. The 10% rate applies to most
                categories.
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="font-semibold text-foreground">Payment Processing: 2.9%</h3>
              <p className="mt-1 text-sm">
                eBay Managed Payments processing fee. The percentage applies to the total sale
                amount (item + shipping). This fee covers the cost of processing credit card and
                other payment methods.
              </p>
            </div>

            <div className="rounded-lg border bg-blue-50 p-4 dark:bg-blue-950">
              <h3 className="font-semibold text-foreground">No Listing Fees!</h3>
              <p className="mt-1 text-sm">
                Unlike Etsy, eBay doesn&apos;t charge listing fees for most sellers. You only pay
                when your item sells, making it easier to test different products and price points
                without upfront costs.
              </p>
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
          <div className="mt-6 space-y-6">
            {faqStructuredData.mainEntity.map((faq, index) => (
              <div key={index} className="rounded-lg border p-4">
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
            <div className="rounded-lg border-l-4 border-primary bg-muted/50 p-4">
              <h3 className="font-semibold">Offer Free Shipping</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Items with free shipping rank higher in search results. Build the shipping cost
                into your item price to stay competitive.
              </p>
            </div>
            <div className="rounded-lg border-l-4 border-primary bg-muted/50 p-4">
              <h3 className="font-semibold">Price Competitively</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Research similar sold listings to understand market prices. Price too high and you
                won&apos;t sell; too low and you lose profit.
              </p>
            </div>
            <div className="rounded-lg border-l-4 border-primary bg-muted/50 p-4">
              <h3 className="font-semibold">Factor in All Costs</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Don&apos;t forget packaging materials, shipping supplies, and your time. Use this
                calculator to ensure your price covers everything.
              </p>
            </div>
            <div className="rounded-lg border-l-4 border-primary bg-muted/50 p-4">
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
              className="rounded-lg border p-4 hover:border-primary hover:bg-muted/50"
            >
              <span className="font-semibold">Etsy Fee Calculator</span>
              <span className="mt-1 block text-sm text-muted-foreground">
                Calculate Etsy fees and profit
              </span>
            </a>
            <a
              href="/calculators/amazon-fba-calculator"
              className="rounded-lg border p-4 hover:border-primary hover:bg-muted/50"
            >
              <span className="font-semibold">Amazon FBA Calculator</span>
              <span className="mt-1 block text-sm text-muted-foreground">Coming soon</span>
            </a>
            <a
              href="/calculators/shopify-profit-calculator"
              className="rounded-lg border p-4 hover:border-primary hover:bg-muted/50"
            >
              <span className="font-semibold">Shopify Profit Calculator</span>
              <span className="mt-1 block text-sm text-muted-foreground">Coming soon</span>
            </a>
            <a
              href="/calculators/tiktok-shop-calculator"
              className="rounded-lg border p-4 hover:border-primary hover:bg-muted/50"
            >
              <span className="font-semibold">TikTok Shop Calculator</span>
              <span className="mt-1 block text-sm text-muted-foreground">Coming soon</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
