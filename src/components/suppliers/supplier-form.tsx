'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  supplierSchema,
  type SupplierFormValues,
  SUPPLIER_TYPES,
  SUPPLIER_PLATFORMS,
} from '@/lib/validations/supplier';
import { CURRENCIES, getCurrencySymbol, toMajorUnits, toMinorUnits } from '@/lib/constants/currencies';
import { useSettingsStore } from '@/stores/settings';
import type { Supplier, Currency, SupplierType } from '@/types';
import {
  Package,
  Truck,
  User,
  Mail,
  Phone,
  Globe,
  Building2,
  Clock,
  CreditCard,
  Loader2,
} from 'lucide-react';

interface SupplierFormProps {
  supplier?: Supplier;
  onSubmit: (values: SupplierFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function SupplierForm({
  supplier,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: SupplierFormProps) {
  const userCurrency = useSettingsStore((state) => state.currency);

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: supplier?.name || '',
      supplierType: supplier?.supplierType || 'materials',
      currency: supplier?.currency || userCurrency,
      website: supplier?.website || '',
      notes: supplier?.notes || '',
      contact: {
        contactName: supplier?.contact?.contactName || '',
        email: supplier?.contact?.email || '',
        phone: supplier?.contact?.phone || '',
      },
      materialsFields: {
        accountNumber: supplier?.materialsFields?.accountNumber || '',
        customerReference: supplier?.materialsFields?.customerReference || '',
        minimumOrderValue: supplier?.materialsFields?.minimumOrderValue
          ? toMajorUnits(supplier.materialsFields.minimumOrderValue, supplier.currency)
          : undefined,
        leadTimeDays: supplier?.materialsFields?.leadTimeDays || undefined,
        freeShippingThreshold: supplier?.materialsFields?.freeShippingThreshold
          ? toMajorUnits(supplier.materialsFields.freeShippingThreshold, supplier.currency)
          : undefined,
      },
      productsFields: {
        platform: supplier?.productsFields?.platform || 'other',
        shipsFrom: supplier?.productsFields?.shipsFrom || '',
        shippingTimeDaysMin: supplier?.productsFields?.shippingTimeDaysMin || undefined,
        shippingTimeDaysMax: supplier?.productsFields?.shippingTimeDaysMax || undefined,
        processingTimeDays: supplier?.productsFields?.processingTimeDays || undefined,
        handlesReturns: supplier?.productsFields?.handlesReturns || false,
        isPrintOnDemand: supplier?.productsFields?.isPrintOnDemand || false,
      },
    },
  });

  const supplierType = form.watch('supplierType');
  const showMaterialsFields = supplierType === 'materials' || supplierType === 'both';
  const showProductsFields = supplierType === 'products' || supplierType === 'both';
  const currency = form.watch('currency');

  const handleSubmit = async (values: SupplierFormValues) => {
    // Convert currency values to minor units
    if (values.materialsFields) {
      if (values.materialsFields.minimumOrderValue) {
        values.materialsFields.minimumOrderValue = toMinorUnits(
          values.materialsFields.minimumOrderValue,
          values.currency as Currency
        );
      }
      if (values.materialsFields.freeShippingThreshold) {
        values.materialsFields.freeShippingThreshold = toMinorUnits(
          values.materialsFields.freeShippingThreshold,
          values.currency as Currency
        );
      }
    }

    await onSubmit(values);
    if (!supplier) {
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Supplier Type Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Package className="h-4 w-4" />
            What is this supplier for?
          </div>

          <FormField
            control={form.control}
            name="supplierType"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {SUPPLIER_TYPES.map((type) => (
                      <div
                        key={type.value}
                        className={`relative flex cursor-pointer flex-col rounded-lg border p-4 transition-colors ${
                          field.value === type.value
                            ? 'border-emerald-500 bg-emerald-500/5'
                            : 'hover:border-muted-foreground/50'
                        }`}
                        onClick={() => field.onChange(type.value)}
                      >
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {type.description}
                        </div>
                        {field.value === type.value && (
                          <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Basic Info Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Building2 className="h-4 w-4" />
            Basic Information
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Supplier Name <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Craft Supplies Co" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Currency <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(Object.keys(CURRENCIES) as Currency[]).map((code) => (
                        <SelectItem key={code} value={code}>
                          {CURRENCIES[code].symbol} {CURRENCIES[code].name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Website</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="url"
                        placeholder="https://supplier.com"
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

        {/* Contact Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <User className="h-4 w-4" />
            Contact Details
            <span className="text-xs font-normal">(optional)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="contact.contactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Contact Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="contact@supplier.com"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact.phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Phone</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="+44 123 456 7890" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Materials Supplier Fields */}
        {showMaterialsFields && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <CreditCard className="h-4 w-4" />
              Account Details
              <span className="text-xs font-normal">(optional)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="materialsFields.accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Account Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., CUST-12345" {...field} />
                    </FormControl>
                    <FormDescription>Your account/customer number</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="materialsFields.leadTimeDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Lead Time (days)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="e.g., 3"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormDescription>Typical delivery time</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="materialsFields.minimumOrderValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Minimum Order</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                          {getCurrencySymbol(currency as Currency)}
                        </span>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          className="pl-8"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          value={field.value ?? ''}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="materialsFields.freeShippingThreshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Free Shipping Over</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                          {getCurrencySymbol(currency as Currency)}
                        </span>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          className="pl-8"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          value={field.value ?? ''}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        {/* Products Supplier Fields */}
        {showProductsFields && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Truck className="h-4 w-4" />
              Shipping & Fulfillment
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="productsFields.platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Platform <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SUPPLIER_PLATFORMS.map((platform) => (
                          <SelectItem key={platform.value} value={platform.value}>
                            {platform.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="productsFields.shipsFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Ships From</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., China, USA, UK" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="productsFields.processingTimeDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Processing (days)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="e.g., 2"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="productsFields.shippingTimeDaysMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Shipping Min (days)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="e.g., 7"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="productsFields.shippingTimeDaysMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Shipping Max (days)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="e.g., 21"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-wrap gap-6">
              <FormField
                control={form.control}
                name="productsFields.handlesReturns"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">Handles returns</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="productsFields.isPrintOnDemand"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">Print on demand</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        {/* Notes Section */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any additional notes about this supplier..."
                    className="min-h-[80px] resize-none"
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
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : supplier ? (
              'Update Supplier'
            ) : (
              'Add Supplier'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
