import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Company } from './company.entity';
import { ActionStatus, ActionType } from '@/utils/enums';

export interface CompanyAction extends BaseEntity {
  createdBy?: User;

  subject: User;

  company: Company;

  status: ActionStatus;

  type: ActionType;
}
