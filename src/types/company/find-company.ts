import { CompanyStatus } from '@/utils/enums';
import { FindCompanyMembers } from './find-company-members';

export type FindCompany = {
  id?: string;
  name?: string;
  description?: string;
  status?: CompanyStatus;
  members?: FindCompanyMembers;
  createdAt?: Date;
  updatedAt?: Date;
};
