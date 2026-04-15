import { useCompanyAddNewOwnerMutation } from '@/lib/api-endpoints';
import { useGlobalToast } from '@/providers/toast-provider';
import { ConfirmPopup } from '@primereact/ui/confirmpopup';
import { useMessages } from 'next-intl';

export function GrantOwnerRoleButton({
  memberId,
  companyId,
}: {
  memberId: string;
  companyId: string;
}) {
  const dictionary = useMessages();
  const toast = useGlobalToast();

  const [grandOwner, { isLoading: isGranting }] = useCompanyAddNewOwnerMutation();

  const handleGrantOwner = async () => {
    try {
      const response = await grandOwner({ companyId, userId: memberId }).unwrap();
      if (response) {
        toast.showToast('success', dictionary.toast.members.grantOwner.success);
      }
    } catch {
      toast.showToast('error', dictionary.toast.members.grantOwner.error);
    }
  };

  return (
    <ConfirmPopup.Root>
      <ConfirmPopup.Trigger severity='warn' variant='outlined' rounded className='justify-center'>
        <i className='pi pi-crown my-1' />
        <span className='hidden sm:inline'>{dictionary.memberships.actions.grantOwner}</span>
      </ConfirmPopup.Trigger>

      <ConfirmPopup.Portal>
        <ConfirmPopup.Content>
          <div className='border-surface-200 dark:border-surface-700 flex items-center gap-3 border-b p-2 pb-3'>
            <i className='pi pi-exclamation-triangle mb-1' />
            <p className='m-0'>{dictionary.memberships.actions.grantOwnerConfirmation}</p>
          </div>
        </ConfirmPopup.Content>

        <ConfirmPopup.Footer>
          <ConfirmPopup.Reject severity='contrast' variant='outlined'>
            {dictionary.common.cancel}
          </ConfirmPopup.Reject>

          <ConfirmPopup.Accept severity='warn' onClick={() => handleGrantOwner()}>
            {dictionary.common.confirm}
            {isGranting && <i className='pi pi-spin pi-spinner ml-2' />}
          </ConfirmPopup.Accept>
        </ConfirmPopup.Footer>
      </ConfirmPopup.Portal>
    </ConfirmPopup.Root>
  );
}
