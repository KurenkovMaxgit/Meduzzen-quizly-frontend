import { TagProps } from '@primereact/types/shared/tag';
import { ActionStatus, CompanyRole } from './enums';

export const COMPANY_ROLE_TAG_PROPS: { [key in CompanyRole]: { props: TagProps } } = {
  [CompanyRole.OWNER]: { props: { severity: 'warn', rounded: true } },
  [CompanyRole.ADMIN]: { props: { severity: 'info', rounded: true } },
  [CompanyRole.MEMBER]: { props: { severity: 'contrast', rounded: true } },
};

export const COMPANY_ACTION_STATUS_TAG_PROPS: { [key in ActionStatus]: { props: TagProps } } = {
  [ActionStatus.PENDING]: { props: { severity: 'warn', rounded: true } },
  [ActionStatus.ACCEPTED]: { props: { severity: 'success', rounded: true } },
  [ActionStatus.DECLINED]: { props: { severity: 'danger', rounded: true } },
};
