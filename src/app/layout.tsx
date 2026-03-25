import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import PrimeProvider from '@/providers/prime-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import '@/app/globals.css';
import Sidebar from '@/components/layout/sidebar';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = { title: 'Quizly' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en' suppressHydrationWarning>
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
            <Sidebar>{children}</Sidebar>
          </PrimeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
