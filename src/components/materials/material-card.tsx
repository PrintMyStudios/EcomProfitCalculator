'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { AddSupplierLinkDialog } from './add-supplier-link-dialog';
import { useSettingsStore } from '@/stores/settings';
import { formatCurrency, getCurrencySymbol, toMajorUnits } from '@/lib/constants/currencies';
import { MATERIAL_CATEGORIES } from '@/lib/validations/material';
import { getStockStatusConfig } from '@/lib/validations/material-supplier-link';
import type { MaterialSupplierLinkFormValues } from '@/lib/validations/material-supplier-link';
import type { Material, Supplier, MaterialSupplierLink, StockStatus } from '@/types';
import { getPreferredSupplierLink } from '@/types';
import {
  MoreVertical,
  Pencil,
  Star,
  Trash2,
  Link2,
  Package,
  AlertTriangle,
} from 'lucide-react';

interface MaterialCardProps {
  material: Material;
  suppliers?: Supplier[];
  onEdit: (material: Material) => void;
  onDelete: (material: Material) => void;
  onToggleFavourite: (material: Material) => void;
  onAddSupplierLink?: (materialId: string, data: MaterialSupplierLinkFormValues) => Promise<void>;
  onUpdateStockStatus?: (materialId: string, linkId: string, status: StockStatus) => Promise<void>;
}

export function MaterialCard({
  material,
  suppliers = [],
  onEdit,
  onDelete,
  onToggleFavourite,
  onAddSupplierLink,
  onUpdateStockStatus,
}: MaterialCardProps) {
  const currency = useSettingsStore((state) => state.currency);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddSupplierDialog, setShowAddSupplierDialog] = useState(false);
  const [isAddingSupplier, setIsAddingSupplier] = useState(false);

  const categoryLabel = MATERIAL_CATEGORIES.find(
    (c) => c.value === material.category
  )?.label;

  const preferredLink = getPreferredSupplierLink(material.supplierLinks);
  const hasStockIssue = preferredLink &&
    (preferredLink.stockStatus === 'low_stock' || preferredLink.stockStatus === 'out_of_stock');
  const stockConfig = preferredLink ? getStockStatusConfig(preferredLink.stockStatus) : null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(material);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleAddSupplier = async (data: MaterialSupplierLinkFormValues) => {
    if (!onAddSupplierLink) return;
    setIsAddingSupplier(true);
    try {
      await onAddSupplierLink(material.id, data);
      setShowAddSupplierDialog(false);
    } finally {
      setIsAddingSupplier(false);
    }
  };

  const existingSupplierIds = material.supplierLinks.map((l) => l.supplierId);

  return (
    <>
      <Card className={`group relative transition-all hover:shadow-md ${isDeleting ? 'opacity-50' : ''} ${hasStockIssue ? 'ring-1 ring-yellow-500/50' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            {/* Main content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium truncate">{material.name}</h3>
                {material.isFavourite && (
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                )}
                {hasStockIssue && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Preferred supplier: {stockConfig?.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>

              <div className="mt-1 text-lg font-semibold text-primary">
                {formatCurrency(material.costPerUnit, currency)}
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  / {material.unit}
                </span>
              </div>

              {/* Badges row */}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {categoryLabel && (
                  <Badge variant="secondary" className="text-xs">
                    {categoryLabel}
                  </Badge>
                )}

                {/* Supplier links count badge */}
                {material.supplierLinks.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    <Link2 className="w-3 h-3 mr-1" />
                    {material.supplierLinks.length} supplier{material.supplierLinks.length !== 1 ? 's' : ''}
                  </Badge>
                )}

                {/* Preferred supplier stock status */}
                {preferredLink && stockConfig && (
                  <Badge
                    variant="outline"
                    className={`text-xs ${stockConfig.color} text-white`}
                  >
                    <Package className="w-3 h-3 mr-1" />
                    {stockConfig.label}
                  </Badge>
                )}

                {/* Legacy supplier display */}
                {!preferredLink && material.supplier && (
                  <Badge variant="outline" className="text-xs">
                    {material.supplier}
                  </Badge>
                )}
              </div>

              {/* Preferred supplier info */}
              {preferredLink && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {preferredLink.supplierName}: {getCurrencySymbol(preferredLink.currency)}
                  {toMajorUnits(preferredLink.costPerUnit, preferredLink.currency).toFixed(2)}
                  {preferredLink.sku && ` (${preferredLink.sku})`}
                </p>
              )}

              {material.notes && (
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {material.notes}
                </p>
              )}

              {material.usageCount > 0 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Used in {material.usageCount} product{material.usageCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-start gap-1">
              {/* Quick add supplier button */}
              {onAddSupplierLink && suppliers.length > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                        onClick={() => setShowAddSupplierDialog(true)}
                      >
                        <Link2 className="w-4 h-4" />
                        <span className="sr-only">Link supplier</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Link a supplier</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {/* More actions dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-40 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="w-4 h-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(material)}>
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onToggleFavourite(material)}>
                    <Star className="w-4 h-4 mr-2" />
                    {material.isFavourite ? 'Remove from Favourites' : 'Add to Favourites'}
                  </DropdownMenuItem>
                  {onAddSupplierLink && suppliers.length > 0 && (
                    <DropdownMenuItem onClick={() => setShowAddSupplierDialog(true)}>
                      <Link2 className="w-4 h-4 mr-2" />
                      Link Supplier
                    </DropdownMenuItem>
                  )}

                  {/* Quick stock status updates for preferred supplier */}
                  {preferredLink && onUpdateStockStatus && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onUpdateStockStatus(material.id, preferredLink.id, 'in_stock')}
                        disabled={preferredLink.stockStatus === 'in_stock'}
                      >
                        <Package className="w-4 h-4 mr-2 text-green-500" />
                        Mark In Stock
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onUpdateStockStatus(material.id, preferredLink.id, 'low_stock')}
                        disabled={preferredLink.stockStatus === 'low_stock'}
                      >
                        <Package className="w-4 h-4 mr-2 text-yellow-500" />
                        Mark Low Stock
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onUpdateStockStatus(material.id, preferredLink.id, 'out_of_stock')}
                        disabled={preferredLink.stockStatus === 'out_of_stock'}
                      >
                        <Package className="w-4 h-4 mr-2 text-red-500" />
                        Mark Out of Stock
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Material</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{material.name}&quot;?
              {material.usageCount > 0 && (
                <span className="block mt-2 font-medium text-destructive">
                  Warning: This material is used in {material.usageCount} product{material.usageCount !== 1 ? 's' : ''}.
                </span>
              )}
              <span className="block mt-2">This action cannot be undone.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add supplier link dialog */}
      {onAddSupplierLink && (
        <AddSupplierLinkDialog
          open={showAddSupplierDialog}
          onOpenChange={setShowAddSupplierDialog}
          suppliers={suppliers}
          materialCurrency={currency}
          existingSupplierIds={existingSupplierIds}
          onSubmit={handleAddSupplier}
          isSubmitting={isAddingSupplier}
        />
      )}
    </>
  );
}
