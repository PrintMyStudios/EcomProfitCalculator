'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SellerType, Currency, PlatformKey } from '@/types';

interface SettingsState {
  // User preferences (synced from Firebase when logged in)
  sellerTypes: SellerType[]; // Multi-select: what types of selling do you do?
  country: string;
  currency: Currency;
  vatRegistered: boolean;
  defaultHourlyRate: number; // minor units
  defaultTargetMargin: number; // percentage
  primaryPlatform: PlatformKey;

  // Feature visibility (derived from sellerTypes but can be toggled)
  showMaterialsLibrary: boolean;
  showSuppliers: boolean;
  showTimeTracking: boolean;

  // UI preferences (local only)
  theme: 'light' | 'dark' | 'system';
  onboardingCompleted: boolean;

  // Actions
  setSellerTypes: (types: SellerType[]) => void;
  setCountry: (country: string) => void;
  setCurrency: (currency: Currency) => void;
  setVatRegistered: (vatRegistered: boolean) => void;
  setDefaultHourlyRate: (rate: number) => void;
  setDefaultTargetMargin: (margin: number) => void;
  setPrimaryPlatform: (platform: PlatformKey) => void;
  setFeatureVisibility: (feature: 'materials' | 'suppliers' | 'timeTracking', visible: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setOnboardingCompleted: (completed: boolean) => void;
  resetSettings: () => void;
}

const initialState = {
  sellerTypes: [] as SellerType[],
  country: 'GB',
  currency: 'GBP' as Currency,
  vatRegistered: false,
  defaultHourlyRate: 1500, // £15.00
  defaultTargetMargin: 30, // 30%
  primaryPlatform: 'etsy' as PlatformKey,
  showMaterialsLibrary: true,
  showSuppliers: true,
  showTimeTracking: true,
  theme: 'system' as const,
  onboardingCompleted: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...initialState,

      setSellerTypes: (types) => {
        // Auto-configure feature visibility based on seller types
        const hasHandmade = types.includes('handmade');
        const hasSourced = types.includes('dropship') || types.includes('print_on_demand') || types.includes('resale');
        set({
          sellerTypes: types,
          showMaterialsLibrary: hasHandmade,
          showSuppliers: hasSourced,
          showTimeTracking: hasHandmade,
        });
      },
      setCountry: (country) => set({ country }),
      setCurrency: (currency) => set({ currency }),
      setVatRegistered: (vatRegistered) => set({ vatRegistered }),
      setDefaultHourlyRate: (rate) => set({ defaultHourlyRate: rate }),
      setDefaultTargetMargin: (margin) => set({ defaultTargetMargin: margin }),
      setPrimaryPlatform: (platform) => set({ primaryPlatform: platform }),
      setFeatureVisibility: (feature, visible) => {
        switch (feature) {
          case 'materials':
            set({ showMaterialsLibrary: visible });
            break;
          case 'suppliers':
            set({ showSuppliers: visible });
            break;
          case 'timeTracking':
            set({ showTimeTracking: visible });
            break;
        }
      },
      setTheme: (theme) => set({ theme }),
      setOnboardingCompleted: (completed) => set({ onboardingCompleted: completed }),
      resetSettings: () => set(initialState),
    }),
    {
      name: 'ecom-settings',
    }
  )
);
