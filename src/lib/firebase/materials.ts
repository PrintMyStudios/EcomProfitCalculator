import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  arrayUnion,
  arrayRemove,
  getDocs,
  where,
} from 'firebase/firestore';
import { db } from './config';
import type {
  Material,
  MaterialSupplierLink,
  CostHistoryEntry,
  Currency,
  StockStatus,
  QualityRating,
} from '@/types';

// Collection reference helper
const materialsCollection = (userId: string) => {
  if (!db) throw new Error('Firestore not initialized');
  return collection(db, 'users', userId, 'materials');
};

// Document reference helper
const materialDoc = (userId: string, materialId: string) => {
  if (!db) throw new Error('Firestore not initialized');
  return doc(db, 'users', userId, 'materials', materialId);
};

// Type for creating a material (without auto-generated fields)
export type CreateMaterialInput = {
  name: string;
  unit: string;
  costPerUnit: number;
  supplier?: string; // DEPRECATED: kept for migration
  supplierSku?: string; // DEPRECATED: kept for migration
  category?: string;
  notes?: string;
};

// Type for creating a supplier link
export type CreateSupplierLinkInput = {
  supplierId: string;
  supplierName: string;
  costPerUnit: number;
  currency: Currency;
  sku?: string;
  productUrl?: string;
  qualityRating?: QualityRating;
  stockStatus: StockStatus;
  minimumOrderQuantity?: number;
  packSize?: number;
  isPreferred: boolean;
};

// Create a new material
export async function createMaterial(
  userId: string,
  data: CreateMaterialInput
): Promise<string> {
  const docRef = await addDoc(materialsCollection(userId), {
    ...data,
    userId,
    supplierLinks: [], // Initialize with empty supplier links
    isFavourite: false,
    usageCount: 0,
    costHistory: [{ date: serverTimestamp(), cost: data.costPerUnit }],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

// Update an existing material
export async function updateMaterial(
  userId: string,
  materialId: string,
  data: Partial<CreateMaterialInput> & { isFavourite?: boolean }
): Promise<void> {
  const docRef = materialDoc(userId, materialId);

  // If cost changed, add to cost history
  const updateData: Record<string, unknown> = {
    ...data,
    updatedAt: serverTimestamp(),
  };

  if (data.costPerUnit !== undefined) {
    updateData.costHistory = arrayUnion({
      date: serverTimestamp(),
      cost: data.costPerUnit,
    });
  }

  await updateDoc(docRef, updateData);
}

// Delete a material
export async function deleteMaterial(userId: string, materialId: string): Promise<void> {
  const docRef = materialDoc(userId, materialId);
  await deleteDoc(docRef);
}

// Toggle favourite status
export async function toggleMaterialFavourite(
  userId: string,
  materialId: string,
  isFavourite: boolean
): Promise<void> {
  const docRef = materialDoc(userId, materialId);
  await updateDoc(docRef, {
    isFavourite,
    updatedAt: serverTimestamp(),
  });
}

// Increment usage count (called when material is added to a product)
export async function incrementMaterialUsage(
  userId: string,
  materialId: string
): Promise<void> {
  const docRef = materialDoc(userId, materialId);
  await updateDoc(docRef, {
    updatedAt: serverTimestamp(),
  });
}

// ============================================
// Supplier Link Operations
// ============================================

// Add a supplier link to a material
export async function addSupplierLink(
  userId: string,
  materialId: string,
  link: CreateSupplierLinkInput
): Promise<string> {
  const docRef = materialDoc(userId, materialId);
  const linkId = `link_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const newLink = {
    id: linkId,
    ...link,
    costHistory: [{ date: serverTimestamp(), cost: link.costPerUnit }],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await updateDoc(docRef, {
    supplierLinks: arrayUnion(newLink),
    updatedAt: serverTimestamp(),
  });

  return linkId;
}

// Update a supplier link (requires fetching the material first to modify the array)
export async function updateSupplierLink(
  userId: string,
  materialId: string,
  linkId: string,
  updates: Partial<Omit<CreateSupplierLinkInput, 'supplierId' | 'supplierName'>>
): Promise<void> {
  // Note: Firestore doesn't support updating array elements by condition
  // This requires reading the document, modifying the array, and writing back
  // For simplicity, we'll use a different approach in the hook
  const docRef = materialDoc(userId, materialId);
  await updateDoc(docRef, {
    updatedAt: serverTimestamp(),
  });
}

// Remove a supplier link
export async function removeSupplierLink(
  userId: string,
  materialId: string,
  link: MaterialSupplierLink
): Promise<void> {
  const docRef = materialDoc(userId, materialId);

  // We need to pass the exact object to arrayRemove
  // This is tricky with dates, so we'll handle it in the hook
  await updateDoc(docRef, {
    supplierLinks: arrayRemove(link),
    updatedAt: serverTimestamp(),
  });
}

// Update material with new supplier links array (used by hook for complex operations)
export async function updateMaterialSupplierLinks(
  userId: string,
  materialId: string,
  supplierLinks: MaterialSupplierLink[]
): Promise<void> {
  const docRef = materialDoc(userId, materialId);

  // Convert dates to timestamps for Firestore
  const linksForFirestore = supplierLinks.map((link) => ({
    ...link,
    lastCheckedDate: link.lastCheckedDate || null,
    costHistory: link.costHistory.map((entry) => ({
      ...entry,
      date: entry.date instanceof Date ? Timestamp.fromDate(entry.date) : entry.date,
    })),
    createdAt: link.createdAt instanceof Date ? Timestamp.fromDate(link.createdAt) : link.createdAt,
    updatedAt: serverTimestamp(),
  }));

  await updateDoc(docRef, {
    supplierLinks: linksForFirestore,
    updatedAt: serverTimestamp(),
  });
}

// Update material cost from preferred supplier link
export async function updateMaterialCostFromPreferred(
  userId: string,
  materialId: string,
  cost: number
): Promise<void> {
  const docRef = materialDoc(userId, materialId);
  await updateDoc(docRef, {
    costPerUnit: cost,
    costHistory: arrayUnion({
      date: serverTimestamp(),
      cost: cost,
    }),
    updatedAt: serverTimestamp(),
  });
}

// ============================================
// Document Conversion with Migration
// ============================================

// Convert Firestore timestamp to Date
function toDate(value: unknown): Date {
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  if (value instanceof Date) {
    return value;
  }
  return new Date();
}

// Convert raw supplier link data to MaterialSupplierLink
function toSupplierLink(data: Record<string, unknown>): MaterialSupplierLink {
  return {
    id: data.id as string,
    supplierId: data.supplierId as string,
    supplierName: data.supplierName as string,
    costPerUnit: data.costPerUnit as number,
    currency: data.currency as Currency,
    sku: data.sku as string | undefined,
    productUrl: data.productUrl as string | undefined,
    qualityRating: data.qualityRating as QualityRating | undefined,
    stockStatus: (data.stockStatus as StockStatus) || 'unknown',
    lastCheckedDate: data.lastCheckedDate ? toDate(data.lastCheckedDate) : undefined,
    minimumOrderQuantity: data.minimumOrderQuantity as number | undefined,
    packSize: data.packSize as number | undefined,
    isPreferred: (data.isPreferred as boolean) ?? false,
    costHistory: (
      (data.costHistory as Array<{ date: unknown; cost: number }>) || []
    ).map((entry) => ({
      date: toDate(entry.date),
      cost: entry.cost,
    })),
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

// Convert Firestore document to Material type with migration support
function docToMaterial(doc: { id: string; data: () => Record<string, unknown> }): Material {
  const data = doc.data();

  // Parse supplier links if present
  const rawLinks = (data.supplierLinks as Array<Record<string, unknown>>) || [];
  const supplierLinks: MaterialSupplierLink[] = rawLinks.map(toSupplierLink);

  // Parse cost history
  const costHistory: CostHistoryEntry[] = (
    (data.costHistory as Array<{ date: unknown; cost: number }>) || []
  ).map((entry) => ({
    date: toDate(entry.date),
    cost: entry.cost,
  }));

  return {
    id: doc.id,
    userId: data.userId as string,
    name: data.name as string,
    unit: data.unit as string,
    costPerUnit: data.costPerUnit as number,
    supplierLinks,
    // DEPRECATED: Keep for migration
    supplier: data.supplier as string | undefined,
    supplierSku: data.supplierSku as string | undefined,
    category: data.category as string | undefined,
    notes: data.notes as string | undefined,
    isFavourite: (data.isFavourite as boolean) ?? false,
    usageCount: (data.usageCount as number) ?? 0,
    costHistory,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

// Subscribe to materials (real-time updates)
export function subscribeMaterials(
  userId: string,
  callback: (materials: Material[]) => void,
  onError?: (error: Error) => void
): () => void {
  const q = query(materialsCollection(userId), orderBy('name', 'asc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const materials = snapshot.docs.map(docToMaterial);
      callback(materials);
    },
    (error) => {
      console.error('Error subscribing to materials:', error);
      onError?.(error);
    }
  );
}

// Get all materials (one-time fetch)
export async function getMaterials(userId: string): Promise<Material[]> {
  const q = query(materialsCollection(userId), orderBy('name', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToMaterial);
}

// Get materials by category
export async function getMaterialsByCategory(
  userId: string,
  category: string
): Promise<Material[]> {
  const q = query(
    materialsCollection(userId),
    where('category', '==', category),
    orderBy('name', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToMaterial);
}

// Get favourite materials
export async function getFavouriteMaterials(userId: string): Promise<Material[]> {
  const q = query(
    materialsCollection(userId),
    where('isFavourite', '==', true),
    orderBy('name', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToMaterial);
}
