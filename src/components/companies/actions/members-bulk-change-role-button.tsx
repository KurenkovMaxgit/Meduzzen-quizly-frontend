import { useCompanyUpdateRolesMutation } from '@/lib/api-endpoints';
import { useGlobalToast } from '@/providers/toast-provider';
import { CompanyRole } from '@/utils/enums';
import { Popover, PopoverRootOpenChangeEvent } from '@primereact/ui/popover';
import { useMessages } from 'next-intl';
import { useState } from 'react';
import { Menu } from '@primereact/ui/menu';
import { ButtonGroup } from '@primereact/ui/buttongroup';
import { cn } from '@/utils/cn';
import { Button } from '@primereact/ui/button';
import { ROLE_OPTIONS } from '@/utils/edit-role-options';

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

  const [selectedRole, setSelectedRole] = useState<CompanyRole>();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [updateRoles, { isLoading: isChanging }] = useCompanyUpdateRolesMutation();

  const handleChangeMembersRoles = async () => {
    if (!selectedRole) return;

    try {
      const response = await updateRoles({
        companyId,
        userIds: memberIds,
        newRole: selectedRole,
      }).unwrap();

      if (response) {
        setIsConfirmOpen(false);
        toast.showToast('success', dictionary.toast.members.changeRole.success);
        onSuccess();
      }
    } catch {
      toast.showToast('error', dictionary.toast.members.changeRole.error);
    }
  };

  return (
    <Popover.Root
      trapped
      closeOnEscape
      open={isConfirmOpen}
      onOpenChange={(e: PopoverRootOpenChangeEvent) => setIsConfirmOpen(!!e.value)}
    >
      <Menu.Root>
        <ButtonGroup className='flex w-full sm:w-auto'>
          <Popover.Trigger
            as={Button}
            severity='info'
            variant='outlined'
            rounded
            disabled={!selectedRole || disabled}
            className='min-w-0 flex-1 justify-center sm:w-auto sm:flex-none'
          >
            <span className='truncate'>{dictionary.memberships.actions.changeRole}</span>
          </Popover.Trigger>

          <Menu.Trigger
            as={Button}
            severity='info'
            variant='outlined'
            rounded
            disabled={disabled}
            className='shrink-0 justify-center gap-2 px-3 sm:w-auto'
          >
            {selectedRole && <span className='hidden capitalize sm:inline'>{selectedRole}</span>}
            <i className='pi pi-chevron-down' />
          </Menu.Trigger>
        </ButtonGroup>

        <Menu.Portal>
          <Menu.Positioner align='end' sideOffset={8}>
            <Menu.Popup className='w-44'>
              <Menu.List className='m-0 flex list-none flex-col gap-1 p-1'>
                {ROLE_OPTIONS.map((roleOption) => (
                  <Menu.Item
                    key={roleOption.value}
                    className={cn(
                      'flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                      selectedRole === roleOption.value
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                        : 'hover:bg-surface-100 dark:hover:bg-surface-800',
                    )}
                    onClick={() => setSelectedRole(roleOption.value)}
                  >
                    <i className={cn(roleOption.iconClassName, 'text-surface-500')} />
                    <span className='capitalize'>{roleOption.value}</span>
                    {selectedRole === roleOption.value && (
                      <i className='pi pi-check ml-auto text-xs' />
                    )}
                  </Menu.Item>
                ))}
              </Menu.List>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>

      <Popover.Portal>
        <Popover.Positioner>
          <Popover.Popup>
            <Popover.Arrow />
            <Popover.Content>
              <div className='border-surface-200 dark:border-surface-700 flex items-center gap-3 border-b p-2 pb-3'>
                <i className='pi pi-exclamation-triangle my-1' />
                <p className='m-0'>{dictionary.memberships.actions.changeRoleConfirmation}</p>
              </div>
            </Popover.Content>

            <Popover.Footer>
              <div className='flex flex-1 items-center justify-end gap-2'>
                <Button
                  size='small'
                  severity='contrast'
                  variant='outlined'
                  onClick={() => setIsConfirmOpen(false)}
                >
                  {dictionary.common.cancel}
                </Button>

                <Button size='small' severity='info' onClick={() => handleChangeMembersRoles()}>
                  {dictionary.common.confirm}
                  {isChanging && <i className='pi pi-spin pi-spinner ml-2' />}
                </Button>
              </div>
            </Popover.Footer>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
