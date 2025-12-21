'use client';

import { useState, useMemo, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  materialSchema,
  type MaterialFormValues,
  type CostEntryMode,
  MATERIAL_UNITS,
  MATERIAL_CATEGORIES,
} from '@/lib/validations/material';
import { useSettingsStore } from '@/stores/settings';
import { toMinorUnits, toMajorUnits, getCurrencySymbol, CURRENCIES } from '@/lib/constants/currencies';
import type { Material, Supplier, Currency } from '@/types';
import { isMaterialsSupplier } from '@/types';
import { Check, ChevronsUpDown, Plus, Building2, Loader2, Calculator, Receipt } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VatWarning } from '@/components/vat-warning';

interface MaterialFormProps {
  material?: Material;
  suppliers?: Supplier[];
  onSubmit: (values: MaterialFormValues) => Promise<void>;
  onCancel: () => void;
  onAddSupplier?: (data: QuickSupplierData) => Promise<string>;
  isSubmitting?: boolean;
}

// Simplified supplier data for quick-add
export interface QuickSupplierData {
  name: string;
  website?: string;
  currency: Currency;
}

export function MaterialForm({
  material,
  suppliers = [],
  onSubmit,
  onCancel,
  onAddSupplier,
  isSubmitting = false,
}: MaterialFormProps) {
  const currency = useSettingsStore((state) => state.currency);
  const [supplierOpen, setSupplierOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [isAddingSupplier, setIsAddingSupplier] = useState(false);
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newSupplierWebsite, setNewSupplierWebsite] = useState('');
  const [newSupplierCurrency, setNewSupplierCurrency] = useState<Currency>(currency);

  // Filter to materials suppliers only
  const materialsSuppliers = useMemo(
    () => suppliers.filter(isMaterialsSupplier),
    [suppliers]
  );

  const form = useForm<MaterialFormValues>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      name: material?.name || '',
      unit: material?.unit || 'piece',
      costEntryMode: 'per_unit' as CostEntryMode,
      costPerUnit: material ? toMajorUnits(material.costPerUnit, currency) : 0,
      bulkQuantity: undefined,
      bulkTotalPaid: undefined,
      supplier: material?.supplier || '',
      supplierSku: material?.supplierSku || '',
      category: material?.category || '',
      notes: material?.notes || '',
    },
  });

  // Watch bulk fields to auto-calculate cost per unit
  const costEntryMode = useWatch({ control: form.control, name: 'costEntryMode' });
  const bulkQuantity = useWatch({ control: form.control, name: 'bulkQuantity' });
  const bulkTotalPaid = useWatch({ control: form.control, name: 'bulkTotalPaid' });

  // Auto-calculate cost per unit when in bulk mode
  useEffect(() => {
    if (costEntryMode === 'bulk_purchase' && bulkQuantity && bulkQuantity > 0 && bulkTotalPaid !== undefined) {
      const calculatedCost = bulkTotalPaid / bulkQuantity;
      form.setValue('costPerUnit', Math.round(calculatedCost * 10000) / 10000); // 4 decimal places
    }
  }, [costEntryMode, bulkQuantity, bulkTotalPaid, form]);

  const handleSubmit = async (values: MaterialFormValues) => {
    // Convert cost to minor units before submitting
    const transformedValues = {
      ...values,
      costPerUnit: toMinorUnits(values.costPerUnit, currency),
    };
    await onSubmit(transformedValues);
    // Reset form after successful submit (for new materials)
    if (!material) {
      form.reset();
    }
  };

  const handleQuickAddSupplier = async () => {
    if (!onAddSupplier || !newSupplierName.trim()) return;

    setIsAddingSupplier(true);
    try {
      await onAddSupplier({
        name: newSupplierName.trim(),
        website: newSupplierWebsite.trim() || undefined,
        currency: newSupplierCurrency,
      });
      // Set the newly created supplier as the selected value
      form.setValue('supplier', newSupplierName.trim());
      setQuickAddOpen(false);
      setNewSupplierName('');
      setNewSupplierWebsite('');
      setNewSupplierCurrency(currency);
    } finally {
      setIsAddingSupplier(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Basic Info Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <svg
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              Basic Information
            </div>

            {/* VAT Warning */}
            <VatWarning />

            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Material Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="m7.5 4.27 9 5.15" />
                        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                      </svg>
                      <Input
                        placeholder="e.g., Acrylic Paint - Red"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Unit */}
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Unit <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MATERIAL_UNITS.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cost Entry Mode Toggle */}
            <FormField
              control={form.control}
              name="costEntryMode"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>
                    How are you adding this material? <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                    >
                      <div className="relative">
                        <RadioGroupItem
                          value="per_unit"
                          id="per_unit"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="per_unit"
                          className={cn(
                            "flex items-center gap-3 rounded-lg border-2 p-4 cursor-pointer transition-all",
                            "hover:bg-muted/50",
                            field.value === 'per_unit'
                              ? "border-emerald-500 bg-emerald-500/5"
                              : "border-muted"
                          )}
                        >
                          <Calculator className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">Single unit cost</div>
                            <div className="text-xs text-muted-foreground">
                              I know the per-unit price
                            </div>
                          </div>
                        </Label>
                      </div>
                      <div className="relative">
                        <RadioGroupItem
                          value="bulk_purchase"
                          id="bulk_purchase"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="bulk_purchase"
                          className={cn(
                            "flex items-center gap-3 rounded-lg border-2 p-4 cursor-pointer transition-all",
                            "hover:bg-muted/50",
                            field.value === 'bulk_purchase'
                              ? "border-emerald-500 bg-emerald-500/5"
                              : "border-muted"
                          )}
                        >
                          <Receipt className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">Bulk purchase</div>
                            <div className="text-xs text-muted-foreground">
                              I bought a quantity for a total
                            </div>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Per Unit Cost (shown when per_unit mode) */}
            {costEntryMode === 'per_unit' && (
              <FormField
                control={form.control}
                name="costPerUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Cost per Unit <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                          {getCurrencySymbol(currency)}
                        </span>
                        <Input
                          type="number"
                          step="0.0001"
                          min="0"
                          placeholder="0.00"
                          className="pl-8"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Bulk Purchase Fields (shown when bulk_purchase mode) */}
            {costEntryMode === 'bulk_purchase' && (
              <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-dashed">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="bulkQuantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Quantity Purchased <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="1"
                            min="1"
                            placeholder="e.g., 50"
                            {...field}
                            value={field.value ?? ''}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          How many units did you buy?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bulkTotalPaid"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Total Paid <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                              {getCurrencySymbol(currency)}
                            </span>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              className="pl-8"
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                            />
                          </div>
                        </FormControl>
                        <FormDescription className="text-xs">
                          Total amount you paid
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Calculated Cost Per Unit Display */}
                {bulkQuantity && bulkQuantity > 0 && bulkTotalPaid !== undefined && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                        Cost per unit:
                      </span>
                    </div>
                    <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                      {getCurrencySymbol(currency)}
                      {(bulkTotalPaid / bulkQuantity).toFixed(4)}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">
                    Category <span className="text-xs font-normal">(optional)</span>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === 'none' ? '' : value)}
                    value={field.value || 'none'}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">No category</SelectItem>
                      {MATERIAL_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Supplier Details Section */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <svg
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M16 16h6M19 13v6M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" />
              </svg>
              Supplier Details
              <span className="text-xs font-normal">(optional)</span>
            </div>

            {/* Supplier with combobox and quick-add */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="supplier"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-muted-foreground">Supplier</FormLabel>
                    <div className="flex gap-2">
                      <Popover open={supplierOpen} onOpenChange={setSupplierOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={supplierOpen}
                              className={cn(
                                'flex-1 justify-between font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              <span className="truncate">
                                {field.value || 'Select or type supplier...'}
                              </span>
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0" align="start">
                          <Command>
                            <CommandInput
                              placeholder="Search or type supplier..."
                              value={field.value}
                              onValueChange={(value) => {
                                field.onChange(value);
                              }}
                            />
                            <CommandList>
                              <CommandEmpty>
                                <div className="py-2 text-center text-sm">
                                  <p className="text-muted-foreground">No supplier found.</p>
                                  {field.value && (
                                    <p className="mt-1">
                                      Using: <span className="font-medium">{field.value}</span>
                                    </p>
                                  )}
                                </div>
                              </CommandEmpty>
                              {materialsSuppliers.length > 0 && (
                                <CommandGroup heading="Your Suppliers">
                                  {materialsSuppliers.map((supplier) => (
                                    <CommandItem
                                      key={supplier.id}
                                      value={supplier.name}
                                      onSelect={(currentValue) => {
                                        field.onChange(currentValue);
                                        setSupplierOpen(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          field.value === supplier.name
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                        )}
                                      />
                                      <div className="flex flex-col">
                                        <span>{supplier.name}</span>
                                        {supplier.website && (
                                          <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                                            {supplier.website.replace(/^https?:\/\//, '')}
                                          </span>
                                        )}
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              )}
                              {onAddSupplier && (
                                <>
                                  <CommandSeparator />
                                  <CommandGroup>
                                    <CommandItem
                                      onSelect={() => {
                                        setNewSupplierName(field.value || '');
                                        setSupplierOpen(false);
                                        setQuickAddOpen(true);
                                      }}
                                      className="text-emerald-600 dark:text-emerald-400"
                                    >
                                      <Plus className="mr-2 h-4 w-4" />
                                      Add new supplier...
                                    </CommandItem>
                                  </CommandGroup>
                                </>
                              )}
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      {onAddSupplier && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setNewSupplierName('');
                            setQuickAddOpen(true);
                          }}
                          title="Add new supplier"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplierSku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">SKU / Product Code</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <svg
                          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M3 5v14" />
                          <path d="M8 5v14" />
                          <path d="M12 5v14" />
                          <path d="M17 5v14" />
                          <path d="M21 5v14" />
                        </svg>
                        <Input
                          placeholder="e.g., AP-RED-100ML"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <svg
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" x2="8" y1="13" y2="13" />
                <line x1="16" x2="8" y1="17" y2="17" />
              </svg>
              Notes
              <span className="text-xs font-normal">(optional)</span>
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional notes about this material..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white border-0"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Saving...
                </>
              ) : material ? (
                'Update Material'
              ) : (
                'Add Material'
              )}
            </Button>
          </div>
        </form>
      </Form>

      {/* Quick Add Supplier Dialog */}
      <Dialog open={quickAddOpen} onOpenChange={setQuickAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20">
                <Building2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <DialogTitle>Add Supplier</DialogTitle>
                <DialogDescription>
                  Quickly add a new materials supplier
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Supplier Name <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="e.g., Hobby Craft, Amazon"
                value={newSupplierName}
                onChange={(e) => setNewSupplierName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Currency</label>
                <Select
                  value={newSupplierCurrency}
                  onValueChange={(value) => setNewSupplierCurrency(value as Currency)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(CURRENCIES) as Currency[]).map((code) => (
                      <SelectItem key={code} value={code}>
                        {CURRENCIES[code].symbol} {code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Website</label>
                <Input
                  type="url"
                  placeholder="https://..."
                  value={newSupplierWebsite}
                  onChange={(e) => setNewSupplierWebsite(e.target.value)}
                />
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              You can add more details later from the Suppliers page.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setQuickAddOpen(false)}
                disabled={isAddingSupplier}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleQuickAddSupplier}
                disabled={!newSupplierName.trim() || isAddingSupplier}
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white border-0"
              >
                {isAddingSupplier ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Supplier'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
