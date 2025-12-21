'use client';

import { AuthProvider } from '@/components/auth/auth-provider';
import { Toaster } from '@/components/ui/sonner';

export function AuthLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <a href="/" className="text-2xl font-bold">
              EcomProfit<span className="text-primary">Calculator</span>
            </a>
          </div>
          {children}
        </div>
      </div>
      <Toaster position="top-right" richColors closeButton />
    </AuthProvider>
  );
}
