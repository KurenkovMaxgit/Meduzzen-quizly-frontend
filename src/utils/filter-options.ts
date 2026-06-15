import { ActionStatus, CompanyRole } from './enums';

export const NOTIFICATION_STATUS_FILTER_OPTIONS = [
  { key: 'pending', value: ActionStatus.PENDING },
  { key: 'accepted', value: ActionStatus.ACCEPTED },
  { key: 'declined', value: ActionStatus.DECLINED },
];

export const ROLE_FILTER_OPTIONS = [
  { key: 'owner', value: CompanyRole.OWNER },
  { key: 'admin', value: CompanyRole.ADMIN },
  { key: 'member', value: CompanyRole.MEMBER },
];
