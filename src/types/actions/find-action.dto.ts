import { ActionStatus, ActionType } from '@/utils/enums';
import { FindCompany } from '../company/find-company';
import { FindUser } from '../user/find-user';

export class FindAction {
  id?: string;

  createdBy?: FindUser;

  subject?: FindUser;

  company?: FindCompany;

  status?: ActionStatus;

  type?: ActionType;

  createdAt?: Date;

  updatedAt?: Date;
}
