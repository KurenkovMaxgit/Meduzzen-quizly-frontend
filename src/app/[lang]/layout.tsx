import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import PrimeProvider from '@/providers/prime-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import '@/app/globals.css';
import SidebarLayout from '@/components/layout/sidebar-layout';
import { getDictionary } from '@/utils/get-dictionary';
import { DictionaryProvider } from '@/providers/dictionary-provider';
import StoreProvider from '@/providers/store-provider';
import HealthCheck from '@/components/common/health-check';
import { ToastProvider } from '@/providers/toast-provider';
import StoreInitializer from '@/components/common/store-initializer';
import { ACCESS_TOKEN_KEY, ACTIVE_COMPANY_ID_KEY } from '@/utils/cookie-constants';
import { cookies } from 'next/headers';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = { title: 'Quizly' };

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ lang: 'en' | 'uk' }> }>) {
  const cookieStore = await cookies();
  const resolvedParams = await params;
  const dictionary = await getDictionary(resolvedParams.lang);

  const isLoggedIn = !!cookieStore.get(ACCESS_TOKEN_KEY);
  const activeCompanyId = cookieStore.get(ACTIVE_COMPANY_ID_KEY)?.value;

  return (
    <html lang={resolvedParams.lang} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <PrimeProvider>
            <StoreProvider>
              <StoreInitializer />
              <DictionaryProvider dictionary={dictionary}>
                <ToastProvider>
                  <HealthCheck />
                  <SidebarLayout>{children}</SidebarLayout>
                </ToastProvider>
              </DictionaryProvider>
            </StoreProvider>
          </PrimeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
