import { useCompanyKickUsersMutation } from '@/lib/api-endpoints';
import { useGlobalToast } from '@/providers/toast-provider';
import { ConfirmPopup } from '@primereact/ui/confirmpopup';
import { useMessages } from 'next-intl';

export function BulkKickMembersButton({
  companyId,
  memberIds,
  disabled,
  onSuccess,
}: {
  companyId: string;
  memberIds: string[];
  disabled?: boolean;
  onSuccess: () => void;
}) {
  const dictionary = useMessages();
  const toast = useGlobalToast();

  const [kickMembers, { isLoading: isKicking }] = useCompanyKickUsersMutation();

  const handleKickMembers = async () => {
    try {
      const response = await kickMembers({ companyId, userIds: memberIds }).unwrap();
      if (response) {
        toast.showToast('success', dictionary.toast.members.bulkKick.success);
        onSuccess();
      }
    } catch {
      toast.showToast('error', dictionary.toast.members.bulkKick.error);
    }
  };

  return (
    <ConfirmPopup.Root>
      <ConfirmPopup.Trigger
        severity='danger'
        variant='outlined'
        rounded
        disabled={disabled}
        className='w-full justify-center sm:w-auto'
      >
        <i className='pi pi-user-minus my-1' />
        <span className='hidden sm:inline'>{dictionary.memberships.actions.kickUsers}</span>
      </ConfirmPopup.Trigger>

      <ConfirmPopup.Portal>
        <ConfirmPopup.Content>
          <div className='border-surface-200 dark:border-surface-700 flex items-center gap-3 border-b p-2 pb-3'>
            <i className='pi pi-exclamation-triangle mb-1' />
            <p className='m-0'>{dictionary.memberships.actions.kickMembersConfirmation}</p>
          </div>
        </ConfirmPopup.Content>

        <ConfirmPopup.Footer>
          <ConfirmPopup.Reject severity='contrast' variant='outlined'>
            {dictionary.common.cancel}
          </ConfirmPopup.Reject>

          <ConfirmPopup.Accept severity='danger' onClick={() => handleKickMembers()}>
            {dictionary.common.confirm}
            {isKicking && <i className='pi pi-spin pi-spinner ml-2' />}
          </ConfirmPopup.Accept>
        </ConfirmPopup.Footer>
      </ConfirmPopup.Portal>
    </ConfirmPopup.Root>
  );
}
