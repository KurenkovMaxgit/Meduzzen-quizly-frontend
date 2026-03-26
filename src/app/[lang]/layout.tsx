import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import PrimeProvider from '@/providers/prime-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import '@/app/globals.css';
import Sidebar from '@/components/layout/sidebar';
import { getDictionary } from '@/utils/get-dictionary';
import { DictionaryProvider } from '@/providers/dictionary-provider';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = { title: 'Quizly' };

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ lang: 'en' | 'uk' }> }>) {
  const resolvedParams = await params;
  const dictionary = await getDictionary(resolvedParams.lang);

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
            <DictionaryProvider dictionary={dictionary}>
              <Sidebar>{children}</Sidebar>
            </DictionaryProvider>
          </PrimeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
