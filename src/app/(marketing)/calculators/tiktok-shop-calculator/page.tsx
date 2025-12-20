import type { Metadata } from 'next';
import { TiktokCalculator } from '@/components/calculator/tiktok-calculator';

export const metadata: Metadata = {
  title: 'Free TikTok Shop Fee Calculator 2025 - Calculate Your Profit & Margins',
  description:
    'Calculate your TikTok Shop fees, profit, and margins instantly. Includes commission (5%) and payment processing (2.9%). Free, no signup required.',
  keywords: [
    'TikTok Shop calculator',
    'TikTok Shop fee calculator',
    'TikTok seller fees',
    'TikTok Shop commission',
    'TikTok Shop payment processing',
    'TikTok profit calculator',
    'TikTok margin calculator',
    'how much does TikTok Shop take',
    'TikTok Shop fees 2025',
    'TikTok seller calculator',
  ],
  openGraph: {
    title: 'Free TikTok Shop Fee Calculator 2025',
    description:
      'Calculate your TikTok Shop fees and profit margins instantly. See exactly how much you keep after all fees.',
    type: 'website',
    locale: 'en_GB',
    siteName: 'EcomProfitCalculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free TikTok Shop Fee Calculator 2025',
    description:
      'Calculate your TikTok Shop fees and profit margins instantly. See exactly how much you keep after all fees.',
  },
  alternates: {
    canonical: '/calculators/tiktok-shop-calculator',
  },
};

// FAQ structured data for rich snippets
const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What fees does TikTok Shop charge sellers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'TikTok Shop charges two main fees: Commission fee (5% of item price) and Payment processing fee (2.9% of total including shipping). These fees are deducted from your earnings automatically when you make a sale.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does TikTok Shop take from a sale?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For a typical sale, TikTok Shop takes approximately 7.9% of the total. For example, on a £20 item with £3 shipping, TikTok Shop would take about £1.67 in fees (£1.00 commission + £0.67 payment processing).',
      },
    },
    {
      '@type': 'Question',
      name: 'Are TikTok Shop fees charged on shipping?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The commission fee (5%) applies only to the item price, not shipping. However, the payment processing fee (2.9%) is charged on the total transaction amount including shipping.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I calculate my TikTok Shop profit margin?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'To calculate your TikTok Shop profit margin: Profit = Sale Price - Product Cost - TikTok Shop Fees - Shipping Cost (if you pay it). Margin = (Profit ÷ Sale Price) × 100. Use our free calculator above to see your exact profit and margin instantly.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is TikTok Shop cheaper than Etsy or eBay?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, TikTok Shop typically has lower fees than most platforms. At 7.9% total, it\'s cheaper than Etsy (approximately 10.5%) and eBay (approximately 12.9%). This makes TikTok Shop attractive for sellers looking to maximize profits, especially for trending products.',
      },
    },
  ],
};

export default function TikTokShopCalculatorPage() {
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
            Free TikTok Shop Fee Calculator
          </h1>
          <p className="mt-4 text-lg text-muted-foreground md:text-xl">
            Calculate your TikTok Shop fees, profit, and margins instantly.
            <br className="hidden sm:inline" />
            See exactly how much you keep after all fees.
          </p>
        </div>

        {/* Calculator */}
        <div className="mx-auto mt-8 max-w-4xl md:mt-12">
          <TiktokCalculator />
        </div>

        {/* CTA */}
        <div className="mx-auto mt-12 max-w-2xl rounded-lg border bg-muted/50 p-6 text-center md:p-8">
          <h2 className="text-xl font-semibold md:text-2xl">
            Want to save calculations &amp; compare platforms?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Create a free account to save your products, compare fees across TikTok Shop, Etsy,
            eBay, Amazon, and more.
          </p>
          <a
            href="/signup"
            className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Sign Up Free
          </a>
        </div>

        {/* How TikTok Shop Fees Work */}
        <div className="mx-auto mt-16 max-w-3xl">
          <h2 className="text-2xl font-bold md:text-3xl">How TikTok Shop Fees Work in 2025</h2>
          <div className="mt-6 space-y-6 text-muted-foreground">
            <p>
              TikTok Shop is one of the newest and most exciting e-commerce platforms, growing
              rapidly thanks to TikTok&apos;s massive user base. Understanding TikTok Shop&apos;s
              fee structure is essential for pricing your products profitably. Here&apos;s what
              TikTok Shop charges sellers:
            </p>

            <div className="rounded-lg border p-4">
              <h3 className="font-semibold text-foreground">Commission: 5%</h3>
              <p className="mt-1 text-sm">
                Charged on the item price only (not shipping). This is TikTok Shop&apos;s platform
                fee for connecting you with buyers through their marketplace and livestream shopping
                features.
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="font-semibold text-foreground">Payment Processing: 2.9%</h3>
              <p className="mt-1 text-sm">
                Applied to the total transaction amount (item price + shipping). This covers credit
                card and payment gateway fees.
              </p>
            </div>

            <div className="rounded-lg border bg-green-50 p-4 dark:bg-green-950">
              <h3 className="font-semibold text-green-900 dark:text-green-100">
                Why TikTok Shop is Cheaper
              </h3>
              <p className="mt-1 text-sm text-green-800 dark:text-green-200">
                At around 7.9% total fees, TikTok Shop is significantly cheaper than Etsy (10.5%),
                eBay (12.9%), and Amazon (15%+). Plus, there are no listing fees or monthly
                subscriptions. This makes it ideal for testing new products and maximizing margins.
              </p>
            </div>
          </div>
        </div>

        {/* TikTok Shop Benefits */}
        <div className="mx-auto mt-16 max-w-3xl">
          <h2 className="text-2xl font-bold md:text-3xl">
            Why Sell on TikTok Shop in 2025?
          </h2>
          <div className="mt-6 space-y-4 text-muted-foreground">
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold text-foreground">Massive Organic Reach</h3>
              <p className="mt-1 text-sm">
                TikTok&apos;s algorithm can make your products go viral overnight. Unlike other
                platforms where you need to pay for ads, TikTok Shop products appear in user feeds
                organically.
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="font-semibold text-foreground">Live Shopping Integration</h3>
              <p className="mt-1 text-sm">
                Sell directly during TikTok Lives with built-in product showcases. This creates an
                engaging, interactive shopping experience that converts viewers into buyers.
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="font-semibold text-foreground">Creator Partnerships</h3>
              <p className="mt-1 text-sm">
                Collaborate with TikTok creators who promote your products to their followers. The
                Affiliate Program makes it easy to partner with influencers at scale.
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="font-semibold text-foreground">Lower Competition (For Now)</h3>
              <p className="mt-1 text-sm">
                TikTok Shop is still relatively new in many markets. Early sellers are seeing
                incredible results before the platform becomes saturated like older marketplaces.
              </p>
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
                Calculate Etsy fees (6.5% + 4% + fees)
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
          </div>
        </div>
      </div>
    </>
  );
}
