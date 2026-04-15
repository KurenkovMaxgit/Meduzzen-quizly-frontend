import { useCompanyKickUsersMutation } from '@/lib/api-endpoints';
import { useGlobalToast } from '@/providers/toast-provider';
import { ConfirmPopup } from '@primereact/ui/confirmpopup';
import { useMessages } from 'next-intl';

export function KickMemberButton({ memberId, companyId }: { memberId: string; companyId: string }) {
  const dictionary = useMessages();
  const toast = useGlobalToast();

  const [kickMember, { isLoading: isKicking }] = useCompanyKickUsersMutation();

  const handleKickMember = async () => {
    try {
      const response = await kickMember({ companyId, userIds: [memberId] }).unwrap();
      if (response) {
        toast.showToast('success', dictionary.toast.company.delete.success);
      }
    } catch {
      toast.showToast('error', dictionary.toast.company.delete.error);
    }
  };

  return (
    <ConfirmPopup.Root>
      <ConfirmPopup.Trigger
        severity='danger'
        variant='outlined'
        rounded
        className='w-full justify-center'
      >
        <i className='pi pi-user-minus my-1' />
      </ConfirmPopup.Trigger>

      <ConfirmPopup.Portal>
        <ConfirmPopup.Content>
          <div className='border-surface-200 dark:border-surface-700 flex items-center gap-3 border-b p-2 pb-3'>
            <i className='pi pi-exclamation-triangle mb-1' />
            <p className='m-0'>{dictionary.memberships.actions.kickMemberConfirmation}</p>
          </div>
        </ConfirmPopup.Content>

        <ConfirmPopup.Footer>
          <ConfirmPopup.Reject severity='contrast' variant='outlined'>
            {dictionary.common.cancel}
          </ConfirmPopup.Reject>

          <ConfirmPopup.Accept severity='danger' onClick={() => handleKickMember()}>
            {dictionary.common.confirm}
            {isKicking && <i className='pi pi-spin pi-spinner ml-2' />}
          </ConfirmPopup.Accept>
        </ConfirmPopup.Footer>
      </ConfirmPopup.Portal>
    </ConfirmPopup.Root>
  );
}
