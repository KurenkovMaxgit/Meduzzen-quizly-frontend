'use client';

import { PRIME_CONFIG } from '@/utils/prime-config';
import { PrimeReactProvider, PrimeReactStyleSheet } from '@primereact/core';
import { useServerInsertedHTML } from 'next/navigation';

const styledStyleSheet = new PrimeReactStyleSheet();

export function PrimeProvider({
  children,
}: Readonly<{
  children?: React.ReactNode;
}>) {
  useServerInsertedHTML(() => {
    const styleElements = styledStyleSheet.getAllElements();

    return <>{styleElements}</>;
  });

  return (
    <PrimeReactProvider {...PRIME_CONFIG} stylesheet={styledStyleSheet}>
      {children}
    </PrimeReactProvider>
  );
}
