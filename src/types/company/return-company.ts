import { CompanyUser } from '@/entities/company-user.entity';
import { CompanyStatus } from '../../utils/enums';

export type ReturnCompany = {
  id: string;
  name: string;
  description: string;
  status: CompanyStatus;
  members?: CompanyUser[];
  createdAt: Date;
  updatedAt: Date;
};
