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
  getDocs,
  where,
} from 'firebase/firestore';
import { db } from './config';
import type {
  Supplier,
  SupplierType,
  SupplierPlatform,
  SupplierContact,
  MaterialsSupplierFields,
  ProductSupplierFields,
  Currency,
} from '@/types';

// Collection reference helper
const suppliersCollection = (userId: string) => {
  if (!db) throw new Error('Firestore not initialized');
  return collection(db, 'users', userId, 'suppliers');
};

// Document reference helper
const supplierDoc = (userId: string, supplierId: string) => {
  if (!db) throw new Error('Firestore not initialized');
  return doc(db, 'users', userId, 'suppliers', supplierId);
};

// Type for creating a supplier (without auto-generated fields)
export type CreateSupplierInput = {
  name: string;
  supplierType: SupplierType;
  currency: Currency;
  website?: string;
  notes?: string;
  contact?: SupplierContact;
  materialsFields?: MaterialsSupplierFields;
  productsFields?: ProductSupplierFields;
};

// Create a new supplier
export async function createSupplier(
  userId: string,
  data: CreateSupplierInput
): Promise<string> {
  const docRef = await addDoc(suppliersCollection(userId), {
    ...data,
    userId,
    isFavourite: false,
    usageCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

// Update an existing supplier
export async function updateSupplier(
  userId: string,
  supplierId: string,
  data: Partial<CreateSupplierInput> & { isFavourite?: boolean }
): Promise<void> {
  const docRef = supplierDoc(userId, supplierId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// Delete a supplier
export async function deleteSupplier(
  userId: string,
  supplierId: string
): Promise<void> {
  const docRef = supplierDoc(userId, supplierId);
  await deleteDoc(docRef);
}

// Toggle favourite status
export async function toggleSupplierFavourite(
  userId: string,
  supplierId: string,
  isFavourite: boolean
): Promise<void> {
  const docRef = supplierDoc(userId, supplierId);
  await updateDoc(docRef, {
    isFavourite,
    updatedAt: serverTimestamp(),
  });
}

// Increment usage count (called when supplier is linked to a material/product)
export async function incrementSupplierUsage(
  userId: string,
  supplierId: string
): Promise<void> {
  const docRef = supplierDoc(userId, supplierId);
  // Note: For proper increment, you might want to use FieldValue.increment()
  // For now, we'll handle this in the product/material creation logic
  await updateDoc(docRef, {
    updatedAt: serverTimestamp(),
  });
}

// Convert Firestore document to Supplier type
function docToSupplier(doc: { id: string; data: () => Record<string, unknown> }): Supplier {
  const data = doc.data();

  // Handle migration from old format (with platform) to new format (with supplierType)
  let supplierType: SupplierType = (data.supplierType as SupplierType) || 'products';
  let productsFields: ProductSupplierFields | undefined = data.productsFields as
    | ProductSupplierFields
    | undefined;

  // Migration: if old 'platform' field exists but no supplierType, convert
  if (!data.supplierType && data.platform) {
    supplierType = 'products';
    productsFields = {
      platform: data.platform as SupplierPlatform,
    };
  }

  return {
    id: doc.id,
    userId: data.userId as string,
    name: data.name as string,
    supplierType,
    currency: data.currency as Currency,
    website: data.website as string | undefined,
    notes: data.notes as string | undefined,
    contact: data.contact as SupplierContact | undefined,
    materialsFields: data.materialsFields as MaterialsSupplierFields | undefined,
    productsFields,
    isFavourite: (data.isFavourite as boolean) ?? false,
    usageCount: (data.usageCount as number) ?? 0,
    createdAt: (data.createdAt as Timestamp)?.toDate?.() || new Date(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate?.() || new Date(),
  };
}

// Subscribe to suppliers (real-time updates)
export function subscribeSuppliers(
  userId: string,
  callback: (suppliers: Supplier[]) => void,
  onError?: (error: Error) => void
): () => void {
  const q = query(suppliersCollection(userId), orderBy('name', 'asc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const suppliers = snapshot.docs.map(docToSupplier);
      callback(suppliers);
    },
    (error) => {
      console.error('Error subscribing to suppliers:', error);
      onError?.(error);
    }
  );
}

// Get all suppliers (one-time fetch)
export async function getSuppliers(userId: string): Promise<Supplier[]> {
  const q = query(suppliersCollection(userId), orderBy('name', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToSupplier);
}

// Get suppliers by type
export async function getSuppliersByType(
  userId: string,
  supplierType: SupplierType
): Promise<Supplier[]> {
  // For 'materials' or 'products', we also want to include 'both'
  const q = query(suppliersCollection(userId), orderBy('name', 'asc'));
  const snapshot = await getDocs(q);
  const allSuppliers = snapshot.docs.map(docToSupplier);

  // Filter client-side to include 'both' type
  return allSuppliers.filter(
    (s) => s.supplierType === supplierType || s.supplierType === 'both'
  );
}

// Get materials suppliers (suppliers that can provide materials)
export async function getMaterialsSuppliers(userId: string): Promise<Supplier[]> {
  return getSuppliersByType(userId, 'materials');
}

// Get products suppliers (suppliers for dropship/POD/resale)
export async function getProductsSuppliers(userId: string): Promise<Supplier[]> {
  return getSuppliersByType(userId, 'products');
}

// Get suppliers by platform (for product suppliers)
export async function getSuppliersByPlatform(
  userId: string,
  platform: SupplierPlatform
): Promise<Supplier[]> {
  const q = query(suppliersCollection(userId), orderBy('name', 'asc'));
  const snapshot = await getDocs(q);
  const allSuppliers = snapshot.docs.map(docToSupplier);

  // Filter client-side for platform in productsFields
  return allSuppliers.filter((s) => s.productsFields?.platform === platform);
}

// Get favourite suppliers
export async function getFavouriteSuppliers(userId: string): Promise<Supplier[]> {
  const q = query(
    suppliersCollection(userId),
    where('isFavourite', '==', true),
    orderBy('name', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToSupplier);
}
