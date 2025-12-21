'use client';

import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MaterialForm, type QuickSupplierData } from '@/components/materials/material-form';
import { MaterialCard } from '@/components/materials/material-card';
import { useMaterials } from '@/hooks/use-materials';
import { useSuppliers } from '@/hooks/use-suppliers';
import { transformMaterialFormToInput, MATERIAL_CATEGORIES, type MaterialFormValues } from '@/lib/validations/material';
import { transformLinkFormToInput, type MaterialSupplierLinkFormValues } from '@/lib/validations/material-supplier-link';
import type { Material, StockStatus } from '@/types';
import { Plus, Search, Star, Package } from 'lucide-react';
import { MaterialsPageSkeleton } from '@/components/skeletons';

export default function MaterialsPage() {
  const {
    materials,
    loading,
    error,
    addMaterial,
    editMaterial,
    removeMaterial,
    toggleFavourite,
    addSupplierLink,
    updateLinkStockStatus,
  } = useMaterials();

  const { suppliers, materialsSuppliers, addSupplier, loading: suppliersLoading } = useSuppliers();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showFavouritesOnly, setShowFavouritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc' | 'cost-high' | 'cost-low' | 'recent'>('name-asc');

  // Filter and sort materials
  const filteredMaterials = useMemo(() => {
    // Get category label for search matching
    const getCategoryLabel = (categoryValue: string | undefined) => {
      if (!categoryValue) return '';
      return MATERIAL_CATEGORIES.find((c) => c.value === categoryValue)?.label || '';
    };

    const filtered = materials.filter((material) => {
      // Search filter - now includes category label
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = material.name.toLowerCase().includes(query);
        const matchesSupplier = material.supplier?.toLowerCase().includes(query);
        const matchesNotes = material.notes?.toLowerCase().includes(query);
        const matchesCategory = getCategoryLabel(material.category).toLowerCase().includes(query);
        if (!matchesName && !matchesSupplier && !matchesNotes && !matchesCategory) {
          return false;
        }
      }

      // Category filter
      if (categoryFilter !== 'all' && material.category !== categoryFilter) {
        return false;
      }

      // Favourites filter
      if (showFavouritesOnly && !material.isFavourite) {
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
        case 'cost-high':
          return b.costPerUnit - a.costPerUnit;
        case 'cost-low':
          return a.costPerUnit - b.costPerUnit;
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });
  }, [materials, searchQuery, categoryFilter, showFavouritesOnly, sortBy]);

  const handleOpenDialog = (material?: Material) => {
    setEditingMaterial(material || null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingMaterial(null);
  };

  const handleSubmit = async (values: MaterialFormValues) => {
    setIsSubmitting(true);
    try {
      const input = transformMaterialFormToInput(values);
      if (editingMaterial) {
        await editMaterial(editingMaterial.id, input);
        toast.success('Material updated');
      } else {
        await addMaterial(input);
        toast.success('Material added');
      }
      handleCloseDialog();
    } catch (err) {
      console.error('Failed to save material:', err);
      toast.error('Failed to save material', {
        description: err instanceof Error ? err.message : 'Please try again',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (material: Material) => {
    try {
      await removeMaterial(material.id);
      toast.success('Material deleted');
    } catch (err) {
      console.error('Failed to delete material:', err);
      toast.error('Failed to delete material', {
        description: err instanceof Error ? err.message : 'Please try again',
      });
    }
  };

  const handleToggleFavourite = async (material: Material) => {
    try {
      await toggleFavourite(material.id, !material.isFavourite);
      toast.success(material.isFavourite ? 'Removed from favourites' : 'Added to favourites');
    } catch (err) {
      console.error('Failed to toggle favourite:', err);
      toast.error('Failed to update favourite');
    }
  };

  const handleAddSupplierLink = async (materialId: string, data: MaterialSupplierLinkFormValues) => {
    try {
      const linkInput = transformLinkFormToInput(data);
      await addSupplierLink(materialId, linkInput);
      toast.success('Supplier linked');
    } catch (err) {
      console.error('Failed to link supplier:', err);
      toast.error('Failed to link supplier', {
        description: err instanceof Error ? err.message : 'Please try again',
      });
      throw err;
    }
  };

  const handleUpdateStockStatus = async (materialId: string, linkId: string, status: StockStatus) => {
    try {
      await updateLinkStockStatus(materialId, linkId, status);
      toast.success('Stock status updated');
    } catch (err) {
      console.error('Failed to update stock status:', err);
      toast.error('Failed to update stock status');
    }
  };

  // Quick-add supplier from material form
  const handleQuickAddSupplier = async (data: QuickSupplierData): Promise<string> => {
    try {
      const supplierId = await addSupplier({
        name: data.name,
        supplierType: 'materials',
        currency: data.currency,
        website: data.website,
      });
      toast.success('Supplier added');
      return supplierId;
    } catch (err) {
      console.error('Failed to add supplier:', err);
      toast.error('Failed to add supplier', {
        description: err instanceof Error ? err.message : 'Please try again',
      });
      throw err;
    }
  };

  // Get unique categories from materials for filter
  const usedCategories = useMemo(() => {
    const cats = new Set(materials.map((m) => m.category).filter(Boolean));
    return MATERIAL_CATEGORIES.filter((c) => cats.has(c.value));
  }, [materials]);

  if (loading) {
    return <MaterialsPageSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive">Failed to load materials</p>
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
          <h1 className="text-2xl font-bold">Materials Library</h1>
          <p className="text-muted-foreground">
            Manage the materials you use to make your products
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Material
        </Button>
      </div>

      {/* Filters */}
      {materials.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Category filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {usedCategories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort dropdown */}
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name A-Z</SelectItem>
              <SelectItem value="name-desc">Name Z-A</SelectItem>
              <SelectItem value="cost-high">Cost (High-Low)</SelectItem>
              <SelectItem value="cost-low">Cost (Low-High)</SelectItem>
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

      {/* Materials grid or empty state */}
      {materials.length === 0 ? (
        <EmptyState onAddMaterial={() => handleOpenDialog()} />
      ) : filteredMaterials.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No materials match your filters</p>
          <Button
            variant="link"
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('all');
              setShowFavouritesOnly(false);
              setSortBy('name-asc');
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMaterials.map((material) => (
            <MaterialCard
              key={material.id}
              material={material}
              suppliers={materialsSuppliers}
              onEdit={handleOpenDialog}
              onDelete={handleDelete}
              onToggleFavourite={handleToggleFavourite}
              onAddSupplierLink={handleAddSupplierLink}
              onUpdateStockStatus={handleUpdateStockStatus}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-0">
          {/* Header with gradient accent */}
          <div className="relative border-b bg-gradient-to-r from-emerald-500/5 to-green-500/5">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-600 rounded-t-lg" />
            <DialogHeader className="p-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20">
                  <Package className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <DialogTitle className="text-lg">
                    {editingMaterial ? 'Edit Material' : 'Add Material'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingMaterial
                      ? 'Update the details of this material'
                      : 'Add a new material to your library'}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>
          {/* Form content with proper padding */}
          <div className="p-6 pt-4">
            <MaterialForm
              material={editingMaterial || undefined}
              suppliers={suppliers}
              onSubmit={handleSubmit}
              onCancel={handleCloseDialog}
              onAddSupplier={handleQuickAddSupplier}
              isSubmitting={isSubmitting}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Empty state component
function EmptyState({ onAddMaterial }: { onAddMaterial: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed rounded-lg">
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <Package className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-1">No materials yet</h3>
      <p className="text-muted-foreground text-center max-w-sm mb-2">
        Add the materials you use to make your products. Track costs and see how
        price changes affect your profits.
      </p>
      <p className="text-xs text-muted-foreground text-center max-w-sm mb-6">
        <span className="font-medium text-primary">Materials</span>
        <span className="mx-2">→</span>
        <span>Products</span>
        <span className="mx-2">→</span>
        <span>Calculator</span>
      </p>
      <Button onClick={onAddMaterial}>
        <Plus className="w-4 h-4 mr-2" />
        Add Your First Material
      </Button>
    </div>
  );
}
