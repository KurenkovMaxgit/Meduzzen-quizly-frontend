import { BaseEntity } from './base.entity';
import { CompanyUser } from './company-user.entity';
import { CompanyAction } from './action.entity';
import { Quiz } from './quiz.entity';
import { CompanyStatus } from '@/utils/enums';

export interface Company extends BaseEntity {
  name: string;

  description: string;

  status: CompanyStatus;

  members?: CompanyUser[];

  actions?: CompanyAction[];

  quizzes?: Quiz[];
}
