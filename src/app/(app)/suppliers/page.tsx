'use client';

import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SupplierForm } from '@/components/suppliers/supplier-form';
import { SupplierCard } from '@/components/suppliers/supplier-card';
import { useSuppliers } from '@/hooks/use-suppliers';
import {
  transformSupplierFormToInput,
  SUPPLIER_PLATFORMS,
  SUPPLIER_TYPES,
  type SupplierFormValues,
} from '@/lib/validations/supplier';
import type { Supplier, Currency, SupplierType } from '@/types';
import { Plus, Search, Star, Package } from 'lucide-react';

export default function SuppliersPage() {
  const {
    suppliers,
    loading,
    error,
    addSupplier,
    editSupplier,
    removeSupplier,
    toggleFavourite,
    supplierTypes,
    platforms,
  } = useSuppliers();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [showFavouritesOnly, setShowFavouritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc' | 'recent'>('name-asc');

  // Filter and sort suppliers
  const filteredSuppliers = useMemo(() => {
    // Get platform label for search matching
    const getPlatformLabel = (platformValue: string) => {
      return SUPPLIER_PLATFORMS.find((p) => p.value === platformValue)?.label || '';
    };

    // Get type label for search matching
    const getTypeLabel = (typeValue: string) => {
      return SUPPLIER_TYPES.find((t) => t.value === typeValue)?.label || '';
    };

    const filtered = suppliers.filter((supplier) => {
      // Search filter - includes type and platform labels
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = supplier.name.toLowerCase().includes(query);
        const matchesWebsite = supplier.website?.toLowerCase().includes(query);
        const matchesNotes = supplier.notes?.toLowerCase().includes(query);
        const matchesType = getTypeLabel(supplier.supplierType).toLowerCase().includes(query);
        const matchesPlatform = supplier.productsFields?.platform
          ? getPlatformLabel(supplier.productsFields.platform).toLowerCase().includes(query)
          : false;
        const matchesContact = supplier.contact?.contactName?.toLowerCase().includes(query);
        if (!matchesName && !matchesWebsite && !matchesNotes && !matchesType && !matchesPlatform && !matchesContact) {
          return false;
        }
      }

      // Type filter
      if (typeFilter !== 'all') {
        if (typeFilter === 'materials') {
          if (supplier.supplierType !== 'materials' && supplier.supplierType !== 'both') {
            return false;
          }
        } else if (typeFilter === 'products') {
          if (supplier.supplierType !== 'products' && supplier.supplierType !== 'both') {
            return false;
          }
        } else if (supplier.supplierType !== typeFilter) {
          return false;
        }
      }

      // Platform filter (only for product suppliers)
      if (platformFilter !== 'all') {
        if (supplier.productsFields?.platform !== platformFilter) {
          return false;
        }
      }

      // Favourites filter
      if (showFavouritesOnly && !supplier.isFavourite) {
        return false;
      }

      return true;
    });

    // Sort
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });
  }, [suppliers, searchQuery, typeFilter, platformFilter, showFavouritesOnly, sortBy]);

  const handleOpenSheet = (supplier?: Supplier) => {
    setEditingSupplier(supplier || null);
    setSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
    setEditingSupplier(null);
  };

  const handleSubmit = async (values: SupplierFormValues) => {
    setIsSubmitting(true);
    try {
      const input = transformSupplierFormToInput(values);
      if (editingSupplier) {
        await editSupplier(editingSupplier.id, {
          ...input,
          currency: input.currency as Currency,
        });
        toast.success('Supplier updated');
      } else {
        await addSupplier({
          ...input,
          currency: input.currency as Currency,
        });
        toast.success('Supplier added');
      }
      handleCloseSheet();
    } catch (err) {
      console.error('Failed to save supplier:', err);
      toast.error('Failed to save supplier', {
        description: err instanceof Error ? err.message : 'Please try again',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (supplier: Supplier) => {
    try {
      await removeSupplier(supplier.id);
      toast.success('Supplier deleted');
    } catch (err) {
      console.error('Failed to delete supplier:', err);
      toast.error('Failed to delete supplier', {
        description: err instanceof Error ? err.message : 'Please try again',
      });
    }
  };

  const handleToggleFavourite = async (supplier: Supplier) => {
    try {
      await toggleFavourite(supplier.id, !supplier.isFavourite);
      toast.success(supplier.isFavourite ? 'Removed from favourites' : 'Added to favourites');
    } catch (err) {
      console.error('Failed to toggle favourite:', err);
      toast.error('Failed to update favourite');
    }
  };

  // Get unique platforms from suppliers for filter
  const usedPlatforms = useMemo(() => {
    return SUPPLIER_PLATFORMS.filter((p) => platforms.includes(p.value));
  }, [platforms]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading suppliers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive">Failed to load suppliers</p>
          <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Suppliers</h1>
          <p className="text-muted-foreground">
            Manage your materials and product suppliers
          </p>
        </div>
        <Button onClick={() => handleOpenSheet()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      {/* Filters */}
      {suppliers.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search suppliers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Type filter */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="materials">Materials</SelectItem>
              <SelectItem value="products">Products</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>

          {/* Platform filter (only show if there are product suppliers) */}
          {usedPlatforms.length > 0 && (
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All Platforms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                {usedPlatforms.map((platform) => (
                  <SelectItem key={platform.value} value={platform.value}>
                    {platform.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Sort dropdown */}
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name A-Z</SelectItem>
              <SelectItem value="name-desc">Name Z-A</SelectItem>
              <SelectItem value="recent">Recently Added</SelectItem>
            </SelectContent>
          </Select>

          {/* Favourites toggle */}
          <Button
            variant={showFavouritesOnly ? 'default' : 'outline'}
            size="icon"
            onClick={() => setShowFavouritesOnly(!showFavouritesOnly)}
            title={showFavouritesOnly ? 'Show all' : 'Show favourites only'}
          >
            <Star className={`h-4 w-4 ${showFavouritesOnly ? 'fill-current' : ''}`} />
          </Button>
        </div>
      )}

      {/* Suppliers grid or empty state */}
      {suppliers.length === 0 ? (
        <EmptyState onAddSupplier={() => handleOpenSheet()} />
      ) : filteredSuppliers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No suppliers match your filters</p>
          <Button
            variant="link"
            onClick={() => {
              setSearchQuery('');
              setTypeFilter('all');
              setPlatformFilter('all');
              setShowFavouritesOnly(false);
              setSortBy('name-asc');
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredSuppliers.map((supplier) => (
            <SupplierCard
              key={supplier.id}
              supplier={supplier}
              onEdit={handleOpenSheet}
              onDelete={handleDelete}
              onToggleFavourite={handleToggleFavourite}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto p-0">
          {/* Header with gradient accent */}
          <div className="relative border-b bg-gradient-to-r from-emerald-500/5 to-green-500/5">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-600" />
            <SheetHeader className="p-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20">
                  <Package className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <SheetTitle className="text-lg">
                    {editingSupplier ? 'Edit Supplier' : 'Add Supplier'}
                  </SheetTitle>
                  <SheetDescription>
                    {editingSupplier
                      ? 'Update the details of this supplier'
                      : 'Add a new supplier for materials or products'}
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>
          </div>
          {/* Form content with proper padding */}
          <div className="p-6">
            <SupplierForm
              supplier={editingSupplier || undefined}
              onSubmit={handleSubmit}
              onCancel={handleCloseSheet}
              isSubmitting={isSubmitting}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// Empty state component
function EmptyState({ onAddSupplier }: { onAddSupplier: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed rounded-lg">
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <Package className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-1">No suppliers yet</h3>
      <p className="text-muted-foreground text-center max-w-sm mb-2">
        Add suppliers you buy materials or source products from. Track where you get
        your supplies and link them to materials and products.
      </p>
      <p className="text-xs text-muted-foreground text-center max-w-sm mb-6">
        <span className="font-medium text-primary">Suppliers</span>
        <span className="mx-2">→</span>
        <span>Materials / Products</span>
        <span className="mx-2">→</span>
        <span>Calculator</span>
      </p>
      <Button onClick={onAddSupplier}>
        <Plus className="w-4 h-4 mr-2" />
        Add Your First Supplier
      </Button>
    </div>
  );
}
