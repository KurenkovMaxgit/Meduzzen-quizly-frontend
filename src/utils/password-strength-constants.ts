import { Dictionary } from '@/types/common/dictionary';
import { TagProps } from '@primereact/types/shared/tag';

export const getStrengthMap = (
  dictionary: Dictionary,
): Record<number, { props: TagProps; label: string }> => ({
  0: { props: { severity: 'danger' }, label: '' },
  20: { props: { severity: 'danger' }, label: dictionary.auth.signUp.passwordStrength.tag.tooWeak },
  40: { props: { severity: 'warn' }, label: dictionary.auth.signUp.passwordStrength.tag.weak },
  60: { props: { severity: 'info' }, label: dictionary.auth.signUp.passwordStrength.tag.fair },
  80: { props: { severity: 'success' }, label: dictionary.auth.signUp.passwordStrength.tag.strong },
  100: {
    props: { severity: 'success' },
    label: dictionary.auth.signUp.passwordStrength.tag.veryStrong,
  },
});

export const BASE_RULES = [
  { id: 'length', test: (v: string) => v.length >= 12 },
  { id: 'uppercase', test: (v: string) => /[A-Z]/.test(v) },
  { id: 'lowercase', test: (v: string) => /[a-z]/.test(v) },
  { id: 'number', test: (v: string) => /[0-9]/.test(v) },
  { id: 'special', test: (v: string) => /[^a-zA-Z0-9]/.test(v) },
] as const;
