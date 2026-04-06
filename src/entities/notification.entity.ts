import { NotificationStatus, NotificationType } from '@/utils/enums';
import { BaseEntity } from './base.entity';
import { Company } from './company.entity';
import { User } from './user.entity';

export interface Notification extends BaseEntity {
  user: User;

  userId: string;

  company?: Company;

  companyId?: string;

  text: string;

  type: NotificationType;

  metadata?: Record<string, unknown>;

  status: NotificationStatus;
}
