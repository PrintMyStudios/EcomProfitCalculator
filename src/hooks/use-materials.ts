'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import {
  subscribeMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  toggleMaterialFavourite,
  updateMaterialSupplierLinks,
  updateMaterialCostFromPreferred,
  type CreateMaterialInput,
  type CreateSupplierLinkInput,
} from '@/lib/firebase/materials';
import type { Material, MaterialSupplierLink, Currency, StockStatus } from '@/types';
import { getPreferredSupplierLink } from '@/types';

// Demo mode storage key
const DEMO_MATERIALS_KEY = 'demo_materials';

// Load demo materials from localStorage
function loadDemoMaterials(): Material[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(DEMO_MATERIALS_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    // Convert date strings back to Date objects
    return parsed.map((m: Material) => ({
      ...m,
      supplierLinks: (m.supplierLinks || []).map((link: MaterialSupplierLink) => ({
        ...link,
        lastCheckedDate: link.lastCheckedDate ? new Date(link.lastCheckedDate) : undefined,
        costHistory: (link.costHistory || []).map((entry) => ({
          ...entry,
          date: new Date(entry.date),
        })),
        createdAt: new Date(link.createdAt),
        updatedAt: new Date(link.updatedAt),
      })),
      costHistory: (m.costHistory || []).map((entry) => ({
        ...entry,
        date: new Date(entry.date),
      })),
      createdAt: new Date(m.createdAt),
      updatedAt: new Date(m.updatedAt),
    }));
  } catch {
    return [];
  }
}

// Save demo materials to localStorage
function saveDemoMaterials(materials: Material[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DEMO_MATERIALS_KEY, JSON.stringify(materials));
  } catch {
    // Ignore storage errors
  }
}

export function useMaterials() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
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

      const unsubscribe = subscribeMaterials(
        user.uid,
        (data) => {
          setMaterials(data);
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
      const demoMaterials = loadDemoMaterials();
      setMaterials(demoMaterials);
      setLoading(false);
    }
  }, [user]);

  // Add a new material
  const addMaterial = useCallback(
    async (data: CreateMaterialInput): Promise<string> => {
      if (user) {
        return createMaterial(user.uid, data);
      }

      // Demo mode - create locally
      const now = new Date();
      const newMaterial: Material = {
        id: `demo_${Date.now()}`,
        userId: 'demo_user',
        name: data.name,
        unit: data.unit,
        costPerUnit: data.costPerUnit,
        supplierLinks: [],
        supplier: data.supplier,
        supplierSku: data.supplierSku,
        category: data.category,
        notes: data.notes,
        isFavourite: false,
        usageCount: 0,
        costHistory: [{ cost: data.costPerUnit, date: now }],
        createdAt: now,
        updatedAt: now,
      };

      const updated = [...materials, newMaterial];
      setMaterials(updated);
      saveDemoMaterials(updated);
      return newMaterial.id;
    },
    [user, materials]
  );

  // Edit an existing material
  const editMaterial = useCallback(
    async (id: string, data: Partial<CreateMaterialInput>): Promise<void> => {
      if (user) {
        return updateMaterial(user.uid, id, data);
      }

      // Demo mode - update locally
      const updated = materials.map((m) =>
        m.id === id ? { ...m, ...data, updatedAt: new Date() } : m
      );
      setMaterials(updated);
      saveDemoMaterials(updated);
    },
    [user, materials]
  );

  // Remove a material
  const removeMaterial = useCallback(
    async (id: string): Promise<void> => {
      if (user) {
        return deleteMaterial(user.uid, id);
      }

      // Demo mode - remove locally
      const updated = materials.filter((m) => m.id !== id);
      setMaterials(updated);
      saveDemoMaterials(updated);
    },
    [user, materials]
  );

  // Toggle favourite status
  const toggleFavourite = useCallback(
    async (id: string, isFavourite: boolean): Promise<void> => {
      if (user) {
        return toggleMaterialFavourite(user.uid, id, isFavourite);
      }

      // Demo mode - update locally
      const updated = materials.map((m) =>
        m.id === id ? { ...m, isFavourite, updatedAt: new Date() } : m
      );
      setMaterials(updated);
      saveDemoMaterials(updated);
    },
    [user, materials]
  );

  // Get a material by ID
  const getMaterialById = useCallback(
    (id: string): Material | undefined => {
      return materials.find((m) => m.id === id);
    },
    [materials]
  );

  // ============================================
  // Supplier Link Operations
  // ============================================

  // Add a supplier link to a material
  const addSupplierLink = useCallback(
    async (materialId: string, linkData: CreateSupplierLinkInput): Promise<void> => {
      const material = materials.find((m) => m.id === materialId);
      if (!material) throw new Error('Material not found');

      const now = new Date();
      const newLink: MaterialSupplierLink = {
        id: `link_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...linkData,
        costHistory: [{ cost: linkData.costPerUnit, date: now }],
        createdAt: now,
        updatedAt: now,
      };

      // If this is preferred, unset other preferred links
      let updatedLinks = [...material.supplierLinks];
      if (linkData.isPreferred) {
        updatedLinks = updatedLinks.map((l) => ({ ...l, isPreferred: false }));
      }
      updatedLinks.push(newLink);

      if (user) {
        await updateMaterialSupplierLinks(user.uid, materialId, updatedLinks);
        // If preferred, also update material cost
        if (linkData.isPreferred) {
          await updateMaterialCostFromPreferred(user.uid, materialId, linkData.costPerUnit);
        }
      } else {
        // Demo mode
        const updated = materials.map((m) =>
          m.id === materialId
            ? {
                ...m,
                supplierLinks: updatedLinks,
                costPerUnit: linkData.isPreferred ? linkData.costPerUnit : m.costPerUnit,
                updatedAt: now,
              }
            : m
        );
        setMaterials(updated);
        saveDemoMaterials(updated);
      }
    },
    [user, materials]
  );

  // Update a supplier link
  const updateSupplierLink = useCallback(
    async (
      materialId: string,
      linkId: string,
      updates: Partial<Omit<CreateSupplierLinkInput, 'supplierId' | 'supplierName'>>
    ): Promise<void> => {
      const material = materials.find((m) => m.id === materialId);
      if (!material) throw new Error('Material not found');

      const now = new Date();
      let updatedLinks = material.supplierLinks.map((link) => {
        if (link.id !== linkId) {
          // If setting a new preferred, unset others
          if (updates.isPreferred) {
            return { ...link, isPreferred: false };
          }
          return link;
        }

        // Update this link
        const updatedLink = { ...link, ...updates, updatedAt: now };

        // If cost changed, add to cost history
        if (updates.costPerUnit !== undefined && updates.costPerUnit !== link.costPerUnit) {
          updatedLink.costHistory = [
            ...link.costHistory,
            { cost: updates.costPerUnit, date: now },
          ];
        }

        return updatedLink;
      });

      if (user) {
        await updateMaterialSupplierLinks(user.uid, materialId, updatedLinks);
        // If this link is preferred and cost changed, update material cost
        const updatedLink = updatedLinks.find((l) => l.id === linkId);
        if (updatedLink?.isPreferred && updates.costPerUnit !== undefined) {
          await updateMaterialCostFromPreferred(user.uid, materialId, updates.costPerUnit);
        }
      } else {
        // Demo mode
        const preferredLink = updatedLinks.find((l) => l.isPreferred);
        const updated = materials.map((m) =>
          m.id === materialId
            ? {
                ...m,
                supplierLinks: updatedLinks,
                costPerUnit: preferredLink?.costPerUnit ?? m.costPerUnit,
                updatedAt: now,
              }
            : m
        );
        setMaterials(updated);
        saveDemoMaterials(updated);
      }
    },
    [user, materials]
  );

  // Remove a supplier link
  const removeSupplierLink = useCallback(
    async (materialId: string, linkId: string): Promise<void> => {
      const material = materials.find((m) => m.id === materialId);
      if (!material) throw new Error('Material not found');

      const updatedLinks = material.supplierLinks.filter((l) => l.id !== linkId);

      if (user) {
        await updateMaterialSupplierLinks(user.uid, materialId, updatedLinks);
      } else {
        // Demo mode
        const updated = materials.map((m) =>
          m.id === materialId
            ? { ...m, supplierLinks: updatedLinks, updatedAt: new Date() }
            : m
        );
        setMaterials(updated);
        saveDemoMaterials(updated);
      }
    },
    [user, materials]
  );

  // Set a supplier link as preferred
  const setPreferredSupplierLink = useCallback(
    async (materialId: string, linkId: string): Promise<void> => {
      const material = materials.find((m) => m.id === materialId);
      if (!material) throw new Error('Material not found');

      const now = new Date();
      const updatedLinks = material.supplierLinks.map((link) => ({
        ...link,
        isPreferred: link.id === linkId,
        updatedAt: link.id === linkId ? now : link.updatedAt,
      }));

      const newPreferred = updatedLinks.find((l) => l.id === linkId);

      if (user) {
        await updateMaterialSupplierLinks(user.uid, materialId, updatedLinks);
        if (newPreferred) {
          await updateMaterialCostFromPreferred(user.uid, materialId, newPreferred.costPerUnit);
        }
      } else {
        // Demo mode
        const updated = materials.map((m) =>
          m.id === materialId
            ? {
                ...m,
                supplierLinks: updatedLinks,
                costPerUnit: newPreferred?.costPerUnit ?? m.costPerUnit,
                updatedAt: now,
              }
            : m
        );
        setMaterials(updated);
        saveDemoMaterials(updated);
      }
    },
    [user, materials]
  );

  // Update stock status for a supplier link
  const updateLinkStockStatus = useCallback(
    async (materialId: string, linkId: string, stockStatus: StockStatus): Promise<void> => {
      await updateSupplierLink(materialId, linkId, {
        stockStatus,
        lastCheckedDate: new Date(),
      } as Partial<Omit<CreateSupplierLinkInput, 'supplierId' | 'supplierName'>> & {
        lastCheckedDate?: Date;
      });
    },
    [updateSupplierLink]
  );

  // Get unique categories from materials
  const categories = useMemo(
    () => Array.from(new Set(materials.map((m) => m.category).filter(Boolean))) as string[],
    [materials]
  );

  // Get favourite materials
  const favourites = useMemo(
    () => materials.filter((m) => m.isFavourite),
    [materials]
  );

  // Get materials with low/out of stock suppliers
  const materialsWithStockIssues = useMemo(
    () =>
      materials.filter((m) =>
        m.supplierLinks.some(
          (l) =>
            l.isPreferred && (l.stockStatus === 'low_stock' || l.stockStatus === 'out_of_stock')
        )
      ),
    [materials]
  );

  return {
    materials,
    loading,
    error,
    isDemoMode,
    addMaterial,
    editMaterial,
    removeMaterial,
    toggleFavourite,
    getMaterialById,
    // Supplier link operations
    addSupplierLink,
    updateSupplierLink,
    removeSupplierLink,
    setPreferredSupplierLink,
    updateLinkStockStatus,
    // Computed values
    categories,
    favourites,
    materialsWithStockIssues,
  };
}
