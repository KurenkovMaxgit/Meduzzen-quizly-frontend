import type { Metadata } from 'next';
import SidebarLayout from '@/components/layout/sidebar-layout';
import StoreInitializer from '@/components/common/store-initializer';

export const metadata: Metadata = { title: 'Quizly' };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <StoreInitializer>
        <SidebarLayout>{children}</SidebarLayout>
      </StoreInitializer>
    </>
  );
}
