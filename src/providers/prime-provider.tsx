'use client';

import { Pink } from '@/themes/pink';
import { PrimeReactProvider, PrimeReactStyleSheet } from '@primereact/core';
import { useServerInsertedHTML } from 'next/navigation';

const styledStyleSheet = new PrimeReactStyleSheet();

const primereact = {
  theme: {
    preset: Pink,
    options: {
      darkModeSelector: '.dark',
    },
  },
};

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
    <PrimeReactProvider {...primereact} stylesheet={styledStyleSheet}>
      {children}
    </PrimeReactProvider>
  );
}
