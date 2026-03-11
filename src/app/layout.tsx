import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import PrimeProvider from '@/providers/prime-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import '@/app/globals.css';
import MenuBar from '@/components/menu-bar';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = { title: 'Quizly' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PrimeProvider>
            <MenuBar />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
              {children}
            </main>
          </PrimeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
