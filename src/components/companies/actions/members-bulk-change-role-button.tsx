import { useCompanyUpdateRolesMutation } from '@/lib/api-endpoints';
import { useGlobalToast } from '@/providers/toast-provider';
import { CompanyRole } from '@/utils/enums';
import { ConfirmPopup } from '@primereact/ui/confirmpopup';
import { useMessages } from 'next-intl';
import { useState } from 'react';
import { Menu } from '@primereact/ui/menu';
import { ButtonGroup } from '@primereact/ui/buttongroup';
import { cn } from '@/utils/cn';

export function BulkChangeMembersRoleButton({
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

  const [pickedRole, setPickedRole] = useState<CompanyRole>();

  const [updateRoles, { isLoading: isChanging }] = useCompanyUpdateRolesMutation();

  const handleChangeMembersRoles = async () => {
    try {
      const response = await updateRoles({
        companyId,
        userIds: memberIds,
        newRole: pickedRole!,
      }).unwrap();
      if (response) {
        toast.showToast('success', dictionary.toast.members.changeRole.success);
        onSuccess();
      }
    } catch {
      toast.showToast('error', dictionary.toast.members.changeRole.error);
    }
  };

  return (
    <ConfirmPopup.Root>
      <Menu.Root>
        <ButtonGroup className='flex w-full sm:w-auto'>
          <ConfirmPopup.Trigger
            severity='info'
            variant='outlined'
            rounded
            disabled={!pickedRole || disabled}
            className='min-w-0 flex-1 justify-center sm:w-auto sm:flex-none'
          >
            <span className='truncate'>{dictionary.memberships.actions.changeRole}</span>
          </ConfirmPopup.Trigger>

          <Menu.Trigger
            severity='info'
            variant='outlined'
            rounded
            disabled={disabled}
            className='shrink-0 justify-center px-3 sm:w-auto'
          >
            <span className={cn('hidden', pickedRole && 'mr-2 inline capitalize')}>
              {pickedRole}
            </span>
            <i className='pi pi-chevron-down' />
          </Menu.Trigger>
        </ButtonGroup>

        <Menu.Portal>
          <Menu.List className='m-0 flex list-none flex-col gap-1 p-0'>
            <Menu.Item
              className={cn(
                'flex cursor-pointer items-center gap-2 rounded-md p-2 text-sm transition-colors',
                pickedRole === CompanyRole.ADMIN
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                  : 'hover:bg-surface-100 dark:hover:bg-surface-800',
              )}
              onPointerDown={() => setPickedRole(CompanyRole.ADMIN)}
            >
              <i className='pi pi-shield text-surface-500' />
              <span className='inline capitalize'>{CompanyRole.ADMIN}</span>
            </Menu.Item>
            <Menu.Item
              className={cn(
                'flex cursor-pointer items-center gap-2 rounded-md p-2 text-sm transition-colors',
                pickedRole === CompanyRole.MEMBER
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                  : 'hover:bg-surface-100 dark:hover:bg-surface-800',
              )}
              onPointerDown={() => setPickedRole(CompanyRole.MEMBER)}
            >
              <i className='pi pi-user text-surface-500' />
              <span className='inline capitalize'>{CompanyRole.MEMBER}</span>
            </Menu.Item>
          </Menu.List>
        </Menu.Portal>
      </Menu.Root>

      <ConfirmPopup.Portal>
        <ConfirmPopup.Content>
          <div className='border-surface-200 dark:border-surface-700 flex items-center gap-3 border-b p-2 pb-3'>
            <i className='pi pi-exclamation-triangle mb-1' />
            <p className='m-0'>{dictionary.memberships.actions.changeRoleConfirmation}</p>
          </div>
        </ConfirmPopup.Content>

        <ConfirmPopup.Footer>
          <ConfirmPopup.Reject severity='contrast' variant='outlined'>
            {dictionary.common.cancel}
          </ConfirmPopup.Reject>

          <ConfirmPopup.Accept severity='info' onClick={() => handleChangeMembersRoles()}>
            {dictionary.common.confirm}
            {isChanging && <i className='pi pi-spin pi-spinner ml-2' />}
          </ConfirmPopup.Accept>
        </ConfirmPopup.Footer>
      </ConfirmPopup.Portal>
    </ConfirmPopup.Root>
  );
}
