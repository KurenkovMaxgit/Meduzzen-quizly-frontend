import { getDictionary } from '@/utils/get-dictionary';

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

export type DictionaryContextType = {
  dictionary: Dictionary;
  locale: string;
};
