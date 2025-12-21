'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useProducts } from '@/hooks/use-products';
import { useMaterials } from '@/hooks/use-materials';
import { useSuppliers } from '@/hooks/use-suppliers';
import { ProductForm } from '@/components/products/product-form';
import { useSettingsStore } from '@/stores/settings';
import { toMajorUnits, getCurrencySymbol } from '@/lib/constants/currencies';
import type { Product } from '@/types';
import type { ProductFormValues, ProductType } from '@/lib/validations/product';
import { toast } from 'sonner';
import {
  Plus,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  Star,
  Package,
  Hammer,
  Truck,
  Calculator,
  Filter,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ProductsPageSkeleton } from '@/components/skeletons';

type FilterType = 'all' | 'handmade' | 'sourced' | 'favourites';

export default function ProductsPage() {
  const { products, isLoading, addProduct, updateProduct, deleteProduct, toggleFavourite } = useProducts();
  const { materials } = useMaterials();
  const { suppliers } = useSuppliers();
  const currency = useSettingsStore((state) => state.currency);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter products based on search and filter type
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search filter
      const matchesSearch =
        searchQuery === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      // Type filter
      let matchesType = true;
      switch (filterType) {
        case 'handmade':
          matchesType = product.productType === 'handmade';
          break;
        case 'sourced':
          matchesType = product.productType === 'sourced';
          break;
        case 'favourites':
          matchesType = product.isFavourite;
          break;
        default:
          matchesType = true;
      }

      return matchesSearch && matchesType;
    });
  }, [products, searchQuery, filterType]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;

    try {
      await deleteProduct(deletingProduct.id);
      toast.success('Product deleted');
      setDeletingProduct(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleToggleFavourite = async (product: Product) => {
    try {
      await toggleFavourite(product.id, !product.isFavourite);
      toast.success(product.isFavourite ? 'Removed from favourites' : 'Added to favourites');
    } catch (error) {
      console.error('Error toggling favourite:', error);
      toast.error('Failed to update favourite');
    }
  };

  const handleFormSubmit = async (values: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, values);
        toast.success('Product updated');
      } else {
        await addProduct(values);
        toast.success('Product created');
      }
      setIsFormOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(editingProduct ? 'Failed to update product' : 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCost = (costInMinorUnits: number) => {
    const major = toMajorUnits(costInMinorUnits, currency);
    return `${getCurrencySymbol(currency)}${major.toFixed(2)}`;
  };

  // Stats for the page
  const stats = useMemo(() => {
    const handmadeCount = products.filter((p) => p.productType === 'handmade').length;
    const sourcedCount = products.filter((p) => p.productType === 'sourced').length;
    const favouritesCount = products.filter((p) => p.isFavourite).length;
    const avgCost =
      products.length > 0
        ? products.reduce((sum, p) => sum + p.calculatedCost, 0) / products.length
        : 0;

    return { handmadeCount, sourcedCount, favouritesCount, avgCost };
  }, [products]);

  if (isLoading) {
    return <ProductsPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Products</h1>
          <p className="text-muted-foreground">
            Manage your products and their costs
          </p>
        </div>
        <Button onClick={handleAddProduct} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Products</CardDescription>
            <CardTitle className="text-2xl">{products.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Handmade</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Hammer className="h-5 w-5 text-amber-500" />
              {stats.handmadeCount}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Sourced</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-500" />
              {stats.sourcedCount}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg. Cost</CardDescription>
            <CardTitle className="text-2xl">{formatCost(stats.avgCost)}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Tabs value={filterType} onValueChange={(v) => setFilterType(v as FilterType)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="handmade" className="gap-1">
              <Hammer className="h-3 w-3" />
              Handmade
            </TabsTrigger>
            <TabsTrigger value="sourced" className="gap-1">
              <Truck className="h-3 w-3" />
              Sourced
            </TabsTrigger>
            <TabsTrigger value="favourites" className="gap-1">
              <Star className="h-3 w-3" />
              Favourites
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-5 w-3/4 bg-muted rounded" />
                <div className="h-4 w-1/2 bg-muted rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-1/3 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {products.length === 0 ? 'No products yet' : 'No matching products'}
            </h3>
            <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
              {products.length === 0
                ? 'Create your first product to start calculating profits. Products can be handmade (from materials) or sourced (from suppliers).'
                : 'Try adjusting your search or filters.'}
            </p>
            {products.length === 0 && (
              <Button onClick={handleAddProduct} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Product
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className={cn(
                'group relative transition-all hover:shadow-md',
                product.isFavourite && 'ring-1 ring-amber-500/20'
              )}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate">{product.name}</CardTitle>
                    {product.sku && (
                      <CardDescription className="truncate">SKU: {product.sku}</CardDescription>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleToggleFavourite(product)}
                    >
                      <Star
                        className={cn(
                          'h-4 w-4',
                          product.isFavourite
                            ? 'fill-amber-500 text-amber-500'
                            : 'text-muted-foreground'
                        )}
                      />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/calculator?productId=${product.id}`}>
                            <Calculator className="h-4 w-4 mr-2" />
                            Use in Calculator
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeletingProduct(product)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge
                    variant={product.productType === 'handmade' ? 'default' : 'secondary'}
                    className="gap-1"
                  >
                    {product.productType === 'handmade' ? (
                      <>
                        <Hammer className="h-3 w-3" />
                        Handmade
                      </>
                    ) : (
                      <>
                        <Truck className="h-3 w-3" />
                        Sourced
                      </>
                    )}
                  </Badge>
                  <div className="text-right">
                    <div className="text-lg font-bold">{formatCost(product.calculatedCost)}</div>
                    <div className="text-xs text-muted-foreground">product cost</div>
                  </div>
                </div>
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {product.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {product.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{product.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Product Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? 'Update the details of your product.'
                : 'Create a new product to track its costs.'}
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            product={editingProduct}
            materials={materials}
            suppliers={suppliers}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingProduct} onOpenChange={(open) => !open && setDeletingProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingProduct?.name}&quot;? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProduct}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
