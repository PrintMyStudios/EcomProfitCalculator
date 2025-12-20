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
import { CURRENCIES } from '@/lib/constants/currencies';
import { getSupplierPlatformConfig, getSupplierTypeConfig } from '@/lib/validations/supplier';
import type { Supplier } from '@/types';
import {
  MoreVertical,
  Pencil,
  Star,
  Trash2,
  ExternalLink,
  Package,
  Truck,
  Layers,
} from 'lucide-react';

interface SupplierCardProps {
  supplier: Supplier;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
  onToggleFavourite: (supplier: Supplier) => void;
}

// Extract hostname from URL
function getHostname(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

// Get type badge color
function getTypeBadgeConfig(type: string) {
  switch (type) {
    case 'materials':
      return { color: 'bg-blue-500', icon: Package };
    case 'products':
      return { color: 'bg-purple-500', icon: Truck };
    case 'both':
      return { color: 'bg-emerald-500', icon: Layers };
    default:
      return { color: 'bg-gray-500', icon: Package };
  }
}

export function SupplierCard({
  supplier,
  onEdit,
  onDelete,
  onToggleFavourite,
}: SupplierCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const typeConfig = getSupplierTypeConfig(supplier.supplierType);
  const typeBadgeConfig = getTypeBadgeConfig(supplier.supplierType);
  const TypeIcon = typeBadgeConfig.icon;
  const platformConfig = supplier.productsFields?.platform
    ? getSupplierPlatformConfig(supplier.productsFields.platform)
    : null;
  const currencyConfig = CURRENCIES[supplier.currency];

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(supplier);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Card className={`group relative transition-all hover:shadow-md ${isDeleting ? 'opacity-50' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            {/* Main content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium truncate">{supplier.name}</h3>
                {supplier.isFavourite && (
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                )}
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                {/* Type badge */}
                <Badge className={`${typeBadgeConfig.color} text-white text-xs`}>
                  <TypeIcon className="w-3 h-3 mr-1" />
                  {typeConfig?.label || supplier.supplierType}
                </Badge>

                {/* Platform badge (for product suppliers) */}
                {platformConfig && (
                  <Badge className={`${platformConfig.color} text-white text-xs`}>
                    {platformConfig.label}
                  </Badge>
                )}

                {/* Currency badge */}
                <Badge variant="outline" className="text-xs">
                  {currencyConfig.symbol} {currencyConfig.code}
                </Badge>
              </div>

              {/* Contact info */}
              {supplier.contact?.contactName && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Contact: {supplier.contact.contactName}
                </p>
              )}

              {/* Website */}
              {supplier.website && (
                <a
                  href={supplier.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  {getHostname(supplier.website)}
                </a>
              )}

              {/* Shipping info for product suppliers */}
              {supplier.productsFields?.shipsFrom && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Ships from: {supplier.productsFields.shipsFrom}
                </p>
              )}

              {/* Lead time for materials suppliers */}
              {supplier.materialsFields?.leadTimeDays && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Lead time: {supplier.materialsFields.leadTimeDays} days
                </p>
              )}

              {/* Notes */}
              {supplier.notes && (
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {supplier.notes}
                </p>
              )}

              {/* Usage count */}
              {supplier.usageCount > 0 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Used in {supplier.usageCount} {supplier.supplierType === 'materials' ? 'material' : 'product'}
                  {supplier.usageCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            {/* Actions dropdown */}
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
                <DropdownMenuItem onClick={() => onEdit(supplier)}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggleFavourite(supplier)}>
                  <Star className="w-4 h-4 mr-2" />
                  {supplier.isFavourite ? 'Remove from Favourites' : 'Add to Favourites'}
                </DropdownMenuItem>
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
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Supplier</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{supplier.name}&quot;?
              {supplier.usageCount > 0 && (
                <span className="block mt-2 font-medium text-destructive">
                  Warning: This supplier is used in {supplier.usageCount}{' '}
                  {supplier.supplierType === 'materials' ? 'material' : 'product'}
                  {supplier.usageCount !== 1 ? 's' : ''}.
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
    </>
  );
}
