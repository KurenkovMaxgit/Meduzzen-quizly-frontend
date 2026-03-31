import { CompanyStatus } from '@/utils/enums';

export type CreateCompany = {
  name: string;

  description: string;

  status?: CompanyStatus;
};
