'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import {
  subscribeSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  toggleSupplierFavourite,
  type CreateSupplierInput,
} from '@/lib/firebase/suppliers';
import type { Supplier, SupplierType, SupplierPlatform } from '@/types';
import { isMaterialsSupplier, isProductsSupplier } from '@/types';

// Demo mode storage key
const DEMO_SUPPLIERS_KEY = 'demo_suppliers';

// Load demo suppliers from localStorage
function loadDemoSuppliers(): Supplier[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(DEMO_SUPPLIERS_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    // Convert date strings back to Date objects
    return parsed.map((s: Supplier) => ({
      ...s,
      createdAt: new Date(s.createdAt),
      updatedAt: new Date(s.updatedAt),
    }));
  } catch {
    return [];
  }
}

// Save demo suppliers to localStorage
function saveDemoSuppliers(suppliers: Supplier[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DEMO_SUPPLIERS_KEY, JSON.stringify(suppliers));
  } catch {
    // Ignore storage errors
  }
}

export function useSuppliers() {
  const { user } = useAuth();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Subscribe to real-time updates or load demo data
  useEffect(() => {
    if (user) {
      // Authenticated - use Firebase
      setIsDemoMode(false);
      setLoading(true);
      setError(null);

      const unsubscribe = subscribeSuppliers(
        user.uid,
        (data) => {
          setSuppliers(data);
          setLoading(false);
        },
        (err) => {
          setError(err);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } else {
      // No user - use demo mode with localStorage
      setIsDemoMode(true);
      const demoSuppliers = loadDemoSuppliers();
      setSuppliers(demoSuppliers);
      setLoading(false);
    }
  }, [user]);

  // Add a new supplier
  const addSupplier = useCallback(
    async (data: CreateSupplierInput): Promise<string> => {
      if (user) {
        return createSupplier(user.uid, data);
      }

      // Demo mode - create locally
      const now = new Date();
      const newSupplier: Supplier = {
        id: `demo_${Date.now()}`,
        userId: 'demo_user',
        name: data.name,
        supplierType: data.supplierType,
        currency: data.currency,
        website: data.website,
        notes: data.notes,
        contact: data.contact,
        materialsFields: data.materialsFields,
        productsFields: data.productsFields,
        isFavourite: false,
        usageCount: 0,
        createdAt: now,
        updatedAt: now,
      };

      const updated = [...suppliers, newSupplier];
      setSuppliers(updated);
      saveDemoSuppliers(updated);
      return newSupplier.id;
    },
    [user, suppliers]
  );

  // Edit an existing supplier
  const editSupplier = useCallback(
    async (id: string, data: Partial<CreateSupplierInput>): Promise<void> => {
      if (user) {
        return updateSupplier(user.uid, id, data);
      }

      // Demo mode - update locally
      const updated = suppliers.map((s) =>
        s.id === id ? { ...s, ...data, updatedAt: new Date() } : s
      );
      setSuppliers(updated);
      saveDemoSuppliers(updated);
    },
    [user, suppliers]
  );

  // Remove a supplier
  const removeSupplier = useCallback(
    async (id: string): Promise<void> => {
      if (user) {
        return deleteSupplier(user.uid, id);
      }

      // Demo mode - remove locally
      const updated = suppliers.filter((s) => s.id !== id);
      setSuppliers(updated);
      saveDemoSuppliers(updated);
    },
    [user, suppliers]
  );

  // Toggle favourite status
  const toggleFavourite = useCallback(
    async (id: string, isFavourite: boolean): Promise<void> => {
      if (user) {
        return toggleSupplierFavourite(user.uid, id, isFavourite);
      }

      // Demo mode - update locally
      const updated = suppliers.map((s) =>
        s.id === id ? { ...s, isFavourite, updatedAt: new Date() } : s
      );
      setSuppliers(updated);
      saveDemoSuppliers(updated);
    },
    [user, suppliers]
  );

  // Get a supplier by ID
  const getSupplierById = useCallback(
    (id: string): Supplier | undefined => {
      return suppliers.find((s) => s.id === id);
    },
    [suppliers]
  );

  // Filter by supplier type
  const getSuppliersByType = useCallback(
    (type: SupplierType): Supplier[] => {
      return suppliers.filter(
        (s) => s.supplierType === type || s.supplierType === 'both'
      );
    },
    [suppliers]
  );

  // Get materials suppliers (for linking to materials)
  const materialsSuppliers = useMemo(
    () => suppliers.filter(isMaterialsSupplier),
    [suppliers]
  );

  // Get products suppliers (for dropship/POD/resale)
  const productsSuppliers = useMemo(
    () => suppliers.filter(isProductsSupplier),
    [suppliers]
  );

  // Get unique supplier types
  const supplierTypes = useMemo(
    () => Array.from(new Set(suppliers.map((s) => s.supplierType))),
    [suppliers]
  );

  // Get unique platforms from product suppliers
  const platforms = useMemo(() => {
    const platformSet = new Set<SupplierPlatform>();
    suppliers.forEach((s) => {
      if (s.productsFields?.platform) {
        platformSet.add(s.productsFields.platform);
      }
    });
    return Array.from(platformSet);
  }, [suppliers]);

  // Get favourite suppliers
  const favourites = useMemo(
    () => suppliers.filter((s) => s.isFavourite),
    [suppliers]
  );

  return {
    suppliers,
    loading,
    error,
    isDemoMode,
    addSupplier,
    editSupplier,
    removeSupplier,
    toggleFavourite,
    getSupplierById,
    getSuppliersByType,
    materialsSuppliers,
    productsSuppliers,
    supplierTypes,
    platforms,
    favourites,
  };
}
