const dictionaries = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  uk: () => import('@/dictionaries/uk.json').then((module) => module.default),
};

type Locale = keyof typeof dictionaries;

export const getDictionary = (locale: string) => {
  if (locale in dictionaries) {
    return dictionaries[locale as Locale]();
  }

  return dictionaries.en();
};
