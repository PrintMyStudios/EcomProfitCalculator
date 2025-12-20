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
      {/* Premium header with gradient accent */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        {/* Gradient accent line */}
        <div className="h-0.5 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500" />
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <a href="/" className="text-xl font-bold">
            EcomProfit<span className="bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">Calculator</span>
          </a>
          <nav className="flex items-center gap-4">
            <a
              href="/calculators/etsy-fee-calculator"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Calculators
            </a>
            <a
              href="/login"
              className="text-sm font-medium bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              Sign In
            </a>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      {/* Enhanced footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-4">
            <a href="/" className="text-lg font-bold">
              EcomProfit<span className="bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">Calculator</span>
            </a>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Free profit calculators for indie sellers. Know your margins before you list.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="/calculators/etsy-fee-calculator" className="hover:text-foreground transition-colors">Etsy</a>
              <a href="/calculators/ebay-fee-calculator" className="hover:text-foreground transition-colors">eBay</a>
              <a href="/calculators/amazon-fba-calculator" className="hover:text-foreground transition-colors">Amazon</a>
              <a href="/calculators/shopify-profit-calculator" className="hover:text-foreground transition-colors">Shopify</a>
              <a href="/calculators/tiktok-shop-calculator" className="hover:text-foreground transition-colors">TikTok</a>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              &copy; {new Date().getFullYear()} EcomProfitCalculator. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
