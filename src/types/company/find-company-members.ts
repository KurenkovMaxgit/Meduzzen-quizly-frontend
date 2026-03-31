import { CompanyRole } from '@/utils/enums';
import { FindCompany } from './find-company';
import { FindUser } from '../user/find-user';

export type FindCompanyMembers = {
  role?: CompanyRole;

  user?: FindUser;

  company?: FindCompany;
};
