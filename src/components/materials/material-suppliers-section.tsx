'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SupplierLinkCard } from './supplier-link-card';
import { AddSupplierLinkDialog } from './add-supplier-link-dialog';
import type { MaterialSupplierLink, Supplier, Currency } from '@/types';
import type { MaterialSupplierLinkFormValues } from '@/lib/validations/material-supplier-link';
import { Plus, Package, Link2 } from 'lucide-react';

interface MaterialSuppliersSectionProps {
  supplierLinks: MaterialSupplierLink[];
  materialCurrency: Currency;
  suppliers: Supplier[];
  onAddLink: (data: MaterialSupplierLinkFormValues) => Promise<void>;
  onUpdateLink: (linkId: string, data: Partial<MaterialSupplierLinkFormValues>) => Promise<void>;
  onRemoveLink: (linkId: string) => Promise<void>;
  onSetPreferred: (linkId: string) => Promise<void>;
  onUpdateStock: (linkId: string, status: MaterialSupplierLink['stockStatus']) => Promise<void>;
  isLoading?: boolean;
}

export function MaterialSuppliersSection({
  supplierLinks,
  materialCurrency,
  suppliers,
  onAddLink,
  onUpdateLink,
  onRemoveLink,
  onSetPreferred,
  onUpdateStock,
  isLoading = false,
}: MaterialSuppliersSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<MaterialSupplierLink | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const existingSupplierIds = supplierLinks.map((l) => l.supplierId);

  const handleOpenAdd = () => {
    setEditingLink(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (link: MaterialSupplierLink) => {
    setEditingLink(link);
    setDialogOpen(true);
  };

  const handleSubmit = async (data: MaterialSupplierLinkFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingLink) {
        await onUpdateLink(editingLink.id, data);
      } else {
        await onAddLink(data);
      }
      setDialogOpen(false);
      setEditingLink(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Link2 className="h-4 w-4" />
          Suppliers
          {supplierLinks.length > 0 && (
            <span className="text-xs">({supplierLinks.length})</span>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleOpenAdd}
          disabled={isLoading}
          className="h-7 text-xs"
        >
          <Plus className="w-3 h-3 mr-1" />
          Link Supplier
        </Button>
      </div>

      {/* Supplier links list or empty state */}
      {supplierLinks.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed p-4 text-center">
          <Package className="h-6 w-6 mx-auto text-muted-foreground/50" />
          <p className="mt-2 text-sm text-muted-foreground">
            No suppliers linked yet
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Link suppliers to track different prices and availability
          </p>
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={handleOpenAdd}
            className="mt-2 text-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add your first supplier
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {supplierLinks.map((link) => (
            <SupplierLinkCard
              key={link.id}
              link={link}
              materialCurrency={materialCurrency}
              onEdit={handleOpenEdit}
              onDelete={onRemoveLink}
              onSetPreferred={onSetPreferred}
              onUpdateStock={onUpdateStock}
            />
          ))}
        </div>
      )}

      {/* Add/Edit dialog */}
      <AddSupplierLinkDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingLink(null);
        }}
        suppliers={suppliers}
        materialCurrency={materialCurrency}
        existingLink={editingLink || undefined}
        existingSupplierIds={existingSupplierIds}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
