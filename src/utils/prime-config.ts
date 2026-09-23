import { Pink } from '@/themes/pink';

export const PRIME_CONFIG = {
  license: process.env.NEXT_PUBLIC_PRIMEUI_LICENSE,
  theme: {
    preset: Pink,
    options: {
      darkModeSelector: '.dark',
    },
  },
};
