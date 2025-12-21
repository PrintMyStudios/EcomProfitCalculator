'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/auth-provider';
import { useProducts } from '@/hooks/use-products';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  calculatePlatformFees,
  calculateProfit,
  calculateBreakEvenPrice,
  calculateTargetPrice,
} from '@/lib/calculations/fees';
import { roundPrice, type RoundingMode } from '@/lib/calculations/rounding';
import {
  formatCurrency,
  toMinorUnits,
  toMajorUnits,
  CURRENCIES,
} from '@/lib/constants/currencies';
import { DEFAULT_PLATFORM_TEMPLATES, PLATFORM_LABELS } from '@/lib/constants/platforms';
import type { PlatformKey, Currency } from '@/types';

// New feature imports
import { calculateDiscountAnalysis } from '@/lib/calculations/discount-analysis';
import { calculateBatchPricing } from '@/lib/calculations/batch-pricing';
import {
  calculatePaymentFees,
  platformIncludesPaymentProcessing,
  type PaymentMethod,
} from '@/lib/constants/payment-methods';
import { DiscountAnalysisTable } from '@/components/calculator/discount-analysis-table';
import { PaymentMethodSelector } from '@/components/calculator/payment-method-selector';
import { BatchPricingTable } from '@/components/calculator/batch-pricing-table';
import { ScenarioSliders } from '@/components/calculator/scenario-sliders';
import type { ScenarioParams } from '@/lib/calculations/scenarios';

// Platform brand colors
const PLATFORM_COLORS: Record<PlatformKey, { bg: string; text: string; gradient: string; border: string }> = {
  etsy: {
    bg: 'bg-orange-500/10',
    text: 'text-orange-600 dark:text-orange-400',
    gradient: 'from-orange-500 to-amber-500',
    border: 'border-orange-500/30',
  },
  ebay: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-600 dark:text-blue-400',
    gradient: 'from-blue-500 to-indigo-500',
    border: 'border-blue-500/30',
  },
  amazon: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-600 dark:text-amber-400',
    gradient: 'from-amber-500 to-orange-500',
    border: 'border-amber-500/30',
  },
  shopify: {
    bg: 'bg-green-500/10',
    text: 'text-green-600 dark:text-green-400',
    gradient: 'from-green-500 to-emerald-500',
    border: 'border-green-500/30',
  },
  tiktok: {
    bg: 'bg-pink-500/10',
    text: 'text-pink-600 dark:text-pink-400',
    gradient: 'from-pink-500 to-red-500',
    border: 'border-pink-500/30',
  },
  custom: {
    bg: 'bg-slate-500/10',
    text: 'text-slate-600 dark:text-slate-400',
    gradient: 'from-slate-500 to-slate-600',
    border: 'border-slate-500/30',
  },
};

// Platform Logo Components
const EtsyLogo = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M8.559 4.009c-.193-.059-.297-.1-.297-.1-.168-.049-.326-.054-.465-.02-.139.035-.256.11-.344.213-.089.104-.145.242-.164.396-.024.235.035.467.164.645.128.179.323.298.541.334.12.02.247.01.367-.028.22-.071.395-.225.49-.434.047-.103.072-.219.072-.34v-.001c0-.243-.139-.478-.364-.665m-.84 1.865c-.246 0-.483-.1-.656-.275-.172-.176-.27-.413-.27-.661 0-.497.409-.903.91-.919.502-.015.936.373.969.87.034.513-.381.95-.899.984l-.054.001" />
    <path d="M19.995 6.252c-.061-.152-.165-.282-.303-.38-.091-.064-.198-.11-.315-.133l-.017-.003c-.118-.024-.245-.02-.369.01-.206.048-.388.163-.518.326-.115.144-.188.32-.21.508-.012.098-.01.199.004.3.029.202.115.387.249.535.182.201.436.321.71.338.117.007.233-.008.342-.043.2-.063.373-.186.49-.35.117-.166.177-.368.171-.574-.006-.2-.076-.39-.204-.539" />
    <path d="M14.062 4.785c-.198-.075-.427-.075-.644-.002-.181.061-.339.176-.453.329-.097.13-.161.285-.187.449-.045.287.038.583.228.81.18.214.445.35.732.375.058.005.116.005.175.001.238-.018.456-.123.612-.295.156-.171.246-.395.253-.63.007-.239-.073-.471-.226-.653-.153-.183-.37-.31-.61-.384" />
    <path d="M8.556 20.138c-.193-.06-.297-.1-.297-.1-.168-.05-.326-.054-.465-.021-.139.035-.256.111-.344.214-.089.103-.145.241-.164.396-.024.234.035.466.164.644.128.179.323.299.541.335.12.019.247.01.367-.029.22-.07.395-.224.49-.433.047-.104.072-.22.072-.34 0-.244-.139-.479-.364-.666m-.84 1.865c-.246 0-.483-.1-.656-.275-.172-.176-.27-.413-.27-.661 0-.497.409-.903.91-.919.502-.015.936.373.969.87.034.513-.381.95-.899.984l-.054.001" />
    <path d="M5.127 11.955c0-4.062.084-4.919.385-5.335.301-.417 1.22-.918 2.055-.918 1.22 0 2.055.417 2.89 1.668l.551-1.501c-.551-.667-1.637-1.418-3.524-1.418-1.97 0-3.607.834-4.325 2.002C2.44 7.621 2.273 9.039 2.273 12.039s.168 4.336.885 5.504c.718 1.168 2.355 2.002 4.325 2.002 1.887 0 2.973-.751 3.524-1.418l-.551-1.501c-.835 1.251-1.67 1.668-2.89 1.668-.835 0-1.754-.501-2.055-.918-.301-.416-.385-1.273-.385-5.335v-.086zm11.31-3.253c-1.22 0-2.139.584-2.64 1.418v-1.251H11.11v10.173h2.857v-5.588c0-1.501.801-2.419 2.055-2.419.634 0 1.17.25 1.587.668l.634-2.002c-.551-.584-1.22-.999-1.804-.999" />
  </svg>
);

const EbayLogo = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5">
    <path fill="#E53238" d="M4.5 8c-1.38 0-2.5.62-2.5 2.5 0 2.38 2.12 2.5 2.5 2.5.38 0 2.5 0 2.5-2s-1.12-3-2.5-3zm0 4c-.62 0-1.5-.13-1.5-1.5S3.88 9 4.5 9 6 9.5 6 10.5 5.12 12 4.5 12z"/>
    <path fill="#0064D2" d="M8.5 5v8h1V9.5c.38-.88 1.12-1.5 2-1.5.38 0 .62.13.62.13L12.5 7s-.38-.25-1-.25C10.5 6.75 9.62 7.5 9.5 8V5h-1z"/>
    <path fill="#F5AF02" d="M14 8c-1.38 0-2.5 1-2.5 2.5s1.12 2.5 2.5 2.5c1 0 1.75-.5 2.12-1l-.75-.5c-.25.38-.75.63-1.37.63-.88 0-1.5-.63-1.5-1.5h4c0-1.5-1.12-2.63-2.5-2.63zm-1.5 2c.13-.75.75-1.25 1.5-1.25S15.38 9.25 15.5 10h-3z"/>
    <path fill="#86B817" d="M21 10.5V8h-1v1c-.38-.63-1.12-1-2-1-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5c.88 0 1.62-.38 2-1v.5l1-.5v-1.5zm-3 1.5c-.88 0-1.5-.62-1.5-1.5S17.12 9 18 9s1.5.62 1.5 1.5-.62 1.5-1.5 1.5z"/>
  </svg>
);

const AmazonLogo = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.502.14.112.188.038.358-.218.509l-.235.14c-2.89 1.353-5.92 2.023-9.104 2.023-4.317 0-8.274-1.085-11.87-3.257-.21-.133-.29-.298-.232-.508l.087-.326zm14.93-3.645c-.236-.012-.486.023-.753.096-.263.073-.488.168-.68.285-.195.12-.293.243-.293.373l-.292.024c0-.072.048-.16.146-.26.094-.102.218-.195.37-.282.244-.14.523-.253.838-.342.314-.088.606-.14.875-.158.27-.014.534.007.79.063.256.058.49.148.706.268.214.12.393.273.537.455.145.183.235.392.272.626.037.234.01.498-.077.79-.088.292-.23.58-.427.865-.198.286-.458.54-.782.765-.268.187-.567.348-.895.481-.327.133-.678.228-1.05.288-.37.058-.715.065-1.032.023-.316-.043-.576-.14-.778-.292-.2-.152-.31-.368-.33-.648-.016-.237.04-.44.172-.612.13-.17.307-.306.53-.406.223-.1.477-.163.765-.19.286-.026.578-.013.874.037.295.05.572.137.832.26.26.122.478.28.654.47.175.19.287.41.335.658l.293-.024c-.062-.31-.19-.58-.384-.81-.193-.23-.43-.415-.71-.555-.28-.14-.583-.234-.91-.28-.327-.048-.64-.05-.938-.01-.3.04-.555.124-.77.248-.215.125-.365.293-.448.505-.082.212-.082.453 0 .722.084.27.225.5.425.692.198.19.438.336.72.435.283.1.585.148.908.148.323-.002.64-.054.952-.158.313-.103.59-.254.835-.45.243-.198.433-.437.57-.716.137-.28.198-.59.183-.93-.015-.34-.123-.635-.326-.885-.202-.25-.466-.44-.794-.57-.328-.13-.698-.19-1.11-.18zm-2.87 4.59c1.34.035 2.66-.267 3.963-.905 1.302-.638 2.214-1.48 2.735-2.525.52-1.044.54-2.08.058-3.108-.34-.72-.85-1.274-1.526-1.662-.676-.388-1.413-.603-2.21-.645-.797-.04-1.587.098-2.37.416-.782.318-1.42.793-1.91 1.423-.49.63-.763 1.355-.82 2.177-.057.822.115 1.583.512 2.282.4.7.975 1.23 1.728 1.588.753.36 1.573.53 2.458.51l-.293.024c-.88.027-1.752-.13-2.615-.47-.864-.342-1.546-.877-2.046-1.607-.5-.73-.728-1.58-.686-2.552.042-.973.345-1.844.908-2.614.563-.77 1.302-1.35 2.218-1.736.916-.388 1.87-.532 2.862-.434.992.1 1.893.425 2.702.977.81.553 1.396 1.278 1.758 2.175.362.897.427 1.85.194 2.855-.234 1.007-.717 1.883-1.448 2.628-.73.745-1.6 1.303-2.607 1.672-1.008.37-2.034.508-3.08.415l.293-.024zm-8.14-4.635l-.234.14c-.133.086-.268.133-.406.14-.14.006-.278-.048-.415-.163-.258-.232-.39-.566-.39-1-.002-.435.133-.815.407-1.14.274-.327.688-.49 1.244-.49h.978v-.978c0-.443-.106-.738-.318-.884-.212-.147-.54-.22-.983-.22-.445 0-.825.07-1.14.213-.314.143-.546.348-.698.614-.132.225-.168.406-.104.546.064.14.248.21.553.21l-.234.14c-.352-.003-.574-.132-.666-.39-.092-.255-.035-.543.17-.862.213-.352.533-.63.96-.834.428-.205.92-.307 1.48-.307.614 0 1.11.127 1.485.38.375.253.563.67.563 1.252v2.932c0 .21.026.352.078.424.052.073.156.108.312.108.053 0 .126-.014.22-.044l.234-.14c.034.177-.016.31-.15.4-.135.088-.316.133-.542.133-.37 0-.616-.112-.74-.336-.098-.177-.158-.435-.18-.774h-.074c-.247.414-.56.716-.937.908-.378.193-.81.29-1.298.29-.488 0-.882-.143-1.182-.43-.3-.286-.45-.658-.45-1.114 0-.48.14-.86.422-1.14.28-.28.685-.46 1.21-.536.526-.077 1.14-.097 1.84-.06v.073c0 .397-.12.71-.36.937-.24.228-.58.342-1.017.342-.247 0-.455-.04-.624-.123-.17-.082-.345-.218-.527-.406l-.234.14z"/>
  </svg>
);

const ShopifyLogo = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.73c-.018-.116-.114-.192-.211-.192s-1.929-.136-1.929-.136-.853-.854-1.147-1.147c-.054-.054-.114-.081-.177-.097l-.768 17.863zM12.27 6.549c-.096-.096-.213-.15-.348-.154l-.474-.019-.117-2.859c-.007-.177-.147-.32-.325-.326l-1.053-.038c-.003-.099-.019-.195-.049-.287-.177-.541-.638-.884-1.229-.884-.031 0-.063.001-.095.003C7.953 2.023 7.377 2.363 6.92 2.97c-.637.843-1.109 2.133-1.241 3.053l-2.101.651c-.654.205-.674.225-.759.85-.066.468-1.773 13.646-1.773 13.646l13.333 2.496L15.337 24l-.054-1.248c-.004-.096-.051-.184-.128-.245-.078-.061-.177-.082-.273-.061l-.884.199c-.13-.498-.503-.872-1.103-.872-.031 0-.063.001-.095.003-.64.038-1.216.379-1.624.961-.019.027-.037.055-.054.084l-.852-3.954c-.025-.117-.124-.2-.243-.206l-.882-.038c-.064-.003-.127.018-.178.058-.051.04-.085.097-.096.16l-.273 1.607c-.031.183-.019.251.094.301l.619.272c.034.015.071.023.108.023.041 0 .082-.01.119-.03l.176-.097.476 2.21c.025.117.124.2.243.206l.882.038c.137.006.256-.088.283-.224l.271-1.367.176.082c.034.016.071.024.108.024.044 0 .088-.011.128-.034l.176-.101.267 1.242c.019.088.076.163.157.205.045.024.095.036.145.036.033 0 .067-.006.099-.018l.873-.326c.116-.043.186-.16.17-.284l-.267-2.08.476.221c.034.016.071.024.108.024.044 0 .088-.011.128-.034l.176-.101c.108-.062.147-.198.09-.31l-.652-1.268.485-.166c.122-.042.192-.168.163-.294l-.41-1.782c-.03-.133-.163-.216-.296-.186l-.5.115-.201-.937 1.129-.387c.122-.042.192-.168.163-.294l-1.031-4.479c-.016-.069-.055-.13-.11-.172zM9.75 7.419c.015.079.011.161-.011.24-.095.331-.47.483-.939.483-.165 0-.347-.019-.543-.059L8.258 6.1c.018-.064.049-.124.091-.177.253-.32.635-.323.871-.308.297.019.515.133.625.33.104.183.04.409.061.622-.008.291-.072.573-.156.852zm-.997-2.723c.01.047.013.095.009.143-.012.133-.073.252-.171.337l-.065.056.001-.005c-.112-.577-.301-1.025-.562-1.344.426.052.72.384.788.813z"/>
  </svg>
);

const TikTokLogo = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const CustomLogo = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const PLATFORM_LOGOS: Record<PlatformKey, React.ComponentType> = {
  etsy: EtsyLogo,
  ebay: EbayLogo,
  amazon: AmazonLogo,
  shopify: ShopifyLogo,
  tiktok: TikTokLogo,
  custom: CustomLogo,
};

// Icons
const PlusIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const TrashIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const TrendingDownIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
  </svg>
);

const SparklesIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const CompareIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

interface MaterialItem {
  id: string;
  name: string;
  quantity: number;
  unitCost: number;
}

// Animated Circular Gauge Component
function CircularGauge({ value, max = 100, size = 120, strokeWidth = 8 }: { value: number; max?: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clampedValue = Math.min(Math.max(value, 0), max);
  const offset = circumference - (clampedValue / max) * circumference;

  const getColor = () => {
    if (value < 0) return 'stroke-red-500';
    if (value < 15) return 'stroke-red-400';
    if (value < 25) return 'stroke-amber-500';
    if (value < 40) return 'stroke-emerald-500';
    return 'stroke-emerald-400';
  };

  const getGlow = () => {
    if (value < 0) return 'drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]';
    if (value < 15) return 'drop-shadow-[0_0_8px_rgba(248,113,113,0.4)]';
    if (value < 25) return 'drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]';
    return 'drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]';
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className={`-rotate-90 transition-all duration-700 ${getGlow()}`} width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="fill-none stroke-muted"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className={`fill-none transition-all duration-700 ease-out ${getColor()}`}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={value < 0 ? circumference : offset}
          style={{ transition: 'stroke-dashoffset 0.7s ease-out, stroke 0.3s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-2xl font-bold tabular-nums ${value < 15 ? 'text-red-500' : value < 25 ? 'text-amber-500' : 'text-emerald-500'}`}>
          {value.toFixed(1)}%
        </span>
        <span className="text-xs text-muted-foreground">margin</span>
      </div>
    </div>
  );
}

// Premium Platform Card for Compare View
function PlatformComparisonCard({
  platform,
  productCost,
  salePrice,
  shippingCost,
  freeShipping,
  vatRegistered,
  vatRate,
  currency,
  isSelected,
  isBest,
  onSelect,
}: {
  platform: PlatformKey;
  productCost: number;
  salePrice: number;
  shippingCost: number;
  freeShipping: boolean;
  vatRegistered: boolean;
  vatRate: number;
  currency: Currency;
  isSelected: boolean;
  isBest: boolean;
  onSelect: () => void;
}) {
  const template = DEFAULT_PLATFORM_TEMPLATES[platform];
  const colors = PLATFORM_COLORS[platform];
  const Logo = PLATFORM_LOGOS[platform];

  const { total: fees } = calculatePlatformFees({
    itemPrice: salePrice,
    shippingCost: freeShipping ? shippingCost : 0,
    quantity: 1,
    fees: template.fees,
  });

  const revenue = salePrice + (freeShipping ? shippingCost : 0);
  const { profit, margin } = calculateProfit({
    revenue,
    productCost,
    platformFees: fees,
    vatRate,
    isVatRegistered: vatRegistered,
  });

  const isProfit = profit > 0;

  return (
    <Card
      className={`group relative cursor-pointer overflow-hidden backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        isSelected
          ? `ring-2 ring-primary shadow-lg ${colors.bg}`
          : 'hover:shadow-lg bg-card/50'
      } ${colors.border} border`}
      onClick={onSelect}
    >
      {/* Gradient accent bar */}
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${colors.gradient}`} />

      {/* Best badge */}
      {isBest && (
        <div className="absolute -right-8 top-3 rotate-45 bg-gradient-to-r from-emerald-500 to-green-500 px-8 py-0.5 text-[10px] font-semibold text-white shadow-lg">
          BEST
        </div>
      )}

      <CardHeader className="pb-3 pt-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className={`rounded-lg p-1.5 ${colors.bg}`}>
            <div className={colors.text}>
              <Logo />
            </div>
          </div>
          <span>{PLATFORM_LABELS[platform]}</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 pb-4">
        {/* Profit Display */}
        <div className="text-center">
          <p className={`text-3xl font-bold tabular-nums transition-colors ${
            isProfit ? 'text-emerald-500' : 'text-red-500'
          }`}>
            {formatCurrency(profit, currency)}
          </p>
          <p className="text-xs text-muted-foreground">profit per sale</p>
        </div>

        {/* Stats */}
        <div className="space-y-2 rounded-lg bg-muted/50 p-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Fees</span>
            <span className="font-medium text-orange-500">{formatCurrency(fees, currency)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Margin</span>
            <span className={`font-semibold ${isProfit ? 'text-emerald-500' : 'text-red-500'}`}>
              {margin.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Mini margin bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              margin < 0 ? 'bg-red-500' : margin < 15 ? 'bg-red-400' : margin < 25 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(Math.max(margin, 0), 100)}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function CalculatorContent() {
  const { userProfile } = useAuth();
  const searchParams = useSearchParams();
  const { products } = useProducts();

  // Get product from URL params
  const productIdParam = searchParams.get('productId');
  const linkedProduct = productIdParam
    ? products.find((p) => p.id === productIdParam)
    : null;

  // Track if we've loaded the product to avoid re-triggering
  const [hasLoadedProduct, setHasLoadedProduct] = useState(false);

  // User settings with defaults
  const currency: Currency = userProfile?.currency || 'GBP';
  const defaultVatRegistered = userProfile?.vatRegistered || false;
  const defaultHourlyRate = userProfile?.defaultHourlyRate || toMinorUnits(15, currency);
  const defaultTargetMargin = userProfile?.defaultTargetMargin || 30;
  const vatRate = CURRENCIES[currency].vatRate;
  const currencySymbol = CURRENCIES[currency].symbol;

  // View Mode
  const [viewMode, setViewMode] = useState<'single' | 'compare'>('single');

  // Product Cost Mode
  const [costMode, setCostMode] = useState<'manual' | 'handmade' | 'sourced'>('manual');

  // Manual Entry
  const [manualCost, setManualCost] = useState<string>('10');

  // Handmade
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [labourHours, setLabourHours] = useState<string>('');
  const [hourlyRate, setHourlyRate] = useState<string>(toMajorUnits(defaultHourlyRate, currency).toString());
  const [packagingCost, setPackagingCost] = useState<string>('');

  // Sourced
  const [supplierCost, setSupplierCost] = useState<string>('');
  const [supplierShipping, setSupplierShipping] = useState<string>('');

  // Sale Configuration
  const [salePrice, setSalePrice] = useState<string>('25');
  const [shippingCost, setShippingCost] = useState<string>('3.50');
  const [freeShipping, setFreeShipping] = useState(false);
  const [quantity, setQuantity] = useState<string>('1');

  // Platform Selection
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformKey>('etsy');

  // Payment Method (new feature)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('platform_included');

  // VAT Override
  const [vatRegistered, setVatRegistered] = useState(defaultVatRegistered);

  // Target Settings
  const [targetMargin, setTargetMargin] = useState<string>(defaultTargetMargin.toString());
  const [roundingMode, setRoundingMode] = useState<RoundingMode>('nearest_99');

  // Fees panel collapsed
  const [feesExpanded, setFeesExpanded] = useState(false);

  // Load product data when linked product is available
  useEffect(() => {
    if (linkedProduct && !hasLoadedProduct) {
      const costInMajor = toMajorUnits(linkedProduct.calculatedCost, currency);
      setManualCost(costInMajor.toFixed(2));
      setCostMode('manual');
      setHasLoadedProduct(true);
      toast.success(`Loaded: ${linkedProduct.name}`, {
        description: `Product cost: ${formatCurrency(linkedProduct.calculatedCost, currency)}`,
      });
    }
  }, [linkedProduct, hasLoadedProduct, currency]);

  // Clear linked product
  const clearLinkedProduct = () => {
    setHasLoadedProduct(false);
    // Clear URL param by navigating without it
    window.history.replaceState(null, '', '/calculator');
  };

  // Calculate product cost based on mode
  const productCost = useMemo(() => {
    switch (costMode) {
      case 'manual':
        return toMinorUnits(parseFloat(manualCost) || 0, currency);

      case 'handmade': {
        const materialsCost = materials.reduce(
          (sum, m) => sum + m.quantity * toMinorUnits(m.unitCost, currency),
          0
        );
        const labourCost = (parseFloat(labourHours) || 0) * toMinorUnits(parseFloat(hourlyRate) || 0, currency);
        const packaging = toMinorUnits(parseFloat(packagingCost) || 0, currency);
        return Math.round(materialsCost + labourCost + packaging);
      }

      case 'sourced': {
        const cost = toMinorUnits(parseFloat(supplierCost) || 0, currency);
        const shipping = toMinorUnits(parseFloat(supplierShipping) || 0, currency);
        return cost + shipping;
      }

      default:
        return 0;
    }
  }, [costMode, manualCost, materials, labourHours, hourlyRate, packagingCost, supplierCost, supplierShipping, currency]);

  // Platform fees
  const platformTemplate = DEFAULT_PLATFORM_TEMPLATES[selectedPlatform];
  const salePriceMinor = toMinorUnits(parseFloat(salePrice) || 0, currency);
  const shippingCostMinor = toMinorUnits(parseFloat(shippingCost) || 0, currency);
  const qty = parseInt(quantity) || 1;

  const { total: platformFees, breakdown: feesBreakdown } = useMemo(() => {
    if (!salePriceMinor) return { total: 0, breakdown: [] };

    const shippingForFees = freeShipping ? shippingCostMinor : 0;
    return calculatePlatformFees({
      itemPrice: salePriceMinor,
      shippingCost: shippingForFees,
      quantity: qty,
      fees: platformTemplate.fees,
    });
  }, [salePriceMinor, shippingCostMinor, freeShipping, qty, platformTemplate.fees]);

  // Calculate payment processing fees
  const { total: paymentFees, breakdown: paymentFeesBreakdown } = useMemo(() => {
    if (!salePriceMinor) return { total: 0, breakdown: [] };
    // Only calculate if not included in platform
    if (platformIncludesPaymentProcessing(selectedPlatform) && paymentMethod === 'platform_included') {
      return { total: 0, breakdown: [] };
    }
    const orderTotal = salePriceMinor + (freeShipping ? 0 : shippingCostMinor);
    return calculatePaymentFees(orderTotal, paymentMethod);
  }, [salePriceMinor, shippingCostMinor, freeShipping, selectedPlatform, paymentMethod]);

  // Total fees (platform + payment)
  const totalFees = platformFees + paymentFees;

  // Calculate profit
  const { profit, margin, receiptsExVat } = useMemo(() => {
    if (!salePriceMinor) return { profit: 0, margin: 0 };

    const revenue = salePriceMinor + (freeShipping ? shippingCostMinor : 0);
    return calculateProfit({
      revenue,
      productCost,
      platformFees: totalFees,
      vatRate,
      isVatRegistered: vatRegistered,
    });
  }, [salePriceMinor, shippingCostMinor, freeShipping, productCost, totalFees, vatRate, vatRegistered]);

  // Calculate profit per hour (for handmade mode)
  const profitPerHour = useMemo(() => {
    if (costMode !== 'handmade' || !labourHours || parseFloat(labourHours) <= 0) return null;
    return profit / parseFloat(labourHours);
  }, [costMode, labourHours, profit]);

  // Apply rounding using proper library
  const applyRounding = (price: number): number => {
    return roundPrice(price, { mode: roundingMode });
  };

  // Calculate break-even price
  const breakEvenPrice = useMemo(() => {
    if (!productCost) return 0;

    const price = calculateBreakEvenPrice({
      productCost,
      shippingCost: shippingCostMinor,
      sellerPaysShipping: freeShipping,
      fees: platformTemplate.fees,
      vatRate,
      isVatRegistered: vatRegistered,
    });

    return applyRounding(price);
  }, [productCost, shippingCostMinor, freeShipping, platformTemplate.fees, vatRate, vatRegistered, roundingMode]);

  // Calculate target price
  const targetPriceValue = useMemo(() => {
    if (!productCost) return 0;

    const price = calculateTargetPrice({
      productCost,
      shippingCost: shippingCostMinor,
      sellerPaysShipping: freeShipping,
      fees: platformTemplate.fees,
      vatRate,
      isVatRegistered: vatRegistered,
      targetMargin: parseFloat(targetMargin) || 0,
    });

    return applyRounding(price);
  }, [productCost, shippingCostMinor, freeShipping, platformTemplate.fees, vatRate, vatRegistered, targetMargin, roundingMode]);

  // Find best platform for compare view
  const bestPlatform = useMemo(() => {
    if (!salePriceMinor || !productCost) return null;

    let best: PlatformKey = 'etsy';
    let bestProfit = -Infinity;

    (['etsy', 'ebay', 'amazon', 'shopify', 'tiktok'] as PlatformKey[]).forEach((platform) => {
      const template = DEFAULT_PLATFORM_TEMPLATES[platform];
      const { total: fees } = calculatePlatformFees({
        itemPrice: salePriceMinor,
        shippingCost: freeShipping ? shippingCostMinor : 0,
        quantity: 1,
        fees: template.fees,
      });
      const revenue = salePriceMinor + (freeShipping ? shippingCostMinor : 0);
      const { profit } = calculateProfit({
        revenue,
        productCost,
        platformFees: fees,
        vatRate,
        isVatRegistered: vatRegistered,
      });

      if (profit > bestProfit) {
        bestProfit = profit;
        best = platform;
      }
    });

    return best;
  }, [salePriceMinor, productCost, shippingCostMinor, freeShipping, vatRate, vatRegistered]);

  // Discount Analysis (new feature)
  const discountAnalysis = useMemo(() => {
    if (!salePriceMinor || !productCost) return null;

    const feeCalculator = (price: number) => {
      const { total } = calculatePlatformFees({
        itemPrice: price,
        shippingCost: freeShipping ? shippingCostMinor : 0,
        quantity: 1,
        fees: platformTemplate.fees,
      });
      // Add payment fees
      const paymentFee = platformIncludesPaymentProcessing(selectedPlatform) && paymentMethod === 'platform_included'
        ? 0
        : calculatePaymentFees(price, paymentMethod).total;
      return total + paymentFee;
    };

    return calculateDiscountAnalysis({
      salePrice: salePriceMinor,
      productCost,
      shippingCost: shippingCostMinor,
      sellerPaysShipping: freeShipping,
      feeCalculator,
      vatRate,
      isVatRegistered: vatRegistered,
    });
  }, [salePriceMinor, productCost, shippingCostMinor, freeShipping, platformTemplate.fees, selectedPlatform, paymentMethod, vatRate, vatRegistered]);

  // Batch Pricing (new feature)
  const batchPricing = useMemo(() => {
    if (!salePriceMinor || !productCost) return null;

    const feeCalculator = (price: number, qty: number) => {
      const { total } = calculatePlatformFees({
        itemPrice: price,
        shippingCost: freeShipping ? shippingCostMinor : 0,
        quantity: qty,
        fees: platformTemplate.fees,
      });
      return total;
    };

    return calculateBatchPricing({
      baseUnitCost: productCost,
      fixedCosts: 0, // No fixed costs for now
      salePrice: salePriceMinor,
      feeCalculator,
      vatRate,
      isVatRegistered: vatRegistered,
    });
  }, [salePriceMinor, productCost, shippingCostMinor, freeShipping, platformTemplate.fees, vatRate, vatRegistered]);

  // Scenario Analysis params (new feature)
  const scenarioParams: ScenarioParams | null = useMemo(() => {
    if (!salePriceMinor || !productCost) return null;

    // Calculate base costs by mode
    let materialCost = 0;
    let labourCost = 0;
    let shippingCostValue = freeShipping ? shippingCostMinor : 0;

    if (costMode === 'handmade') {
      materialCost = materials.reduce(
        (sum, m) => sum + m.quantity * toMinorUnits(m.unitCost, currency),
        0
      );
      labourCost = (parseFloat(labourHours) || 0) * toMinorUnits(parseFloat(hourlyRate) || 0, currency);
    } else if (costMode === 'sourced') {
      materialCost = toMinorUnits(parseFloat(supplierCost) || 0, currency);
      shippingCostValue += toMinorUnits(parseFloat(supplierShipping) || 0, currency);
    } else {
      materialCost = productCost;
    }

    return {
      baseMaterialCost: materialCost,
      baseLabourCost: labourCost,
      baseShippingCost: shippingCostValue,
      baseSalePrice: salePriceMinor,
      platformFees: totalFees,
      vatRate,
      isVatRegistered: vatRegistered,
      baseProfit: profit,
      baseMargin: margin,
    };
  }, [salePriceMinor, productCost, costMode, materials, labourHours, hourlyRate, supplierCost, supplierShipping, freeShipping, shippingCostMinor, totalFees, vatRate, vatRegistered, profit, margin, currency]);

  // Material management
  const addMaterial = () => {
    setMaterials([
      ...materials,
      { id: Date.now().toString(), name: '', quantity: 1, unitCost: 0 },
    ]);
  };

  const updateMaterial = (id: string, field: keyof MaterialItem, value: string | number) => {
    setMaterials(materials.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const removeMaterial = (id: string) => {
    setMaterials(materials.filter((m) => m.id !== id));
  };

  // Status indicators
  const isProfit = profit > 0;
  const isBreakEven = Math.abs(profit) < 100;
  const isLoss = profit < 0;

  const selectedColors = PLATFORM_COLORS[selectedPlatform];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-2xl">
        {/* Decorative elements */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-emerald-500/20 to-transparent blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-gradient-to-tr from-blue-500/20 to-transparent blur-3xl" />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <SparklesIcon />
              <span className="text-sm font-medium text-emerald-400">Pro Calculator</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Profit Calculator
            </h1>
            <p className="mt-2 text-slate-300">
              Calculate your profit, fees, and find your perfect price point
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant={viewMode === 'compare' ? 'default' : 'outline'}
              onClick={() => setViewMode(viewMode === 'single' ? 'compare' : 'single')}
              className={`gap-2 ${viewMode === 'compare' ? 'bg-white text-slate-900 hover:bg-slate-100' : 'border-slate-600 bg-transparent text-white hover:bg-slate-700'}`}
            >
              <CompareIcon />
              {viewMode === 'compare' ? 'Single View' : 'Compare All'}
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        {salePriceMinor > 0 && (
          <div className="relative mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-xs text-slate-400">Product Cost</p>
              <p className="mt-1 text-xl font-bold">{formatCurrency(productCost, currency)}</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-xs text-slate-400">Sale Price</p>
              <p className="mt-1 text-xl font-bold">{formatCurrency(salePriceMinor, currency)}</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-xs text-slate-400">Platform Fees</p>
              <p className="mt-1 text-xl font-bold text-orange-400">{formatCurrency(platformFees, currency)}</p>
            </div>
            <div className={`rounded-xl p-4 backdrop-blur-sm ${isProfit ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
              <p className="text-xs text-slate-400">Your Profit</p>
              <p className={`mt-1 text-xl font-bold ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
                {formatCurrency(profit, currency)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Platform Comparison View */}
      {viewMode === 'compare' && salePriceMinor > 0 && productCost > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {(['etsy', 'ebay', 'amazon', 'shopify', 'tiktok'] as PlatformKey[]).map((platform) => (
            <PlatformComparisonCard
              key={platform}
              platform={platform}
              productCost={productCost}
              salePrice={salePriceMinor}
              shippingCost={shippingCostMinor}
              freeShipping={freeShipping}
              vatRegistered={vatRegistered}
              vatRate={vatRate}
              currency={currency}
              isSelected={platform === selectedPlatform}
              isBest={platform === bestPlatform}
              onSelect={() => setSelectedPlatform(platform)}
            />
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Inputs */}
        <div className="space-y-6 lg:col-span-2">
          {/* Product Cost Section */}
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className={`h-1 bg-gradient-to-r ${selectedColors.gradient}`} />
            <CardHeader className="bg-gradient-to-b from-muted/50 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <div className={`rounded-lg p-1.5 ${selectedColors.bg}`}>
                  <svg className={`h-5 w-5 ${selectedColors.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                Product Cost
              </CardTitle>
              <CardDescription>How much does it cost you to make or source this product?</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Linked Product Badge */}
              {linkedProduct && hasLoadedProduct && (
                <div className="mb-4 flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 p-3">
                  <div className="flex items-center gap-2">
                    <div className="rounded-md bg-primary/10 p-1.5">
                      <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{linkedProduct.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Cost: {formatCurrency(linkedProduct.calculatedCost, currency)} (from product)
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearLinkedProduct}
                    className="h-8 w-8 p-0"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                </div>
              )}

              <Tabs value={costMode} onValueChange={(v) => setCostMode(v as typeof costMode)}>
                <TabsList className="grid w-full grid-cols-3 bg-muted/50">
                  <TabsTrigger value="manual" className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800">
                    Manual
                  </TabsTrigger>
                  <TabsTrigger value="handmade" className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800">
                    Handmade
                  </TabsTrigger>
                  <TabsTrigger value="sourced" className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800">
                    Sourced
                  </TabsTrigger>
                </TabsList>

                {/* Manual Entry */}
                <TabsContent value="manual" className="space-y-4 pt-4">
                  <div className="relative">
                    <Label htmlFor="manual-cost" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Product Cost
                    </Label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">
                        {currencySymbol}
                      </span>
                      <Input
                        id="manual-cost"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={manualCost}
                        onChange={(e) => setManualCost(e.target.value)}
                        className="h-12 pl-8 text-lg font-medium"
                      />
                    </div>
                  </div>
                  <div className={`rounded-xl p-4 ${selectedColors.bg}`}>
                    <p className="text-sm text-muted-foreground">Total Cost</p>
                    <p className={`text-2xl font-bold ${selectedColors.text}`}>{formatCurrency(productCost, currency)}</p>
                  </div>
                </TabsContent>

                {/* Handmade */}
                <TabsContent value="handmade" className="space-y-4 pt-4">
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Materials</Label>
                      <Button variant="outline" size="sm" onClick={addMaterial} className="gap-1 text-xs">
                        <PlusIcon />
                        Add Material
                      </Button>
                    </div>
                    {materials.length === 0 ? (
                      <div className="rounded-xl border-2 border-dashed border-muted p-6 text-center">
                        <p className="text-sm text-muted-foreground">No materials added yet</p>
                        <p className="mt-1 text-xs text-muted-foreground">Click &quot;Add Material&quot; to start tracking costs</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {materials.map((material) => (
                          <div key={material.id} className="flex gap-2 rounded-lg bg-muted/50 p-2">
                            <Input
                              placeholder="Material name"
                              value={material.name}
                              onChange={(e) => updateMaterial(material.id, 'name', e.target.value)}
                              className="flex-1 border-0 bg-white dark:bg-slate-800"
                            />
                            <Input
                              type="number"
                              step="0.1"
                              min="0"
                              placeholder="Qty"
                              value={material.quantity}
                              onChange={(e) => updateMaterial(material.id, 'quantity', parseFloat(e.target.value) || 0)}
                              className="w-20 border-0 bg-white dark:bg-slate-800"
                            />
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="Cost"
                              value={material.unitCost}
                              onChange={(e) => updateMaterial(material.id, 'unitCost', parseFloat(e.target.value) || 0)}
                              className="w-24 border-0 bg-white dark:bg-slate-800"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeMaterial(material.id)}
                              className="text-muted-foreground hover:text-red-500"
                            >
                              <TrashIcon />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="labour-hours" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Labour Hours
                      </Label>
                      <Input
                        id="labour-hours"
                        type="number"
                        step="0.25"
                        min="0"
                        placeholder="0"
                        value={labourHours}
                        onChange={(e) => setLabourHours(e.target.value)}
                        className="mt-1 h-11"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hourly-rate" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Hourly Rate ({currencySymbol})
                      </Label>
                      <Input
                        id="hourly-rate"
                        type="number"
                        step="0.50"
                        min="0"
                        placeholder="15.00"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        className="mt-1 h-11"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="packaging-cost" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Packaging Cost ({currencySymbol})
                    </Label>
                    <Input
                      id="packaging-cost"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={packagingCost}
                      onChange={(e) => setPackagingCost(e.target.value)}
                      className="mt-1 h-11"
                    />
                  </div>

                  <Separator className="my-4" />

                  <div className={`space-y-3 rounded-xl p-4 ${selectedColors.bg}`}>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Materials</span>
                      <span className="font-medium">
                        {formatCurrency(
                          materials.reduce((sum, m) => sum + m.quantity * toMinorUnits(m.unitCost, currency), 0),
                          currency
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Labour</span>
                      <span className="font-medium">
                        {formatCurrency(
                          (parseFloat(labourHours) || 0) * toMinorUnits(parseFloat(hourlyRate) || 0, currency),
                          currency
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Packaging</span>
                      <span className="font-medium">
                        {formatCurrency(toMinorUnits(parseFloat(packagingCost) || 0, currency), currency)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-semibold">Total Cost</span>
                      <span className={`text-xl font-bold ${selectedColors.text}`}>{formatCurrency(productCost, currency)}</span>
                    </div>
                  </div>
                </TabsContent>

                {/* Sourced */}
                <TabsContent value="sourced" className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="supplier-cost" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Supplier Cost ({currencySymbol})
                    </Label>
                    <Input
                      id="supplier-cost"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={supplierCost}
                      onChange={(e) => setSupplierCost(e.target.value)}
                      className="mt-1 h-11"
                    />
                  </div>
                  <div>
                    <Label htmlFor="supplier-shipping" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Supplier Shipping ({currencySymbol})
                    </Label>
                    <Input
                      id="supplier-shipping"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={supplierShipping}
                      onChange={(e) => setSupplierShipping(e.target.value)}
                      className="mt-1 h-11"
                    />
                  </div>
                  <div className={`rounded-xl p-4 ${selectedColors.bg}`}>
                    <p className="text-sm text-muted-foreground">Total Cost</p>
                    <p className={`text-2xl font-bold ${selectedColors.text}`}>{formatCurrency(productCost, currency)}</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Sale Configuration */}
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
            <CardHeader className="bg-gradient-to-b from-muted/50 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <div className="rounded-lg bg-blue-500/10 p-1.5">
                  <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Sale Configuration
              </CardTitle>
              <CardDescription>Set your sale price and shipping details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="sale-price" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Sale Price
                  </Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">
                      {currencySymbol}
                    </span>
                    <Input
                      id="sale-price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={salePrice}
                      onChange={(e) => setSalePrice(e.target.value)}
                      className="h-12 pl-8 text-lg font-medium"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="shipping-cost" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Shipping Cost
                  </Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">
                      {currencySymbol}
                    </span>
                    <Input
                      id="shipping-cost"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={shippingCost}
                      onChange={(e) => setShippingCost(e.target.value)}
                      className="h-12 pl-8 text-lg font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-muted/50 to-transparent p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="free-shipping" className="text-sm font-medium">Free Shipping</Label>
                  <p className="text-xs text-muted-foreground">You pay shipping (adds to your costs)</p>
                </div>
                <Switch
                  id="free-shipping"
                  checked={freeShipping}
                  onCheckedChange={setFreeShipping}
                />
              </div>

              <div>
                <Label htmlFor="quantity" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Quantity
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="mt-1 h-11"
                />
              </div>
            </CardContent>
          </Card>

          {/* Platform Selection */}
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className={`h-1 bg-gradient-to-r ${selectedColors.gradient}`} />
            <CardHeader className="bg-gradient-to-b from-muted/50 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <div className={`rounded-lg p-1.5 ${selectedColors.bg}`}>
                  {(() => {
                    const Logo = PLATFORM_LOGOS[selectedPlatform];
                    return <div className={selectedColors.text}><Logo /></div>;
                  })()}
                </div>
                Platform & Settings
              </CardTitle>
              <CardDescription>Choose your selling platform and VAT settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="platform" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Platform
                </Label>
                <Select value={selectedPlatform} onValueChange={(v) => setSelectedPlatform(v as PlatformKey)}>
                  <SelectTrigger id="platform" className="mt-1 h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(['etsy', 'ebay', 'amazon', 'shopify', 'tiktok'] as PlatformKey[]).map((platform) => {
                      const Logo = PLATFORM_LOGOS[platform];
                      const colors = PLATFORM_COLORS[platform];
                      return (
                        <SelectItem key={platform} value={platform}>
                          <div className="flex items-center gap-2">
                            <div className={colors.text}><Logo /></div>
                            {PLATFORM_LABELS[platform]}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {platformTemplate.fees.length > 0 && (
                <div className={`rounded-xl border p-4 ${selectedColors.bg} ${selectedColors.border}`}>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Platform Fees</p>
                  <ul className="space-y-1.5 text-sm">
                    {platformTemplate.fees.map((fee, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className={`h-1.5 w-1.5 rounded-full ${selectedColors.text} bg-current`} />
                        <span>
                          {fee.label}:{' '}
                          <span className="font-medium">
                            {fee.type === 'percentage'
                              ? `${fee.value}% of ${fee.base}`
                              : formatCurrency(fee.value, currency)}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Payment Method Selector */}
              <PaymentMethodSelector
                value={paymentMethod}
                onChange={setPaymentMethod}
                platform={selectedPlatform}
                currency={currency}
                orderTotal={salePriceMinor + (freeShipping ? 0 : shippingCostMinor)}
              />

              {vatRate > 0 && (
                <div className="rounded-xl bg-gradient-to-r from-muted/50 to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">VAT Status</p>
                      <p className="text-xs text-muted-foreground">
                        {vatRegistered ? `Registered (${vatRate}% VAT)` : 'Not VAT registered'}
                      </p>
                    </div>
                    <Badge variant={vatRegistered ? 'default' : 'secondary'}>
                      {vatRegistered ? 'VAT Registered' : 'Not Registered'}
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Change in <a href="/settings" className="text-primary underline">Settings</a>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Results */}
        <div className="space-y-6">
          {/* Main Results Panel */}
          <Card className={`overflow-hidden border-0 shadow-xl ${
            isLoss
              ? 'bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/50 dark:to-red-900/20'
              : isProfit
                ? 'bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/50 dark:to-emerald-900/20'
                : 'bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/50 dark:to-amber-900/20'
          }`}>
            <div className={`h-1 ${isLoss ? 'bg-red-500' : isProfit ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {isLoss ? <TrendingDownIcon /> : <TrendingUpIcon />}
                  Results
                </CardTitle>
                {salePriceMinor > 0 && (
                  <Badge
                    className={`gap-1 ${
                      isLoss
                        ? 'bg-red-500 hover:bg-red-600'
                        : isProfit
                          ? 'bg-emerald-500 hover:bg-emerald-600'
                          : 'bg-amber-500 hover:bg-amber-600'
                    } text-white`}
                  >
                    {isLoss ? 'Loss' : isBreakEven ? 'Break-even' : 'Profitable'}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* HERO: Profit Display with Gauge */}
              <div className="flex flex-col items-center gap-4">
                <CircularGauge value={margin} />
                <div className="text-center">
                  <p className={`text-4xl font-bold tabular-nums ${
                    isProfit ? 'text-emerald-500' : isLoss ? 'text-red-500' : 'text-amber-500'
                  }`}>
                    {formatCurrency(profit, currency)}
                  </p>
                  <p className="text-sm text-muted-foreground">profit per sale</p>
                </div>
              </div>

              {/* Profit Per Hour (Handmade mode) */}
              {profitPerHour !== null && (
                <div className={`rounded-xl p-4 ${
                  profitPerHour < toMinorUnits(10, currency)
                    ? 'bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800'
                    : 'bg-muted/50'
                }`}>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Profit Per Hour</p>
                  <p className={`mt-1 text-2xl font-bold ${
                    profitPerHour < toMinorUnits(10, currency) ? 'text-red-600 dark:text-red-400' : ''
                  }`}>
                    {formatCurrency(profitPerHour, currency)}/hr
                  </p>
                  {profitPerHour < toMinorUnits(10, currency) && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">Below UK minimum wage!</p>
                  )}
                </div>
              )}

              {/* Warning Messages */}
              {isLoss && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/50">
                  <div className="rounded-full bg-red-500 p-1">
                    <TrendingDownIcon />
                  </div>
                  <div>
                    <p className="font-semibold text-red-800 dark:text-red-200">You&apos;re losing money!</p>
                    <p className="mt-0.5 text-sm text-red-700 dark:text-red-300">
                      Raise price to at least <span className="font-bold">{formatCurrency(breakEvenPrice, currency)}</span> to break even.
                    </p>
                  </div>
                </div>
              )}

              <Separator />

              {/* Collapsible Fees Breakdown */}
              <div>
                <button
                  onClick={() => setFeesExpanded(!feesExpanded)}
                  className="flex w-full items-center justify-between rounded-lg p-2 text-sm font-semibold transition-colors hover:bg-muted/50"
                >
                  <span>Total Fees</span>
                  <div className="flex items-center gap-2">
                    <span className="text-orange-500">{formatCurrency(totalFees, currency)}</span>
                    <ChevronDownIcon />
                  </div>
                </button>
                {feesExpanded && (feesBreakdown.length > 0 || paymentFeesBreakdown.length > 0) && (
                  <div className="mt-2 space-y-2 rounded-lg bg-muted/50 p-3">
                    {feesBreakdown.map((fee, index) => (
                      <div key={`platform-${index}`} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{fee.label}</span>
                        <span className="font-medium">{formatCurrency(fee.amount, currency)}</span>
                      </div>
                    ))}
                    {paymentFeesBreakdown.map((fee, index) => (
                      <div key={`payment-${index}`} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{fee.label}</span>
                        <span className="font-medium">{formatCurrency(fee.amount, currency)}</span>
                      </div>
                    ))}
                  </div>
                )}
                {salePriceMinor > 0 && (
                  <p className="mt-1 px-2 text-xs text-muted-foreground">
                    {((totalFees / salePriceMinor) * 100).toFixed(1)}% of sale price
                  </p>
                )}
              </div>

              {/* VAT Info */}
              {receiptsExVat !== undefined && vatRegistered && (
                <div className="rounded-lg bg-muted/50 p-3 text-sm">
                  <span className="text-muted-foreground">Receipts (ex-VAT):</span>{' '}
                  <span className="font-semibold">{formatCurrency(receiptsExVat, currency)}</span>
                </div>
              )}

              <Separator />

              {/* Discount Analysis */}
              {discountAnalysis && (
                <DiscountAnalysisTable
                  results={discountAnalysis.results}
                  breakEvenDiscount={discountAnalysis.breakEvenDiscount}
                  maxProfitableDiscount={discountAnalysis.maxProfitableDiscount}
                  currency={currency}
                  onApplyPrice={(price) => setSalePrice(toMajorUnits(price, currency).toFixed(2))}
                />
              )}

              {/* Batch Pricing */}
              {batchPricing && (
                <BatchPricingTable
                  tiers={batchPricing}
                  currency={currency}
                />
              )}

              {/* Scenario Analysis */}
              {scenarioParams && (
                <ScenarioSliders
                  params={scenarioParams}
                  currency={currency}
                  onApplyPrice={(price) => setSalePrice(toMajorUnits(price, currency).toFixed(2))}
                />
              )}
            </CardContent>
          </Card>

          {/* Pricing Recommendations */}
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className="h-1 bg-gradient-to-r from-violet-500 to-purple-500" />
            <CardHeader className="bg-gradient-to-b from-muted/50 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <div className="rounded-lg bg-violet-500/10 p-1.5">
                  <SparklesIcon />
                </div>
                Pricing Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="target-margin" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Target Margin (%)
                </Label>
                <Input
                  id="target-margin"
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={targetMargin}
                  onChange={(e) => setTargetMargin(e.target.value)}
                  className="mt-1 h-11"
                />
              </div>

              <div>
                <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Rounding</Label>
                <RadioGroup value={roundingMode} onValueChange={(v) => setRoundingMode(v as RoundingMode)} className="mt-2 grid grid-cols-2 gap-2">
                  <Label
                    htmlFor="round-99"
                    className={`flex cursor-pointer items-center justify-center rounded-lg border p-3 text-sm transition-colors ${
                      roundingMode === 'nearest_99' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                  >
                    <RadioGroupItem value="nearest_99" id="round-99" className="sr-only" />
                    .99
                  </Label>
                  <Label
                    htmlFor="round-50"
                    className={`flex cursor-pointer items-center justify-center rounded-lg border p-3 text-sm transition-colors ${
                      roundingMode === 'nearest_50' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                  >
                    <RadioGroupItem value="nearest_50" id="round-50" className="sr-only" />
                    .50
                  </Label>
                  <Label
                    htmlFor="round-00"
                    className={`flex cursor-pointer items-center justify-center rounded-lg border p-3 text-sm transition-colors ${
                      roundingMode === 'nearest_00' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                  >
                    <RadioGroupItem value="nearest_00" id="round-00" className="sr-only" />
                    .00
                  </Label>
                  <Label
                    htmlFor="round-none"
                    className={`flex cursor-pointer items-center justify-center rounded-lg border p-3 text-sm transition-colors ${
                      roundingMode === 'none' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                  >
                    <RadioGroupItem value="none" id="round-none" className="sr-only" />
                    Exact
                  </Label>
                </RadioGroup>
              </div>

              <Separator />

              {productCost > 0 && (
                <div className="space-y-3">
                  <div className="group rounded-xl border-2 border-muted bg-muted/30 p-4 transition-colors hover:border-muted-foreground/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Break-even Price</p>
                        <p className="mt-1 text-2xl font-bold">{formatCurrency(breakEvenPrice, currency)}</p>
                        <p className="text-xs text-muted-foreground">Minimum to cover costs + fees</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSalePrice(toMajorUnits(breakEvenPrice, currency).toFixed(2))}
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>

                  <div className="group rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-4 transition-colors dark:border-emerald-800 dark:from-emerald-950/50 dark:to-emerald-900/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-400">Target Price</p>
                        <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(targetPriceValue, currency)}</p>
                        <p className="text-xs text-muted-foreground">
                          For {targetMargin}% profit margin
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => setSalePrice(toMajorUnits(targetPriceValue, currency).toFixed(2))}
                        className="bg-emerald-500 opacity-0 transition-opacity hover:bg-emerald-600 group-hover:opacity-100"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Loading fallback for Suspense
function CalculatorLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-muted rounded" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-64 bg-muted rounded-lg" />
          <div className="h-48 bg-muted rounded-lg" />
        </div>
        <div className="h-96 bg-muted rounded-lg" />
      </div>
    </div>
  );
}

// Export with Suspense wrapper for useSearchParams
export default function CalculatorPage() {
  return (
    <Suspense fallback={<CalculatorLoading />}>
      <CalculatorContent />
    </Suspense>
  );
}
