import { CompanyAction } from '@/entities/action.entity';
import { Link } from '@/i18n/routing';
import { useActionCancelRequestMutation, useActionManageInviteMutation } from '@/lib/api-endpoints';
import { useGlobalToast } from '@/providers/toast-provider';
import { ActionDecision, ActionStatus, ActionType } from '@/utils/enums';
import { COMPANIES_ROUTE } from '@/utils/router-constants';
import { COMPANY_ACTION_STATUS_TAG_PROPS } from '@/utils/tag-props-constants';
import { Button } from '@primereact/ui/button';
import { Tag } from '@primereact/ui/tag';
import { useMessages } from 'next-intl';

export function UserMessagesListItem({ action }: { action: CompanyAction }) {
  const dictionary = useMessages();
  const toast = useGlobalToast();

  const [manageInvite] = useActionManageInviteMutation();
  const [cancelRequest] = useActionCancelRequestMutation();

  const handleManageInvite = async (decision: ActionDecision) => {
    try {
      const response = await manageInvite({ inviteId: action.id, action: decision });

      if (response) {
        toast.showToast('success', dictionary.toast.companyActions.manageInvite.success);
      }
    } catch {
      toast.showToast('error', dictionary.toast.companyActions.manageInvite.error);
    }
  };

  const handleCancelRequest = async () => {
    try {
      const response = await cancelRequest(action.id);

      if (response) {
        toast.showToast('success', dictionary.toast.companyActions.cancelRequest.success);
      }
    } catch {
      toast.showToast('error', dictionary.toast.companyActions.cancelRequest.error);
    }
  };

  return (
    <div className='bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 mb-4 flex flex-col justify-between gap-4 rounded-xl border p-4 shadow-sm sm:flex-row sm:items-center'>
      <div className='flex flex-col gap-1'>
        <div className='flex items-center gap-3'>
          <span className='text-surface-900 dark:text-surface-0 text-lg font-semibold sm:text-xl'>
            {action.type === ActionType.INVITE
              ? `${dictionary.messages.user.received.title}`
              : `${dictionary.messages.user.sended.title}`}
          </span>

          <Tag {...COMPANY_ACTION_STATUS_TAG_PROPS[action.status].props} className='shrink-0'>
            {dictionary.common.actionStatus[action.status]}
          </Tag>
        </div>

        <span className='text-surface-600 dark:text-surface-400 sm:text-md text-sm'>
          {action.type === ActionType.INVITE
            ? `${dictionary.messages.user.received.description}`
            : `${dictionary.messages.user.sended.description}`}
          <Button
            as={Link}
            href={`${COMPANIES_ROUTE}/${action.company!.id}`}
            variant='text'
            rounded
            className='shrink-0'
          >
            {action.company?.name}
          </Button>
        </span>
      </div>
      <div className='flex shrink-0 justify-end gap-4 sm:ml-auto sm:items-center'>
        {action.status === ActionStatus.PENDING &&
          (action.type === ActionType.INVITE ? (
            <>
              <Button
                rounded
                variant='outlined'
                severity='danger'
                title={dictionary.messages.actions.decline}
                onClick={() => handleManageInvite(ActionDecision.DECLINE)}
              >
                <i className='pi pi-times my-1' />
              </Button>
              <Button
                rounded
                variant='outlined'
                severity='success'
                title={dictionary.messages.actions.accept}
                onClick={() => handleManageInvite(ActionDecision.ACCEPT)}
              >
                <i className='pi pi-check my-1' />
              </Button>
            </>
          ) : (
            <Button
              rounded
              variant='outlined'
              severity='danger'
              onClick={() => handleCancelRequest()}
            >
              <i className='pi pi-trash my-1' />
              <span className='hidden sm:inline'>{dictionary.messages.actions.cancel}</span>
            </Button>
          ))}
      </div>
    </div>
  );
}
