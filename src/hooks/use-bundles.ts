'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/components/auth/auth-provider';
import type { Bundle, Product } from '@/types';
import type { BundleFormValues } from '@/lib/validations/bundle';
import { calculateBundleCost } from '@/lib/validations/bundle';

export function useBundles() {
  const { user } = useAuth();
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Subscribe to bundles
  useEffect(() => {
    if (!user?.uid || !db) {
      setBundles([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const bundlesRef = collection(db, 'users', user.uid, 'bundles');
    const q = query(bundlesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const bundleList: Bundle[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            userId: user.uid,
            name: data.name,
            description: data.description,
            productIds: data.productIds || [],
            calculatedCost: data.calculatedCost || 0,
            suggestedPrice: data.suggestedPrice,
            isFavourite: data.isFavourite || false,
            tags: data.tags || [],
            notes: data.notes,
            createdAt:
              data.createdAt instanceof Timestamp
                ? data.createdAt.toDate()
                : new Date(data.createdAt),
            updatedAt:
              data.updatedAt instanceof Timestamp
                ? data.updatedAt.toDate()
                : new Date(data.updatedAt),
          };
        });
        setBundles(bundleList);
        setIsLoading(false);
      },
      (err) => {
        console.error('Error loading bundles:', err);
        setError(err as Error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  // Create a bundle
  const createBundle = useCallback(
    async (data: BundleFormValues, products: Product[]): Promise<string> => {
      if (!user?.uid || !db) {
        throw new Error('Must be logged in to create bundles');
      }

      // Calculate cost from products
      const productCosts = products
        .filter((p) => data.productIds.includes(p.id))
        .map((p) => p.calculatedCost);
      const calculatedCost = calculateBundleCost(productCosts);

      const bundlesRef = collection(db, 'users', user.uid, 'bundles');
      const docRef = await addDoc(bundlesRef, {
        name: data.name,
        description: data.description || '',
        productIds: data.productIds,
        calculatedCost,
        suggestedPrice: data.suggestedPrice || null,
        isFavourite: data.isFavourite || false,
        tags: data.tags || [],
        notes: data.notes || '',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      return docRef.id;
    },
    [user?.uid]
  );

  // Update a bundle
  const updateBundle = useCallback(
    async (
      bundleId: string,
      data: Partial<BundleFormValues>,
      products?: Product[]
    ): Promise<void> => {
      if (!user?.uid || !db) {
        throw new Error('Must be logged in to update bundles');
      }

      const bundleRef = doc(db, 'users', user.uid, 'bundles', bundleId);

      const updateData: Record<string, unknown> = {
        ...data,
        updatedAt: Timestamp.now(),
      };

      // Recalculate cost if productIds changed and products provided
      if (data.productIds && products) {
        const productCosts = products
          .filter((p) => data.productIds!.includes(p.id))
          .map((p) => p.calculatedCost);
        updateData.calculatedCost = calculateBundleCost(productCosts);
      }

      await updateDoc(bundleRef, updateData);
    },
    [user?.uid]
  );

  // Delete a bundle
  const deleteBundle = useCallback(
    async (bundleId: string): Promise<void> => {
      if (!user?.uid || !db) {
        throw new Error('Must be logged in to delete bundles');
      }

      const bundleRef = doc(db, 'users', user.uid, 'bundles', bundleId);
      await deleteDoc(bundleRef);
    },
    [user?.uid]
  );

  // Toggle favourite
  const toggleFavourite = useCallback(
    async (bundleId: string, currentValue: boolean): Promise<void> => {
      if (!user?.uid || !db) {
        throw new Error('Must be logged in to update bundles');
      }

      const bundleRef = doc(db, 'users', user.uid, 'bundles', bundleId);
      await updateDoc(bundleRef, {
        isFavourite: !currentValue,
        updatedAt: Timestamp.now(),
      });
    },
    [user?.uid]
  );

  return {
    bundles,
    isLoading,
    error,
    createBundle,
    updateBundle,
    deleteBundle,
    toggleFavourite,
  };
}
