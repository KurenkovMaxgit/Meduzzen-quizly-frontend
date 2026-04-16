import { CompanyUser } from '@/entities/company-user.entity';
import { UserRole } from '../../utils/enums';

export type ReturnUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  memberships?: CompanyUser[];
  createdAt: string;
  updatedAt: string;
};
