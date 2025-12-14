'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserMode, Currency, PlatformKey } from '@/types';

interface SettingsState {
  // User preferences (synced from Firebase when logged in)
  mode: UserMode;
  country: string;
  currency: Currency;
  vatRegistered: boolean;
  defaultHourlyRate: number; // minor units
  defaultTargetMargin: number; // percentage
  primaryPlatform: PlatformKey;

  // UI preferences (local only)
  theme: 'light' | 'dark' | 'system';
  onboardingCompleted: boolean;

  // Actions
  setMode: (mode: UserMode) => void;
  setCountry: (country: string) => void;
  setCurrency: (currency: Currency) => void;
  setVatRegistered: (vatRegistered: boolean) => void;
  setDefaultHourlyRate: (rate: number) => void;
  setDefaultTargetMargin: (margin: number) => void;
  setPrimaryPlatform: (platform: PlatformKey) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setOnboardingCompleted: (completed: boolean) => void;
  resetSettings: () => void;
}

const initialState = {
  mode: 'maker' as UserMode,
  country: 'GB',
  currency: 'GBP' as Currency,
  vatRegistered: false,
  defaultHourlyRate: 1500, // £15.00
  defaultTargetMargin: 30, // 30%
  primaryPlatform: 'etsy' as PlatformKey,
  theme: 'system' as const,
  onboardingCompleted: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...initialState,

      setMode: (mode) => set({ mode }),
      setCountry: (country) => set({ country }),
      setCurrency: (currency) => set({ currency }),
      setVatRegistered: (vatRegistered) => set({ vatRegistered }),
      setDefaultHourlyRate: (rate) => set({ defaultHourlyRate: rate }),
      setDefaultTargetMargin: (margin) => set({ defaultTargetMargin: margin }),
      setPrimaryPlatform: (platform) => set({ primaryPlatform: platform }),
      setTheme: (theme) => set({ theme }),
      setOnboardingCompleted: (completed) => set({ onboardingCompleted: completed }),
      resetSettings: () => set(initialState),
    }),
    {
      name: 'ecom-settings',
    }
  )
);
