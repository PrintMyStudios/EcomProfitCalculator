import Link from 'next/link';
import { Calculator } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold">
              <Calculator className="h-5 w-5 text-emerald-500" />
              <span>
                EcomProfit<span className="text-emerald-500">Calculator</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Know your true profit before you list. The essential calculator for online sellers.
            </p>
          </div>

          {/* Calculators */}
          <div>
            <h3 className="mb-3 font-semibold">Free Calculators</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/calculators/etsy-fee-calculator" className="text-muted-foreground hover:text-foreground transition-colors">
                  Etsy Fee Calculator
                </Link>
              </li>
              <li>
                <Link href="/calculators/ebay-fee-calculator" className="text-muted-foreground hover:text-foreground transition-colors">
                  eBay Fee Calculator
                </Link>
              </li>
              <li>
                <Link href="/calculators/amazon-fba-calculator" className="text-muted-foreground hover:text-foreground transition-colors">
                  Amazon FBA Calculator
                </Link>
              </li>
              <li>
                <Link href="/calculators/shopify-profit-calculator" className="text-muted-foreground hover:text-foreground transition-colors">
                  Shopify Calculator
                </Link>
              </li>
              <li>
                <Link href="/calculators/tiktok-shop-calculator" className="text-muted-foreground hover:text-foreground transition-colors">
                  TikTok Shop Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Product */}
          <div>
            <h3 className="mb-3 font-semibold">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/signup" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sign Up Free
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-3 font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} EcomProfitCalculator. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with care for indie sellers worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
