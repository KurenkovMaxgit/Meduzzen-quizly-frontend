import type { Metadata } from 'next';
import { SidebarLayout } from '@/components/layout/sidebar-layout';
import { StoreInitializer } from '@/components/common/store-initializer/store-initializer';
import { NotificationSocketManager } from '@/components/notifications/notification-socket-manager';

export const metadata: Metadata = { title: 'Quizly' };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <StoreInitializer>
      <NotificationSocketManager />
      <SidebarLayout>{children}</SidebarLayout>
    </StoreInitializer>
  );
}
