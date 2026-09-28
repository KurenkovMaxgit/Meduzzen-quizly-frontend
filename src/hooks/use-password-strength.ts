import { Dictionary } from '@/types/common/dictionary';
import { BASE_RULES, getStrengthMap } from '@/utils/password-strength-constants';
import { useMemo } from 'react';

export function usePasswordStrength(value: string, dictionary: Dictionary) {
  const STRENGTH_MAP = useMemo(() => getStrengthMap(dictionary), [dictionary]);

  const rules = useMemo(
    () =>
      BASE_RULES.map((rule) => ({
        ...rule,
        label: dictionary.auth.signUp.passwordStrength[
          rule.id as keyof typeof dictionary.auth.signUp.passwordStrength
        ] as string,
        weight: 20,
      })),
    [dictionary],
  );

  const score = value
    ? rules.reduce((acc, rule) => acc + (rule.test(value) ? rule.weight : 0), 0)
    : 0;

  const { props, label } = STRENGTH_MAP[score] || STRENGTH_MAP[0];

  return { rules, score, strengthProps: props, strengthLabel: label };
}
