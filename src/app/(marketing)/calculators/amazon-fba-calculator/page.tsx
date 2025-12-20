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

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Hero section */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            Free Amazon FBA Fee Calculator
          </h1>
          <p className="mt-4 text-lg text-muted-foreground md:text-xl">
            Calculate your Amazon FBA fees, profit, and margins instantly.
            <br className="hidden sm:inline" />
            See exactly how much you keep after all fees.
          </p>
        </div>

        {/* Calculator */}
        <div className="mx-auto mt-8 max-w-4xl md:mt-12">
          <AmazonCalculator />
        </div>

        {/* CTA */}
        <div className="mx-auto mt-12 max-w-2xl rounded-lg border bg-muted/50 p-6 text-center md:p-8">
          <h2 className="text-xl font-semibold md:text-2xl">
            Want to save calculations &amp; compare platforms?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Create a free account to save your products, compare fees across Amazon, Etsy, eBay,
            and more.
          </p>
          <a
            href="/signup"
            className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Sign Up Free
          </a>
        </div>

        {/* How Amazon FBA Fees Work */}
        <div className="mx-auto mt-16 max-w-3xl">
          <h2 className="text-2xl font-bold md:text-3xl">How Amazon FBA Fees Work in 2025</h2>
          <div className="mt-6 space-y-6 text-muted-foreground">
            <p>
              Understanding Amazon&apos;s fee structure is essential for pricing your products
              profitably. Here&apos;s a complete breakdown of what Amazon charges FBA sellers:
            </p>

            <div className="rounded-lg border p-4">
              <h3 className="font-semibold text-foreground">Referral Fee: 15%</h3>
              <p className="mt-1 text-sm">
                Charged on the item price (not shipping). This is Amazon&apos;s commission for
                selling on their marketplace. Most categories are 15%, but some vary from 6% to
                45%.
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="font-semibold text-foreground">FBA Fulfillment Fees</h3>
              <p className="mt-1 text-sm">
                Amazon picks, packs, and ships your products. Fees vary by size and weight. Small
                standard items start around £2.50, while large items can cost £5+ per unit.
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="font-semibold text-foreground">Monthly Storage Fees</h3>
              <p className="mt-1 text-sm">
                Charged per cubic foot per month. Standard storage is approximately £0.70/cubic
                foot (January-September) and £1.40/cubic foot (October-December).
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="font-semibold text-foreground">Optional Fees</h3>
              <p className="mt-1 text-sm">
                Additional services include inventory removal (£0.50-£0.80 per item), labeling
                (£0.15-£0.30 per item), and long-term storage (£6.90 per cubic foot after 365
                days).
              </p>
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
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold text-foreground">Fulfillment by Amazon (FBA)</h3>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• Prime eligibility increases sales</li>
                  <li>• Amazon handles customer service</li>
                  <li>• Higher fees but better conversion</li>
                  <li>• Best for: Popular, fast-selling items</li>
                </ul>
              </div>

              <div className="rounded-lg border p-4">
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
                Calculate Etsy fees (6.5% + 4% + £0.35)
              </span>
            </a>
            <a
              href="/calculators/ebay-fee-calculator"
              className="rounded-lg border p-4 hover:border-primary hover:bg-muted/50"
            >
              <span className="font-semibold">eBay Fee Calculator</span>
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
