import { useCompanyAddNewOwnerMutation } from '@/lib/api-endpoints';
import { useGlobalToast } from '@/providers/toast-provider';
import { Popover, PopoverRootOpenChangeEvent } from '@primereact/ui/popover';
import { useMessages } from 'next-intl';
import { Button } from '@primereact/ui/button';
import { useState } from 'react';

export function GrantOwnerRoleButton({
  memberId,
  companyId,
}: {
  memberId: string;
  companyId: string;
}) {
  const dictionary = useMessages();
  const toast = useGlobalToast();

  const [isOpen, setIsOpen] = useState<boolean>(false);
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
    <Popover.Root
      trapped
      closeOnEscape
      open={isOpen}
      onOpenChange={(e: PopoverRootOpenChangeEvent) => setIsOpen(!!e.value)}
    >
      <Popover.Trigger as={Button} severity='warn' rounded variant='outlined' className='p-0'>
        <i className='pi pi-crown my-1' />
        <span className='hidden sm:inline'>{dictionary.memberships.actions.grantOwner}</span>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Positioner>
          <Popover.Popup>
            <Popover.Arrow />
            <Popover.Content>
              <div className='border-surface-200 dark:border-surface-700 flex items-center gap-3 border-b p-2 pb-3'>
                <i className='pi pi-exclamation-triangle my-1' />
                <p className='m-0'>{dictionary.memberships.actions.grantOwnerConfirmation}</p>
              </div>
            </Popover.Content>

            <Popover.Footer>
              <div className='flex flex-1 items-center justify-end gap-2'>
                <Button
                  size='small'
                  severity='contrast'
                  variant='outlined'
                  onClick={() => setIsOpen(false)}
                >
                  {dictionary.common.cancel}
                </Button>

                <Button size='small' severity='warn' onClick={() => handleGrantOwner()}>
                  {dictionary.common.confirm}
                  {isGranting && <i className='pi pi-spin pi-spinner ml-2' />}
                </Button>
              </div>
            </Popover.Footer>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
