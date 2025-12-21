'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  Timestamp,
  limit,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/components/auth/auth-provider';
import type { SavedCalculation, CalculationInput, CalculationResult, PlatformKey } from '@/types';

interface SaveCalculationInput {
  itemType: 'product' | 'listing';
  itemId: string;
  itemName: string;
  input: CalculationInput;
  result: CalculationResult;
  platformKey: PlatformKey;
}

export function useSavedCalculations(maxItems: number = 50) {
  const { user } = useAuth();
  const [calculations, setCalculations] = useState<SavedCalculation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Subscribe to saved calculations
  useEffect(() => {
    if (!user?.uid || !db) {
      setCalculations([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const calculationsRef = collection(db, 'users', user.uid, 'calculations');
    const q = query(calculationsRef, orderBy('timestamp', 'desc'), limit(maxItems));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const calcs: SavedCalculation[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            userId: user.uid,
            itemType: data.itemType,
            itemId: data.itemId,
            itemName: data.itemName,
            input: data.input,
            result: data.result,
            platformKey: data.platformKey,
            timestamp: data.timestamp instanceof Timestamp
              ? data.timestamp.toDate()
              : new Date(data.timestamp),
          };
        });
        setCalculations(calcs);
        setIsLoading(false);
      },
      (err) => {
        console.error('Error loading saved calculations:', err);
        setError(err as Error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid, maxItems]);

  // Save a calculation
  const saveCalculation = useCallback(
    async (data: SaveCalculationInput): Promise<string> => {
      if (!user?.uid || !db) {
        throw new Error('Must be logged in to save calculations');
      }

      const calculationsRef = collection(db, 'users', user.uid, 'calculations');
      const docRef = await addDoc(calculationsRef, {
        ...data,
        timestamp: Timestamp.now(),
      });

      return docRef.id;
    },
    [user?.uid]
  );

  // Delete a calculation
  const deleteCalculation = useCallback(
    async (calculationId: string): Promise<void> => {
      if (!user?.uid || !db) {
        throw new Error('Must be logged in to delete calculations');
      }

      const calcRef = doc(db, 'users', user.uid, 'calculations', calculationId);
      await deleteDoc(calcRef);
    },
    [user?.uid]
  );

  // Clear all calculations
  const clearAllCalculations = useCallback(async (): Promise<void> => {
    if (!user?.uid || !db) {
      throw new Error('Must be logged in to clear calculations');
    }

    const firestore = db;
    const userId = user.uid;

    // Delete each calculation
    await Promise.all(
      calculations.map((calc) =>
        deleteDoc(doc(firestore, 'users', userId, 'calculations', calc.id))
      )
    );
  }, [user?.uid, calculations]);

  return {
    calculations,
    isLoading,
    error,
    saveCalculation,
    deleteCalculation,
    clearAllCalculations,
  };
}
