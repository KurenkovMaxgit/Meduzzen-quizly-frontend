import { Dictionary } from '@/types/common/dictionary';
import { CreateCompany } from '@/types/company/create-company';

export function validateCompany(formData: CreateCompany, dictionary: Dictionary): string[] {
  const rules = [
    {
      isValid: formData.name.trim().length >= 1 && formData.name.length <= 250,
      error: dictionary.companies.validationErrors.name,
    },
    {
      isValid: formData.description.trim().length >= 1 && formData.description.length <= 3000,
      error: dictionary.companies.validationErrors.description,
    },
  ];

  return rules.filter((rule) => !rule.isValid).map((rule) => rule.error);
}
