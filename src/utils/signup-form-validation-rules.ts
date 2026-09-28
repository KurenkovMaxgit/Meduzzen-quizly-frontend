import { Dictionary } from '@/types/common/dictionary';
import { CreateUser } from '@/types/user/create-user';

export function validateSignup(
  formData: CreateUser & { confirmPassword: string },
  dictionary: Dictionary,
): string[] {
  const rules = [
    {
      isValid: formData.firstName.trim().length >= 1 && formData.firstName.length <= 250,
      error: dictionary.auth.signUp.validationErrors.firstName,
    },
    {
      isValid: formData.lastName.trim().length >= 1 && formData.lastName.length <= 250,
      error: dictionary.auth.signUp.validationErrors.lastName,
    },
    {
      isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && formData.email.length <= 255,
      error: dictionary.auth.signUp.validationErrors.email,
    },
    {
      isValid: formData.password.length >= 8 && formData.password.length <= 255,
      error: dictionary.auth.signUp.validationErrors.password,
    },
    {
      isValid: formData.password === formData.confirmPassword,
      error: dictionary.auth.signUp.validationErrors.confirmPassword,
    },
  ];

  return rules.filter((rule) => !rule.isValid).map((rule) => rule.error);
}
