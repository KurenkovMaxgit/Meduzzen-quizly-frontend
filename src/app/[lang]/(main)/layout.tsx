import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import SidebarLayout from '@/components/layout/sidebar-layout';
import StoreInitializer from '@/components/common/store-initializer';
import { ACCESS_TOKEN_KEY, ACTIVE_COMPANY_ID_KEY } from '@/utils/cookie-constants';

export const metadata: Metadata = { title: 'Quizly' };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();

  const isLoggedIn = !!cookieStore.get(ACCESS_TOKEN_KEY);
  const activeCompanyId = cookieStore.get(ACTIVE_COMPANY_ID_KEY)?.value;

  return (
    <>
      <StoreInitializer activeCompanyId={activeCompanyId} isLoggedIn={isLoggedIn} />
      <SidebarLayout>{children}</SidebarLayout>
    </>
  );
}
