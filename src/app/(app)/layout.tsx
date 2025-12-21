import type { Metadata } from 'next';
import { AppLayoutContent } from '@/components/app/app-layout-content';

export const metadata: Metadata = {
  title: {
    template: '%s | EcomProfitCalculator',
    default: 'Dashboard | EcomProfitCalculator',
  },
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayoutContent>{children}</AppLayoutContent>;
}
