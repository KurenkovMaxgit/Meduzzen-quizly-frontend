import { useCompanyKickUsersMutation } from '@/lib/api-endpoints';
import { useGlobalToast } from '@/providers/toast-provider';
import { Popover, PopoverRootOpenChangeEvent } from '@primereact/ui/popover';
import { useMessages } from 'next-intl';
import { Button } from '@primereact/ui/button';
import { useState } from 'react';

export function KickMemberButton({ memberId, companyId }: { memberId: string; companyId: string }) {
  const dictionary = useMessages();
  const toast = useGlobalToast();

  const [isOpen, setIsOpen] = useState<boolean>(false);
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
    <Popover.Root
      trapped
      closeOnEscape
      open={isOpen}
      onOpenChange={(e: PopoverRootOpenChangeEvent) => setIsOpen(!!e.value)}
    >
      <Popover.Trigger as={Button} severity='danger' variant='outlined' rounded>
        <i className='pi pi-user-minus my-1' />
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Positioner>
          <Popover.Popup>
            <Popover.Arrow />
            <Popover.Content>
              <div className='border-surface-200 dark:border-surface-700 flex items-center gap-3 border-b p-2 pb-3'>
                <i className='pi pi-exclamation-triangle my-1' />
                <p className='m-0'>{dictionary.memberships.actions.kickMemberConfirmation}</p>
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

                <Button size='small' severity='danger' onClick={() => handleKickMember()}>
                  {dictionary.common.confirm}
                  {isKicking && <i className='pi pi-spin pi-spinner ml-2' />}
                </Button>
              </div>
            </Popover.Footer>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
