'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { SellerType, Currency, PlatformKey } from '@/types';
import { CURRENCIES } from '@/lib/constants';

const STEPS = [
  { id: 1, title: 'What do you sell?', description: 'Select all that apply' },
  { id: 2, title: 'Where are you based?', description: 'Select your country' },
  { id: 3, title: 'VAT Registration', description: 'Are you VAT registered?' },
  { id: 4, title: 'Primary Platform', description: 'Where do you sell most?' },
  { id: 5, title: 'Currency', description: 'Your default currency' },
];

const SELLER_TYPES: { value: SellerType; label: string; description: string }[] = [
  { value: 'handmade', label: 'Handmade / Crafts', description: 'I make products from raw materials' },
  { value: 'dropship', label: 'Dropshipping', description: 'I source from suppliers like AliExpress' },
  { value: 'print_on_demand', label: 'Print on Demand', description: 'I use services like Printful, Printify' },
  { value: 'resale', label: 'Resale / Wholesale', description: 'I buy wholesale and resell' },
];

const COUNTRIES = [
  { code: 'GB', name: 'United Kingdom', currency: 'GBP' as Currency },
  { code: 'US', name: 'United States', currency: 'USD' as Currency },
  { code: 'DE', name: 'Germany', currency: 'EUR' as Currency },
  { code: 'FR', name: 'France', currency: 'EUR' as Currency },
  { code: 'CA', name: 'Canada', currency: 'CAD' as Currency },
  { code: 'AU', name: 'Australia', currency: 'AUD' as Currency },
  { code: 'JP', name: 'Japan', currency: 'JPY' as Currency },
  { code: 'CH', name: 'Switzerland', currency: 'CHF' as Currency },
  { code: 'SE', name: 'Sweden', currency: 'SEK' as Currency },
  { code: 'NO', name: 'Norway', currency: 'NOK' as Currency },
  { code: 'DK', name: 'Denmark', currency: 'DKK' as Currency },
  { code: 'NL', name: 'Netherlands', currency: 'EUR' as Currency },
  { code: 'IE', name: 'Ireland', currency: 'EUR' as Currency },
  { code: 'ES', name: 'Spain', currency: 'EUR' as Currency },
  { code: 'IT', name: 'Italy', currency: 'EUR' as Currency },
];

const PLATFORMS: { value: PlatformKey; label: string }[] = [
  { value: 'etsy', label: 'Etsy' },
  { value: 'ebay', label: 'eBay' },
  { value: 'amazon', label: 'Amazon' },
  { value: 'shopify', label: 'Shopify' },
  { value: 'tiktok', label: 'TikTok Shop' },
];

export default function OnboardingPage() {
  const { user, refreshUserProfile } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [sellerTypes, setSellerTypes] = useState<SellerType[]>([]);
  const [country, setCountry] = useState('GB');
  const [vatRegistered, setVatRegistered] = useState<'yes' | 'no' | 'unsure'>('no');
  const [primaryPlatform, setPrimaryPlatform] = useState<PlatformKey>('etsy');
  const [currency, setCurrency] = useState<Currency>('GBP');

  const progress = (currentStep / STEPS.length) * 100;

  const handleSellerTypeToggle = (type: SellerType) => {
    setSellerTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleCountryChange = (countryCode: string) => {
    setCountry(countryCode);
    // Auto-suggest currency based on country
    const selectedCountry = COUNTRIES.find((c) => c.code === countryCode);
    if (selectedCountry) {
      setCurrency(selectedCountry.currency);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return sellerTypes.length > 0;
      case 2:
        return country.length > 0;
      case 3:
        return true; // vatRegistered always has a value
      case 4:
        return primaryPlatform.length > 0;
      case 5:
        return currency.length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      if (!db) {
        throw new Error('Database not initialized');
      }

      // Determine feature visibility based on seller types
      const hasHandmade = sellerTypes.includes('handmade');
      // Suppliers are shown for ALL seller types - everyone buys from suppliers

      // Update user profile in Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        sellerTypes,
        country,
        vatRegistered: vatRegistered === 'yes',
        primaryPlatform,
        currency,
        defaultHourlyRate: 1500, // £15.00 default
        defaultTargetMargin: 30, // 30% default
        showMaterialsLibrary: hasHandmade,
        showSuppliers: true, // Always show suppliers
        showTimeTracking: hasHandmade,
        onboardingCompleted: true,
        updatedAt: serverTimestamp(),
      });

      // Refresh the user profile in context
      await refreshUserProfile();

      // Celebration confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Show success toast and redirect to dashboard
      toast.success('Setup complete!', {
        description: "Let's start calculating your profits",
      });

      // Small delay to let the confetti be visible
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save your profile. Please try again.');
      toast.error('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            {SELLER_TYPES.map((type) => (
              <div
                key={type.value}
                className={`flex cursor-pointer items-start space-x-3 rounded-lg border p-4 transition-colors ${
                  sellerTypes.includes(type.value)
                    ? 'border-primary bg-primary/5'
                    : 'hover:border-muted-foreground/50'
                }`}
                onClick={() => handleSellerTypeToggle(type.value)}
              >
                <Checkbox
                  id={type.value}
                  checked={sellerTypes.includes(type.value)}
                  onCheckedChange={() => handleSellerTypeToggle(type.value)}
                />
                <div className="space-y-1">
                  <Label htmlFor={type.value} className="cursor-pointer font-medium">
                    {type.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </div>
              </div>
            ))}
          </div>
        );

      case 2:
        return (
          <Select value={country} onValueChange={handleCountryChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 3:
        return (
          <RadioGroup
            value={vatRegistered}
            onValueChange={(v) => setVatRegistered(v as 'yes' | 'no' | 'unsure')}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="yes" id="vat-yes" />
              <Label htmlFor="vat-yes" className="flex-1 cursor-pointer">
                <span className="font-medium">Yes, I&apos;m VAT registered</span>
                <p className="text-sm text-muted-foreground">
                  Profit will be calculated on receipts excluding VAT
                </p>
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="no" id="vat-no" />
              <Label htmlFor="vat-no" className="flex-1 cursor-pointer">
                <span className="font-medium">No, I&apos;m not VAT registered</span>
                <p className="text-sm text-muted-foreground">
                  Standard profit calculation
                </p>
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4">
              <RadioGroupItem value="unsure" id="vat-unsure" />
              <Label htmlFor="vat-unsure" className="flex-1 cursor-pointer">
                <span className="font-medium">I&apos;m not sure</span>
                <p className="text-sm text-muted-foreground">
                  We&apos;ll assume non-VAT (you can change this later)
                </p>
              </Label>
            </div>
          </RadioGroup>
        );

      case 4:
        return (
          <RadioGroup
            value={primaryPlatform}
            onValueChange={(v) => setPrimaryPlatform(v as PlatformKey)}
            className="space-y-3"
          >
            {PLATFORMS.map((platform) => (
              <div
                key={platform.value}
                className="flex items-center space-x-3 rounded-lg border p-4"
              >
                <RadioGroupItem value={platform.value} id={`platform-${platform.value}`} />
                <Label
                  htmlFor={`platform-${platform.value}`}
                  className="flex-1 cursor-pointer font-medium"
                >
                  {platform.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 5:
        return (
          <div className="space-y-4">
            <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(CURRENCIES).map((curr) => (
                  <SelectItem key={curr.code} value={curr.code}>
                    {curr.symbol} {curr.code} - {curr.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Based on your country, we suggest {CURRENCIES[currency].symbol} {currency}. You can
              change this at any time in settings.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">
            EcomProfit<span className="text-primary">Calculator</span>
          </h1>
          <p className="mt-2 text-muted-foreground">Let&apos;s set up your account</p>
        </div>

        <Card>
          <CardHeader>
            <div className="mb-4">
              <Progress value={progress} className="h-2" />
              <p className="mt-2 text-xs text-muted-foreground text-right">
                Step {currentStep} of {STEPS.length}
              </p>
            </div>
            <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
            <CardDescription>{STEPS[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {renderStep()}

            <div className="mt-6 flex justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1 || loading}
              >
                Back
              </Button>
              {currentStep < STEPS.length ? (
                <Button onClick={handleNext} disabled={!canProceed() || loading}>
                  Continue
                </Button>
              ) : (
                <Button onClick={handleComplete} disabled={!canProceed() || loading}>
                  {loading ? 'Saving...' : 'Complete Setup'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
