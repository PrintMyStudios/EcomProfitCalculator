'use client';

import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSettingsStore } from '@/stores/settings';

interface VatWarningProps {
  className?: string;
}

/**
 * Shows a warning to VAT-registered users reminding them to enter costs excluding VAT.
 * Only renders when the user is VAT registered.
 */
export function VatWarning({ className }: VatWarningProps) {
  const vatRegistered = useSettingsStore((state) => state.vatRegistered);

  if (!vatRegistered) {
    return null;
  }

  return (
    <Alert variant="default" className={className}>
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        Enter costs <strong>excluding VAT</strong> (you reclaim input VAT on purchases)
      </AlertDescription>
    </Alert>
  );
}
