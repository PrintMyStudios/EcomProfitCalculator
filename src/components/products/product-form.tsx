'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  productSchema,
  handmadeProductSchema,
  sourcedProductSchema,
  type ProductFormValues,
  type HandmadeProductFormValues,
  type SourcedProductFormValues,
  type ProductMaterialFormValues,
  type LabourTaskFormValues,
  SOURCE_TYPE_OPTIONS,
  calculateHandmadeCost,
  calculateSourcedCost,
} from '@/lib/validations/product';
import { MaterialsSelector } from '@/components/products/materials-selector';
import { LabourTasksEditor } from '@/components/products/labour-tasks-editor';
import { useSettingsStore } from '@/stores/settings';
import { toMajorUnits, getCurrencySymbol } from '@/lib/constants/currencies';
import type { Product, Material, Supplier, HandmadeProduct, SourcedProduct } from '@/types';
import { isProductsSupplier } from '@/types';
import { cn } from '@/lib/utils';
import {
  Hammer,
  Truck,
  Package,
  Calculator,
  Loader2,
  Plus,
  X,
} from 'lucide-react';
import { VatWarning } from '@/components/vat-warning';

interface ProductFormProps {
  product?: Product | null;
  materials: Material[];
  suppliers: Supplier[];
  onSubmit: (values: ProductFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

type ProductType = 'handmade' | 'sourced';

export function ProductForm({
  product,
  materials,
  suppliers,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ProductFormProps) {
  const currency = useSettingsStore((state) => state.currency);
  const defaultHourlyRate = useSettingsStore((state) => state.defaultHourlyRate);
  const [productType, setProductType] = useState<ProductType>(
    product?.productType || 'handmade'
  );
  const [tagInput, setTagInput] = useState('');

  // Separate forms for each product type to handle discriminated union properly
  const handmadeForm = useForm<HandmadeProductFormValues>({
    resolver: zodResolver(handmadeProductSchema),
    defaultValues: getHandmadeDefaults(product as HandmadeProduct | undefined, currency, defaultHourlyRate),
  });

  const sourcedForm = useForm<SourcedProductFormValues>({
    resolver: zodResolver(sourcedProductSchema),
    defaultValues: getSourcedDefaults(product as SourcedProduct | undefined, currency),
  });

  // Watch values for cost calculation
  const watchedHandmadeMaterials = useWatch({ control: handmadeForm.control, name: 'materials' });
  const watchedHandmadeLabourTasks = useWatch({ control: handmadeForm.control, name: 'labourTasks' });
  const watchedHandmadeLabourMinutes = useWatch({ control: handmadeForm.control, name: 'labourMinutes' });
  const watchedHandmadeLabourRate = useWatch({ control: handmadeForm.control, name: 'labourRate' });
  const watchedHandmadePackaging = useWatch({ control: handmadeForm.control, name: 'packagingCost' });
  const watchedHandmadeTags = useWatch({ control: handmadeForm.control, name: 'tags' });

  const watchedSourcedCost = useWatch({ control: sourcedForm.control, name: 'supplierCost' });
  const watchedSourcedShipping = useWatch({ control: sourcedForm.control, name: 'supplierShippingCost' });
  const watchedSourcedTags = useWatch({ control: sourcedForm.control, name: 'tags' });

  // Calculate total cost
  const calculatedCost = useMemo(() => {
    if (productType === 'handmade') {
      return calculateHandmadeCost(
        watchedHandmadeMaterials || [],
        watchedHandmadeLabourTasks || [],
        watchedHandmadeLabourMinutes,
        watchedHandmadeLabourRate,
        watchedHandmadePackaging || 0
      );
    } else {
      return calculateSourcedCost(
        watchedSourcedCost || 0,
        watchedSourcedShipping || 0
      );
    }
  }, [
    productType,
    watchedHandmadeMaterials,
    watchedHandmadeLabourTasks,
    watchedHandmadeLabourMinutes,
    watchedHandmadeLabourRate,
    watchedHandmadePackaging,
    watchedSourcedCost,
    watchedSourcedShipping,
  ]);

  // Supplier options for sourced products
  const productSuppliers = useMemo(
    () => suppliers.filter(isProductsSupplier),
    [suppliers]
  );

  // Handle form submission
  const handleSubmit = async (values: HandmadeProductFormValues | SourcedProductFormValues) => {
    await onSubmit(values as ProductFormValues);
  };

  // Handle product type change
  const handleProductTypeChange = (type: ProductType) => {
    // Get common fields from the current form before switching
    const commonFields = productType === 'handmade'
      ? {
          name: handmadeForm.getValues('name'),
          sku: handmadeForm.getValues('sku'),
          notes: handmadeForm.getValues('notes'),
          tags: handmadeForm.getValues('tags'),
          isFavourite: handmadeForm.getValues('isFavourite'),
        }
      : {
          name: sourcedForm.getValues('name'),
          sku: sourcedForm.getValues('sku'),
          notes: sourcedForm.getValues('notes'),
          tags: sourcedForm.getValues('tags'),
          isFavourite: sourcedForm.getValues('isFavourite'),
        };

    setProductType(type);

    if (type === 'handmade') {
      handmadeForm.reset({
        ...getHandmadeDefaults(undefined, currency, defaultHourlyRate),
        ...commonFields,
        productType: 'handmade',
      });
    } else {
      sourcedForm.reset({
        ...getSourcedDefaults(undefined, currency),
        ...commonFields,
        productType: 'sourced',
      });
    }
  };

  // Handle tag management
  const currentTags = productType === 'handmade' ? watchedHandmadeTags : watchedSourcedTags;
  const setCurrentTags = (tags: string[]) => {
    if (productType === 'handmade') {
      handmadeForm.setValue('tags', tags);
    } else {
      sourcedForm.setValue('tags', tags);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !currentTags?.includes(tag)) {
      setCurrentTags([...(currentTags || []), tag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setCurrentTags((currentTags || []).filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="space-y-6">
      {/* Product Type Selector */}
      {!product && (
        <div className="space-y-3">
          <Label>Product Type</Label>
          <RadioGroup
            value={productType}
            onValueChange={(v) => handleProductTypeChange(v as ProductType)}
            className="grid grid-cols-2 gap-3"
          >
            <div className="relative">
              <RadioGroupItem value="handmade" id="handmade" className="peer sr-only" />
              <Label
                htmlFor="handmade"
                className={cn(
                  'flex items-center gap-3 rounded-lg border-2 p-4 cursor-pointer transition-all',
                  'hover:bg-muted/50',
                  productType === 'handmade'
                    ? 'border-amber-500 bg-amber-500/5'
                    : 'border-muted'
                )}
              >
                <Hammer className="h-5 w-5 text-amber-500" />
                <div>
                  <div className="font-medium">Handmade</div>
                  <div className="text-xs text-muted-foreground">
                    Made from materials
                  </div>
                </div>
              </Label>
            </div>
            <div className="relative">
              <RadioGroupItem value="sourced" id="sourced" className="peer sr-only" />
              <Label
                htmlFor="sourced"
                className={cn(
                  'flex items-center gap-3 rounded-lg border-2 p-4 cursor-pointer transition-all',
                  'hover:bg-muted/50',
                  productType === 'sourced'
                    ? 'border-blue-500 bg-blue-500/5'
                    : 'border-muted'
                )}
              >
                <Truck className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="font-medium">Sourced</div>
                  <div className="text-xs text-muted-foreground">
                    From supplier
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>
      )}

      {/* Handmade Product Form */}
      {productType === 'handmade' && (
        <Form {...handmadeForm}>
          <form onSubmit={handmadeForm.handleSubmit(handleSubmit)} className="space-y-6">
            <HandmadeProductFields
              form={handmadeForm}
              materials={materials}
              currency={currency}
              defaultHourlyRate={defaultHourlyRate}
            />

            {/* Common Fields */}
            <CommonProductFields
              form={handmadeForm}
              tagInput={tagInput}
              setTagInput={setTagInput}
              tags={currentTags || []}
              addTag={addTag}
              removeTag={removeTag}
            />

            {/* Cost Summary */}
            <CostSummary cost={calculatedCost} currency={currency} />

            {/* Actions */}
            <FormActions
              isSubmitting={isSubmitting}
              isEditing={!!product}
              onCancel={onCancel}
            />
          </form>
        </Form>
      )}

      {/* Sourced Product Form */}
      {productType === 'sourced' && (
        <Form {...sourcedForm}>
          <form onSubmit={sourcedForm.handleSubmit(handleSubmit)} className="space-y-6">
            <SourcedProductFields
              form={sourcedForm}
              suppliers={productSuppliers}
              currency={currency}
            />

            {/* Common Fields */}
            <CommonProductFields
              form={sourcedForm}
              tagInput={tagInput}
              setTagInput={setTagInput}
              tags={currentTags || []}
              addTag={addTag}
              removeTag={removeTag}
            />

            {/* Cost Summary */}
            <CostSummary cost={calculatedCost} currency={currency} />

            {/* Actions */}
            <FormActions
              isSubmitting={isSubmitting}
              isEditing={!!product}
              onCancel={onCancel}
            />
          </form>
        </Form>
      )}
    </div>
  );
}

// Handmade-specific fields
function HandmadeProductFields({
  form,
  materials,
  currency,
  defaultHourlyRate,
}: {
  form: ReturnType<typeof useForm<HandmadeProductFormValues>>;
  materials: Material[];
  currency: string;
  defaultHourlyRate: number;
}) {
  return (
    <>
      {/* Product Name */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product Name <span className="text-destructive">*</span></FormLabel>
            <FormControl>
              <Input placeholder="e.g., Handmade Candle - Lavender" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* VAT Warning */}
      <VatWarning />

      {/* Materials Section */}
      <div className="space-y-3">
        <Label>Materials</Label>
        <MaterialsSelector
          materials={materials}
          selectedMaterials={form.watch('materials') || []}
          onChange={(mats) => form.setValue('materials', mats)}
          currency={currency}
        />
      </div>

      {/* Labour Section */}
      <div className="space-y-3">
        <Label>Labour</Label>
        <LabourTasksEditor
          tasks={form.watch('labourTasks') || []}
          onChange={(tasks) => form.setValue('labourTasks', tasks)}
          defaultHourlyRate={defaultHourlyRate}
          currency={currency}
        />
      </div>

      {/* Packaging Cost */}
      <FormField
        control={form.control}
        name="packagingCost"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Packaging Cost</FormLabel>
            <FormControl>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  {getCurrencySymbol(currency as never)}
                </span>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="pl-8"
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

// Sourced-specific fields
function SourcedProductFields({
  form,
  suppliers,
  currency,
}: {
  form: ReturnType<typeof useForm<SourcedProductFormValues>>;
  suppliers: Supplier[];
  currency: string;
}) {
  return (
    <>
      {/* Product Name */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product Name <span className="text-destructive">*</span></FormLabel>
            <FormControl>
              <Input placeholder="e.g., Phone Case - iPhone 15" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Source Type */}
      <FormField
        control={form.control}
        name="sourceType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Source Type <span className="text-destructive">*</span></FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select source type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {SOURCE_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div>{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Supplier */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="supplierName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supplier Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., AliExpress Store" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="supplierUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supplier URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* VAT Warning */}
      <VatWarning />

      {/* Costs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="supplierCost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Cost <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    {getCurrencySymbol(currency as never)}
                  </span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="pl-8"
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="supplierShippingCost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shipping Cost</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    {getCurrencySymbol(currency as never)}
                  </span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="pl-8"
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}

// Common fields shared between both product types
function CommonProductFields<T extends { sku?: string; notes?: string }>({
  form,
  tagInput,
  setTagInput,
  tags,
  addTag,
  removeTag,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  tagInput: string;
  setTagInput: (value: string) => void;
  tags: string[];
  addTag: () => void;
  removeTag: (tag: string) => void;
}) {
  return (
    <>
      <Separator />

      {/* SKU */}
      <FormField
        control={form.control}
        name="sku"
        render={({ field }) => (
          <FormItem>
            <FormLabel>SKU / Product Code</FormLabel>
            <FormControl>
              <Input placeholder="e.g., CANDLE-LAV-001" {...field} />
            </FormControl>
            <FormDescription className="text-xs">
              Optional product identifier for your records
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Tags */}
      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Add a tag..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
          />
          <Button type="button" variant="outline" size="icon" onClick={addTag}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Notes */}
      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Notes</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Any additional notes about this product..."
                className="min-h-[80px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

// Cost summary display
function CostSummary({ cost, currency }: { cost: number; currency: string }) {
  return (
    <Card className="bg-muted/30">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Total Product Cost</span>
          </div>
          <span className="text-2xl font-bold text-primary">
            {getCurrencySymbol(currency as never)}{cost.toFixed(2)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// Form action buttons
function FormActions({
  isSubmitting,
  isEditing,
  onCancel,
}: {
  isSubmitting: boolean;
  isEditing: boolean;
  onCancel: () => void;
}) {
  return (
    <div className="flex justify-end gap-3 pt-4 border-t">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : isEditing ? (
          'Update Product'
        ) : (
          'Create Product'
        )}
      </Button>
    </div>
  );
}

// Helper functions for default values
function getHandmadeDefaults(
  product: HandmadeProduct | undefined,
  currency: string,
  defaultHourlyRate: number
): HandmadeProductFormValues {
  if (product) {
    return {
      productType: 'handmade',
      name: product.name,
      sku: product.sku || '',
      notes: product.notes || '',
      tags: product.tags || [],
      isFavourite: product.isFavourite,
      materials: product.materials?.map((m) => ({
        materialId: m.materialId,
        quantity: m.quantity,
      })) || [],
      labourTasks: product.labourTasks?.map((t) => ({
        name: t.name,
        minutes: t.minutes,
        ratePerHour: toMajorUnits(t.ratePerHour, currency as never),
      })) || [],
      labourMinutes: product.labourHours ? product.labourHours * 60 : undefined,
      labourRate: product.labourRate
        ? toMajorUnits(product.labourRate, currency as never)
        : undefined,
      packagingCost: toMajorUnits(product.packagingCost, currency as never),
    };
  }

  return {
    productType: 'handmade',
    name: '',
    sku: '',
    notes: '',
    tags: [],
    isFavourite: false,
    materials: [],
    labourTasks: [],
    packagingCost: 0,
  };
}

function getSourcedDefaults(
  product: SourcedProduct | undefined,
  currency: string
): SourcedProductFormValues {
  if (product) {
    return {
      productType: 'sourced',
      name: product.name,
      sku: product.sku || '',
      notes: product.notes || '',
      tags: product.tags || [],
      isFavourite: product.isFavourite,
      sourceType: product.sourceType,
      supplierId: product.supplierId || '',
      supplierName: product.supplierName || '',
      supplierCost: toMajorUnits(product.supplierCost, currency as never),
      supplierShippingCost: toMajorUnits(product.supplierShippingCost, currency as never),
      supplierUrl: product.supplierUrl || '',
    };
  }

  return {
    productType: 'sourced',
    name: '',
    sku: '',
    notes: '',
    tags: [],
    isFavourite: false,
    sourceType: 'dropship',
    supplierId: '',
    supplierName: '',
    supplierCost: 0,
    supplierShippingCost: 0,
    supplierUrl: '',
  };
}
