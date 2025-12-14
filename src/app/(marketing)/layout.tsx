import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | EcomProfitCalculator',
    default: 'EcomProfitCalculator - Price Your Products Profitably',
  },
  description:
    'Free profit calculators for Etsy, eBay, Amazon, Shopify, and TikTok Shop. Know your margins before you list.',
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Simple header for marketing pages */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <a href="/" className="text-xl font-bold">
            EcomProfit<span className="text-primary">Calculator</span>
          </a>
          <nav className="flex items-center gap-4">
            <a
              href="/calculators/etsy-fee-calculator"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Calculators
            </a>
            <a
              href="/login"
              className="text-sm font-medium text-primary hover:underline"
            >
              Sign In
            </a>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      {/* Simple footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} EcomProfitCalculator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
