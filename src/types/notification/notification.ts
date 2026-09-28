import { NotificationStatus, NotificationType } from '@/utils/enums';
import { Company } from '@/entities/company.entity';

export interface Notification {
  id: string;
  text: string;
  type: NotificationType;
  metadata?: Record<string, unknown>;
  status: NotificationStatus;
  createdAt: string | Date;
  updatedAt?: string | Date;
  companyId?: string;
  company?: Company;
}

export interface NotificationCount {
  count: number;
  status: NotificationStatus;
}

export interface UpdateNotificationStatus {
  status: NotificationStatus;
  notificationIds: string[];
}

export interface NewNotificationEvent {
  id: string;
  text: string;
  type: NotificationType;
  metadata?: Record<string, unknown>;
  createdAt: string;
}
