import { BaseEntity } from './base.entity';
import { CompanyUser } from './company-user.entity';
import { CompanyAction } from './action.entity';
import { QuizAttempt } from './attempt.entity';
import { UserRole } from '@/utils/enums';

export interface User extends BaseEntity {
  firstName: string;

  lastName: string;

  email: string;

  passwordHash?: string | null;

  role: UserRole;

  refreshTokenHash?: string | null;

  memberships?: CompanyUser[];

  sentActions?: CompanyAction[];

  receivedActions?: CompanyAction[];

  attempts?: QuizAttempt[];
}
