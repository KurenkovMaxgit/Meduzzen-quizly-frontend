import { useCompanyKickUsersMutation } from '@/lib/api-endpoints';
import { useGlobalToast } from '@/providers/toast-provider';
import { Popover, PopoverRootOpenChangeEvent } from '@primereact/ui/popover';
import { useMessages } from 'next-intl';
import { Button } from '@primereact/ui/button';
import { useState } from 'react';

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

  const [isOpen, setIsOpen] = useState<boolean>(false);
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
    <Popover.Root
      trapped
      closeOnEscape
      open={isOpen}
      disabled={disabled}
      onOpenChange={(e: PopoverRootOpenChangeEvent) => setIsOpen(!!e.value)}
    >
      <Popover.Trigger as={Button} severity='danger' rounded variant='outlined' className='p-0'>
        <i className='pi pi-user-minus my-1' />
        <span className='hidden sm:inline'>{dictionary.memberships.actions.kickUsers}</span>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Positioner>
          <Popover.Popup>
            <Popover.Arrow />
            <Popover.Content>
              <div className='border-surface-200 dark:border-surface-700 flex items-center gap-3 border-b p-2 pb-3'>
                <i className='pi pi-exclamation-triangle my-1' />
                <p className='m-0'>{dictionary.memberships.actions.kickMembersConfirmation}</p>
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

                <Button size='small' severity='danger' onClick={() => handleKickMembers()}>
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
