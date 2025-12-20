'use client';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  PAYMENT_METHODS,
  PAYMENT_METHOD_LABELS,
  platformIncludesPaymentProcessing,
  type PaymentMethod,
} from '@/lib/constants/payment-methods';
import type { PlatformKey, Currency } from '@/types';
import { formatCurrency } from '@/lib/constants/currencies';

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
  platform: PlatformKey;
  currency: Currency;
  orderTotal?: number;
}

// Payment method icons
const PayPalIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h3.61a.521.521 0 0 0 .515-.436l.03-.168.58-3.671.037-.205a.521.521 0 0 1 .514-.436h.324c2.093 0 3.732-.423 4.893-1.607.484-.492.862-1.085 1.134-1.783.084-.215.152-.433.205-.655.212-1.077.082-1.968-.434-2.67a3.11 3.11 0 0 0-.89-.815l.2.526z" />
  </svg>
);

const StripeIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
  </svg>
);

const SquareIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4.5 2.25A2.25 2.25 0 0 0 2.25 4.5v15A2.25 2.25 0 0 0 4.5 21.75h15a2.25 2.25 0 0 0 2.25-2.25v-15A2.25 2.25 0 0 0 19.5 2.25h-15zM9 8.25h6v1.5H9v-1.5zm0 3h6v1.5H9v-1.5zm0 3h6v1.5H9v-1.5z" />
  </svg>
);

const CashIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const PlatformIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const PAYMENT_ICONS: Record<PaymentMethod, React.ComponentType> = {
  platform_included: PlatformIcon,
  paypal: PayPalIcon,
  stripe: StripeIcon,
  square: SquareIcon,
  manual: CashIcon,
};

export function PaymentMethodSelector({
  value,
  onChange,
  platform,
  currency,
  orderTotal,
}: PaymentMethodSelectorProps) {
  const platformIncludesPayment = platformIncludesPaymentProcessing(platform);
  const selectedMethod = PAYMENT_METHODS[value];
  const Icon = PAYMENT_ICONS[value];

  // Calculate fee preview if order total provided
  const feePreview = orderTotal && selectedMethod ? (
    selectedMethod.percentageFee > 0 || selectedMethod.fixedFee > 0
      ? Math.round((orderTotal * selectedMethod.percentageFee) / 100) + selectedMethod.fixedFee
      : 0
  ) : null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="payment-method" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Payment Processing
        </Label>
        {platformIncludesPayment && value === 'platform_included' && (
          <Badge variant="secondary" className="text-[10px]">Included in {platform}</Badge>
        )}
      </div>

      <Select value={value} onValueChange={(v) => onChange(v as PaymentMethod)}>
        <SelectTrigger id="payment-method" className="h-11">
          <SelectValue>
            <div className="flex items-center gap-2">
              <Icon />
              <span>{PAYMENT_METHOD_LABELS[value]}</span>
              {feePreview !== null && feePreview > 0 && (
                <span className="text-xs text-orange-500">
                  ({formatCurrency(feePreview, currency)})
                </span>
              )}
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {platformIncludesPayment && (
            <SelectItem value="platform_included">
              <div className="flex items-center gap-2">
                <PlatformIcon />
                <div>
                  <span>Included in Platform</span>
                  <span className="ml-2 text-xs text-muted-foreground">No extra fee</span>
                </div>
              </div>
            </SelectItem>
          )}
          <SelectItem value="paypal">
            <div className="flex items-center gap-2">
              <PayPalIcon />
              <div>
                <span>PayPal</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {PAYMENT_METHODS.paypal.percentageFee}% + {formatCurrency(PAYMENT_METHODS.paypal.fixedFee, currency)}
                </span>
              </div>
            </div>
          </SelectItem>
          <SelectItem value="stripe">
            <div className="flex items-center gap-2">
              <StripeIcon />
              <div>
                <span>Stripe</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {PAYMENT_METHODS.stripe.percentageFee}% + {formatCurrency(PAYMENT_METHODS.stripe.fixedFee, currency)}
                </span>
              </div>
            </div>
          </SelectItem>
          <SelectItem value="square">
            <div className="flex items-center gap-2">
              <SquareIcon />
              <div>
                <span>Square</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {PAYMENT_METHODS.square.percentageFee}% + {formatCurrency(PAYMENT_METHODS.square.fixedFee, currency)}
                </span>
              </div>
            </div>
          </SelectItem>
          <SelectItem value="manual">
            <div className="flex items-center gap-2">
              <CashIcon />
              <div>
                <span>Cash / Manual</span>
                <span className="ml-2 text-xs text-muted-foreground">No fee</span>
              </div>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Fee breakdown hint */}
      {selectedMethod && (selectedMethod.percentageFee > 0 || selectedMethod.fixedFee > 0) && (
        <p className="text-xs text-muted-foreground">
          Fee: {selectedMethod.percentageFee}%{selectedMethod.fixedFee > 0 && ` + ${formatCurrency(selectedMethod.fixedFee, currency)} per transaction`}
        </p>
      )}
    </div>
  );
}
