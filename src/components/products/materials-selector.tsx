'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { getCurrencySymbol } from '@/lib/constants/currencies';
import type { Material } from '@/types';
import type { ProductMaterialFormValues } from '@/lib/validations/product';
import { cn } from '@/lib/utils';
import {
  Search,
  Star,
  Plus,
  Package,
  X,
  Check,
} from 'lucide-react';

interface MaterialsSelectorProps {
  materials: Material[];
  selectedMaterials: ProductMaterialFormValues[];
  onChange: (materials: ProductMaterialFormValues[]) => void;
  currency: string;
}

export function MaterialsSelector({
  materials,
  selectedMaterials,
  onChange,
  currency,
}: MaterialsSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavouritesOnly, setShowFavouritesOnly] = useState(false);
  const [pendingQuantities, setPendingQuantities] = useState<Record<string, number>>({});

  // Filter materials based on search
  const filteredMaterials = useMemo(() => {
    return materials.filter((material) => {
      const matchesSearch =
        searchQuery === '' ||
        material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.category?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFavourite = !showFavouritesOnly || material.isFavourite;

      return matchesSearch && matchesFavourite;
    });
  }, [materials, searchQuery, showFavouritesOnly]);

  // Get selected material IDs for quick lookup
  const selectedIds = useMemo(
    () => new Set(selectedMaterials.map((m) => m.materialId)),
    [selectedMaterials]
  );

  // Toggle material selection
  const toggleMaterial = (material: Material) => {
    if (selectedIds.has(material.id)) {
      // Remove from selection
      onChange(selectedMaterials.filter((m) => m.materialId !== material.id));
    } else {
      // Add to selection with quantity from pending or default 1
      const quantity = pendingQuantities[material.id] || 1;
      onChange([
        ...selectedMaterials,
        {
          materialId: material.id,
          materialName: material.name,
          costPerUnit: material.costPerUnit,
          unit: material.unit,
          quantity,
        },
      ]);
    }
  };

  // Update quantity for a selected material
  const updateQuantity = (materialId: string, quantity: number) => {
    onChange(
      selectedMaterials.map((m) =>
        m.materialId === materialId ? { ...m, quantity: Math.max(0.01, quantity) } : m
      )
    );
  };

  // Update pending quantity (for materials not yet selected)
  const updatePendingQuantity = (materialId: string, quantity: number) => {
    setPendingQuantities((prev) => ({
      ...prev,
      [materialId]: Math.max(0.01, quantity),
    }));
  };

  // Remove a selected material
  const removeMaterial = (materialId: string) => {
    onChange(selectedMaterials.filter((m) => m.materialId !== materialId));
  };

  // Calculate total materials cost
  const totalCost = useMemo(() => {
    return selectedMaterials.reduce((sum, m) => {
      const material = materials.find((mat) => mat.id === m.materialId);
      if (!material) return sum;
      // Cost is in minor units, convert to major for display
      return sum + (material.costPerUnit / 100) * m.quantity;
    }, 0);
  }, [selectedMaterials, materials]);

  const formatCost = (cost: number) => {
    return `${getCurrencySymbol(currency as never)}${cost.toFixed(2)}`;
  };

  return (
    <div className="space-y-3">
      {/* Selected Materials Display */}
      {selectedMaterials.length > 0 && (
        <Card className="p-3">
          <div className="space-y-2">
            {selectedMaterials.map((selected) => {
              const material = materials.find((m) => m.id === selected.materialId);
              if (!material) return null;

              const lineCost = (material.costPerUnit / 100) * selected.quantity;

              return (
                <div
                  key={selected.materialId}
                  className="flex items-center gap-3 py-2 border-b last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{material.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatCost(material.costPerUnit / 100)} per {material.unit}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.1"
                      min="0.01"
                      value={selected.quantity}
                      onChange={(e) =>
                        updateQuantity(
                          selected.materialId,
                          parseFloat(e.target.value) || 0.01
                        )
                      }
                      className="w-20 text-center"
                    />
                    <span className="text-sm text-muted-foreground w-12">
                      {material.unit}
                    </span>
                    <span className="text-sm font-medium w-20 text-right">
                      {formatCost(lineCost)}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeMaterial(selected.materialId)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
            <div className="flex justify-between pt-2 font-medium">
              <span>Total Materials Cost</span>
              <span className="text-primary">{formatCost(totalCost)}</span>
            </div>
          </div>
        </Card>
      )}

      {/* Add Materials Button */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" className="w-full gap-2">
            <Plus className="h-4 w-4" />
            {selectedMaterials.length === 0
              ? 'Select Materials from Library'
              : 'Add More Materials'}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Select Materials</DialogTitle>
            <DialogDescription>
              Choose materials from your library and set quantities
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search materials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                type="button"
                variant={showFavouritesOnly ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowFavouritesOnly(!showFavouritesOnly)}
                className="gap-1"
              >
                <Star className={cn('h-4 w-4', showFavouritesOnly && 'fill-current')} />
                Favourites
              </Button>
            </div>

            {/* Materials List */}
            <ScrollArea className="h-[400px] pr-4">
              {materials.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No materials yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Add materials to your library first to use them in products.
                  </p>
                </div>
              ) : filteredMaterials.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Search className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No matching materials</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search or filters.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredMaterials.map((material) => {
                    const isSelected = selectedIds.has(material.id);
                    const currentQty = isSelected
                      ? selectedMaterials.find((m) => m.materialId === material.id)?.quantity ||
                        1
                      : pendingQuantities[material.id] || 1;
                    const lineCost = (material.costPerUnit / 100) * currentQty;

                    return (
                      <div
                        key={material.id}
                        className={cn(
                          'flex items-center gap-3 p-3 rounded-lg border transition-colors',
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-muted hover:border-muted-foreground/20'
                        )}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleMaterial(material)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate">{material.name}</span>
                            {material.isFavourite && (
                              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{formatCost(material.costPerUnit / 100)} per {material.unit}</span>
                            {material.category && (
                              <>
                                <span>•</span>
                                <Badge variant="outline" className="text-xs">
                                  {material.category}
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`qty-${material.id}`} className="sr-only">
                            Quantity
                          </Label>
                          <Input
                            id={`qty-${material.id}`}
                            type="number"
                            step="0.1"
                            min="0.01"
                            value={currentQty}
                            onChange={(e) => {
                              const qty = parseFloat(e.target.value) || 0.01;
                              if (isSelected) {
                                updateQuantity(material.id, qty);
                              } else {
                                updatePendingQuantity(material.id, qty);
                              }
                            }}
                            className="w-20 text-center"
                          />
                          <span className="text-sm text-muted-foreground w-12">
                            {material.unit}
                          </span>
                          <span className="text-sm font-medium w-20 text-right">
                            {formatCost(lineCost)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                {selectedMaterials.length} material{selectedMaterials.length !== 1 ? 's' : ''}{' '}
                selected
              </div>
              <Button type="button" onClick={() => setIsOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Empty State */}
      {selectedMaterials.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-2">
          No materials added yet. Click the button above to select from your library.
        </p>
      )}
    </div>
  );
}
