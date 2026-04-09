import '@/app/globals.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { PrimeProvider } from '@/providers/prime-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { StoreProvider } from '@/providers/store-provider';
import { HealthCheck } from '@/components/common/health-check';
import { ToastProvider } from '@/providers/toast-provider';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = { title: 'Quizly' };

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
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
            <HealthCheck />
            <StoreProvider>
              <NextIntlClientProvider messages={messages}>
                <ToastProvider>{children}</ToastProvider>
              </NextIntlClientProvider>
            </StoreProvider>
          </PrimeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
