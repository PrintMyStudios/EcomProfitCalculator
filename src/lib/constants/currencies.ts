import type { Currency } from '@/types';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  name: string;
  locale: string;
  decimalPlaces: number;
  vatRate: number; // standard rate as percentage
  vatThreshold: number; // registration threshold in minor units
}

export const CURRENCIES: Record<Currency, CurrencyConfig> = {
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    locale: 'en-GB',
    decimalPlaces: 2,
    vatRate: 20,
    vatThreshold: 9000000, // £90,000
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    locale: 'en-US',
    decimalPlaces: 2,
    vatRate: 0, // No federal VAT/GST
    vatThreshold: 0,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    locale: 'de-DE',
    decimalPlaces: 2,
    vatRate: 19, // Germany default, varies by country
    vatThreshold: 2200000, // €22,000 (Germany)
  },
  CAD: {
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar',
    locale: 'en-CA',
    decimalPlaces: 2,
    vatRate: 5, // GST
    vatThreshold: 3000000, // $30,000
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    locale: 'en-AU',
    decimalPlaces: 2,
    vatRate: 10, // GST
    vatThreshold: 7500000, // $75,000
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    locale: 'ja-JP',
    decimalPlaces: 0, // No decimal places for Yen
    vatRate: 10, // Consumption tax
    vatThreshold: 100000000, // ¥10,000,000
  },
  CHF: {
    code: 'CHF',
    symbol: 'CHF',
    name: 'Swiss Franc',
    locale: 'de-CH',
    decimalPlaces: 2,
    vatRate: 8.1,
    vatThreshold: 10000000, // CHF 100,000
  },
  SEK: {
    code: 'SEK',
    symbol: 'kr',
    name: 'Swedish Krona',
    locale: 'sv-SE',
    decimalPlaces: 2,
    vatRate: 25,
    vatThreshold: 8000000, // SEK 80,000
  },
  NOK: {
    code: 'NOK',
    symbol: 'kr',
    name: 'Norwegian Krone',
    locale: 'nb-NO',
    decimalPlaces: 2,
    vatRate: 25,
    vatThreshold: 5000000, // NOK 50,000
  },
  DKK: {
    code: 'DKK',
    symbol: 'kr',
    name: 'Danish Krone',
    locale: 'da-DK',
    decimalPlaces: 2,
    vatRate: 25,
    vatThreshold: 5000000, // DKK 50,000
  },
};

/**
 * Format a value in minor units to a display string
 */
export function formatCurrency(minorUnits: number, currency: Currency): string {
  const config = CURRENCIES[currency];
  const majorUnits = minorUnits / Math.pow(10, config.decimalPlaces);

  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.code,
    minimumFractionDigits: config.decimalPlaces,
    maximumFractionDigits: config.decimalPlaces,
  }).format(majorUnits);
}

/**
 * Convert major units (e.g., pounds) to minor units (e.g., pence)
 */
export function toMinorUnits(majorUnits: number, currency: Currency): number {
  const config = CURRENCIES[currency];
  return Math.round(majorUnits * Math.pow(10, config.decimalPlaces));
}

/**
 * Convert minor units to major units
 */
export function toMajorUnits(minorUnits: number, currency: Currency): number {
  const config = CURRENCIES[currency];
  return minorUnits / Math.pow(10, config.decimalPlaces);
}
