'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/components/auth/auth-provider';
import type { Product, HandmadeProduct, SourcedProduct } from '@/types';
import type { ProductFormValues, HandmadeProductFormValues, SourcedProductFormValues } from '@/lib/validations/product';
import { calculateHandmadeCost, calculateSourcedCost } from '@/lib/validations/product';
import { useSettingsStore } from '@/stores/settings';
import { toMinorUnits } from '@/lib/constants/currencies';

interface UseProductsResult {
  products: Product[];
  isLoading: boolean;
  error: Error | null;
  addProduct: (data: ProductFormValues) => Promise<string>;
  updateProduct: (id: string, data: ProductFormValues) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleFavourite: (id: string, isFavourite: boolean) => Promise<void>;
  refreshProducts: () => Promise<void>;
}

// Convert Firestore document to Product type
function docToProduct(doc: { id: string; data: () => Record<string, unknown> }): Product {
  const data = doc.data();
  const baseProduct = {
    id: doc.id,
    userId: data.userId as string,
    name: data.name as string,
    sku: data.sku as string | undefined,
    notes: data.notes as string | undefined,
    tags: data.tags as string[] | undefined,
    isFavourite: data.isFavourite as boolean || false,
    calculatedCost: data.calculatedCost as number,
    createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
  };

  if (data.productType === 'handmade') {
    return {
      ...baseProduct,
      productType: 'handmade',
      materials: data.materials as HandmadeProduct['materials'],
      labourHours: data.labourHours as number | undefined,
      labourRate: data.labourRate as number | undefined,
      labourTasks: data.labourTasks as HandmadeProduct['labourTasks'],
      packagingCost: data.packagingCost as number,
    } as HandmadeProduct;
  } else {
    return {
      ...baseProduct,
      productType: 'sourced',
      supplierId: data.supplierId as string | undefined,
      supplierName: data.supplierName as string | undefined,
      supplierCost: data.supplierCost as number,
      supplierShippingCost: data.supplierShippingCost as number,
      supplierUrl: data.supplierUrl as string | undefined,
      sourceType: data.sourceType as SourcedProduct['sourceType'],
    } as SourcedProduct;
  }
}

export function useProducts(): UseProductsResult {
  const { user } = useAuth();
  const currency = useSettingsStore((state) => state.currency);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = useCallback(async () => {
    if (!user?.uid || !db) {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const productsRef = collection(db, 'users', user.uid, 'products');
      const q = query(productsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      const fetchedProducts = snapshot.docs.map((doc) =>
        docToProduct({ id: doc.id, data: () => doc.data() })
      );

      setProducts(fetchedProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch products'));
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = useCallback(async (data: ProductFormValues): Promise<string> => {
    if (!user?.uid || !db) throw new Error('User not authenticated');

    // Calculate cost based on product type
    let calculatedCost: number;

    if (data.productType === 'handmade') {
      const handmadeData = data as HandmadeProductFormValues;
      calculatedCost = calculateHandmadeCost(
        handmadeData.materials,
        handmadeData.labourTasks,
        handmadeData.labourMinutes,
        handmadeData.labourRate,
        handmadeData.packagingCost
      );
      // Convert to minor units
      calculatedCost = toMinorUnits(calculatedCost, currency);
    } else {
      const sourcedData = data as SourcedProductFormValues;
      calculatedCost = calculateSourcedCost(
        sourcedData.supplierCost,
        sourcedData.supplierShippingCost
      );
      // Convert to minor units
      calculatedCost = toMinorUnits(calculatedCost, currency);
    }

    const productData = {
      ...data,
      userId: user.uid,
      calculatedCost,
      isFavourite: data.isFavourite || false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const productsRef = collection(db, 'users', user.uid, 'products');
    const docRef = await addDoc(productsRef, productData);

    // Refresh products list
    await fetchProducts();

    return docRef.id;
  }, [user?.uid, currency, fetchProducts]);

  const updateProduct = useCallback(async (id: string, data: ProductFormValues): Promise<void> => {
    if (!user?.uid || !db) throw new Error('User not authenticated');

    // Calculate cost based on product type
    let calculatedCost: number;

    if (data.productType === 'handmade') {
      const handmadeData = data as HandmadeProductFormValues;
      calculatedCost = calculateHandmadeCost(
        handmadeData.materials,
        handmadeData.labourTasks,
        handmadeData.labourMinutes,
        handmadeData.labourRate,
        handmadeData.packagingCost
      );
      calculatedCost = toMinorUnits(calculatedCost, currency);
    } else {
      const sourcedData = data as SourcedProductFormValues;
      calculatedCost = calculateSourcedCost(
        sourcedData.supplierCost,
        sourcedData.supplierShippingCost
      );
      calculatedCost = toMinorUnits(calculatedCost, currency);
    }

    const productData = {
      ...data,
      calculatedCost,
      updatedAt: serverTimestamp(),
    };

    const productRef = doc(db, 'users', user.uid, 'products', id);
    await updateDoc(productRef, productData);

    // Refresh products list
    await fetchProducts();
  }, [user?.uid, currency, fetchProducts]);

  const deleteProduct = useCallback(async (id: string): Promise<void> => {
    if (!user?.uid || !db) throw new Error('User not authenticated');

    const productRef = doc(db, 'users', user.uid, 'products', id);
    await deleteDoc(productRef);

    // Remove from local state immediately
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, [user?.uid]);

  const toggleFavourite = useCallback(async (id: string, isFavourite: boolean): Promise<void> => {
    if (!user?.uid || !db) throw new Error('User not authenticated');

    const productRef = doc(db, 'users', user.uid, 'products', id);
    await updateDoc(productRef, {
      isFavourite,
      updatedAt: serverTimestamp(),
    });

    // Update local state immediately
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavourite } : p))
    );
  }, [user?.uid]);

  return {
    products,
    isLoading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleFavourite,
    refreshProducts: fetchProducts,
  };
}
