import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Company } from './company.entity';
import { CompanyRole } from '@/utils/enums';

export interface CompanyUser extends BaseEntity {
  role: CompanyRole;

  user: User;

  company: Company;
}
