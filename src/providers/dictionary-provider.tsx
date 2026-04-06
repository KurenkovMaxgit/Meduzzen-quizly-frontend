'use client';

import { createContext, useContext } from 'react';
import { getDictionary } from '@/utils/get-dictionary';

type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

type DictionaryContextType = {
  dictionary: Dictionary;
  locale: string;
};

const DictionaryContext = createContext<DictionaryContextType | null>(null);

export function DictionaryProvider({
  dictionary,
  locale,
  children,
}: {
  dictionary: Dictionary;
  locale: string;
  children: React.ReactNode;
}) {
  return (
    <DictionaryContext.Provider value={{ dictionary, locale }}>
      {children}
    </DictionaryContext.Provider>
  );
}

export function useDictionary() {
  const context = useContext(DictionaryContext);

  if (!context) {
    throw new Error('useDictionary must be used within a DictionaryProvider');
  }

  return context.dictionary;
}

export function useCurrentLocale() {
  const context = useContext(DictionaryContext);

  if (!context) {
    throw new Error('useCurrentLocale must be used within a DictionaryProvider');
  }

  return context.locale;
}
