import { UserRole } from '../../utils/enums';
import { FindCompanyMembers } from '../company/find-company-members';

export type FindUser = {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: UserRole;
  memberships?: FindCompanyMembers;
  createdAt?: Date;
  updatedAt?: Date;
};
