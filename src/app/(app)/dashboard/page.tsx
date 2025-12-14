'use client';

import Link from 'next/link';
import { useAuth } from '@/components/auth/auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSettingsStore } from '@/stores/settings';

export default function DashboardPage() {
  const { user, userProfile } = useAuth();
  const { showMaterialsLibrary, showSuppliers } = useSettingsStore();

  const quickActions = [
    {
      title: 'Calculator',
      description: 'Calculate profit and margins',
      href: '/calculator',
      show: true,
    },
    {
      title: 'Add Product',
      description: 'Create a new product',
      href: '/products/new',
      show: true,
    },
    {
      title: 'Add Material',
      description: 'Add to your materials library',
      href: '/materials/new',
      show: showMaterialsLibrary,
    },
    {
      title: 'Add Supplier',
      description: 'Add a new supplier',
      href: '/suppliers/new',
      show: showSuppliers,
    },
  ].filter((action) => action.show);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your pricing and profit calculations.
        </p>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className="h-full cursor-pointer transition-colors hover:border-primary hover:bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{action.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Getting Started */}
      {(!userProfile?.sellerTypes || userProfile.sellerTypes.length === 0) && (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Complete these steps to get the most out of EcomProfitCalculator
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                1
              </div>
              <div className="flex-1">
                <p className="font-medium">Add your first product</p>
                <p className="text-sm text-muted-foreground">
                  Create a product with your costs to start calculating profits
                </p>
              </div>
              <Link href="/products/new">
                <Button size="sm">Add Product</Button>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                2
              </div>
              <div className="flex-1">
                <p className="font-medium">Use the calculator</p>
                <p className="text-sm text-muted-foreground">
                  See your profit margins and fees across platforms
                </p>
              </div>
              <Link href="/calculator">
                <Button variant="outline" size="sm">
                  Open Calculator
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                3
              </div>
              <div className="flex-1">
                <p className="font-medium">Compare platforms</p>
                <p className="text-sm text-muted-foreground">
                  See how fees differ between Etsy, eBay, Amazon and more
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Placeholder */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Your Stats</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Products</CardDescription>
              <CardTitle className="text-3xl">0</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Calculations</CardDescription>
              <CardTitle className="text-3xl">0</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg. Margin</CardDescription>
              <CardTitle className="text-3xl">--%</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Best Platform</CardDescription>
              <CardTitle className="text-3xl">--</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Calculations</CardTitle>
          <CardDescription>Your latest profit calculations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-muted-foreground">No calculations yet</p>
            <p className="text-sm text-muted-foreground">
              Use the calculator to see your calculations here
            </p>
            <Link href="/calculator" className="mt-4">
              <Button>Open Calculator</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
