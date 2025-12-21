import type { Metadata } from 'next';
import { AuthLayoutContent } from '@/components/auth/auth-layout-content';

export const metadata: Metadata = {
  title: {
    template: '%s | EcomProfitCalculator',
    default: 'Account | EcomProfitCalculator',
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayoutContent>{children}</AuthLayoutContent>;
}
