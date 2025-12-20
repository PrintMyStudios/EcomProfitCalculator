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
import { getStockStatusConfig, getQualityRatingConfig } from '@/lib/validations/material-supplier-link';
import { getCurrencySymbol, toMajorUnits } from '@/lib/constants/currencies';
import type { MaterialSupplierLink, Currency } from '@/types';
import {
  MoreVertical,
  Star,
  Pencil,
  Trash2,
  ExternalLink,
  Check,
  Package,
} from 'lucide-react';

interface SupplierLinkCardProps {
  link: MaterialSupplierLink;
  materialCurrency: Currency;
  onEdit: (link: MaterialSupplierLink) => void;
  onDelete: (linkId: string) => void;
  onSetPreferred: (linkId: string) => void;
  onUpdateStock: (linkId: string, status: MaterialSupplierLink['stockStatus']) => void;
}

export function SupplierLinkCard({
  link,
  materialCurrency,
  onEdit,
  onDelete,
  onSetPreferred,
  onUpdateStock,
}: SupplierLinkCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const stockConfig = getStockStatusConfig(link.stockStatus);
  const qualityConfig = link.qualityRating ? getQualityRatingConfig(link.qualityRating) : null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(link.id);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  // Format cost in the link's currency
  const formattedCost = `${getCurrencySymbol(link.currency)}${toMajorUnits(link.costPerUnit, link.currency).toFixed(2)}`;

  return (
    <>
      <Card className={`group relative transition-all hover:shadow-sm ${link.isPreferred ? 'ring-2 ring-emerald-500 ring-offset-1' : ''}`}>
        <CardContent className="p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              {/* Header row: supplier name + preferred badge */}
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm truncate">{link.supplierName}</span>
                {link.isPreferred && (
                  <Badge className="bg-emerald-500 text-white text-[10px] px-1.5 py-0">
                    <Check className="w-3 h-3 mr-0.5" />
                    Preferred
                  </Badge>
                )}
              </div>

              {/* Cost + Currency warning if different */}
              <div className="mt-1 flex items-center gap-2">
                <span className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                  {formattedCost}
                </span>
                {link.currency !== materialCurrency && (
                  <span className="text-[10px] text-muted-foreground">
                    ({link.currency})
                  </span>
                )}
                {link.packSize && link.packSize > 1 && (
                  <span className="text-xs text-muted-foreground">
                    / pack of {link.packSize}
                  </span>
                )}
              </div>

              {/* SKU */}
              {link.sku && (
                <p className="text-xs text-muted-foreground mt-1">
                  SKU: {link.sku}
                </p>
              )}

              {/* Badges row: stock status + quality */}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {/* Stock status */}
                <Badge
                  variant="outline"
                  className={`text-[10px] ${stockConfig?.color.replace('bg-', 'border-')} ${stockConfig?.color} text-white`}
                >
                  <Package className="w-2.5 h-2.5 mr-0.5" />
                  {stockConfig?.label || 'Unknown'}
                </Badge>

                {/* Quality rating */}
                {qualityConfig && (
                  <Badge variant="outline" className="text-[10px]">
                    <Star className="w-2.5 h-2.5 mr-0.5 fill-yellow-400 text-yellow-400" />
                    {link.qualityRating}/5
                  </Badge>
                )}

                {/* MOQ */}
                {link.minimumOrderQuantity && link.minimumOrderQuantity > 1 && (
                  <Badge variant="outline" className="text-[10px]">
                    MOQ: {link.minimumOrderQuantity}
                  </Badge>
                )}
              </div>

              {/* Product URL */}
              {link.productUrl && (
                <a
                  href={link.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  View product
                </a>
              )}
            </div>

            {/* Actions dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-40 group-hover:opacity-100 focus:opacity-100"
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {!link.isPreferred && (
                  <DropdownMenuItem onClick={() => onSetPreferred(link.id)}>
                    <Check className="w-4 h-4 mr-2" />
                    Set as Preferred
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onEdit(link)}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onUpdateStock(link.id, 'in_stock')}>
                  <Package className="w-4 h-4 mr-2 text-green-500" />
                  Mark In Stock
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdateStock(link.id, 'low_stock')}>
                  <Package className="w-4 h-4 mr-2 text-yellow-500" />
                  Mark Low Stock
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdateStock(link.id, 'out_of_stock')}>
                  <Package className="w-4 h-4 mr-2 text-red-500" />
                  Mark Out of Stock
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Delete confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Supplier Link</AlertDialogTitle>
            <AlertDialogDescription>
              Remove &quot;{link.supplierName}&quot; from this material? This won&apos;t
              delete the supplier itself.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isDeleting ? 'Removing...' : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
