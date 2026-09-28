import { Button } from '@primereact/ui/button';
import { Popover, PopoverRootOpenChangeEvent } from '@primereact/ui/popover';
import { useMessages, useLocale } from 'next-intl';
import { useAppDispatch } from '@/lib/hooks';
import { logout } from '@/lib/slices/auth-slice';
import { useUserDeleteOneByIdMutation } from '@/lib/api-endpoints';
import { useGlobalToast } from '@/providers/toast-provider';
import { clearAuthCookies } from '@/utils/clear-cookies';
import { useRouter } from '@/i18n/routing';
import { ReturnUser } from '@/types/user/return-user';
import { UpdateUser } from '@/types/user/update-user';
import { useState } from 'react';

export function ProfileHeaderActions({
  setFormData,
  setIsEditing,
  user,
}: {
  setFormData: (data: UpdateUser) => void;
  setIsEditing: (flag: boolean) => void;
  user: ReturnUser;
}) {
  const dictionary = useMessages();
  const currentLocale = useLocale();
  const router = useRouter();
  const toast = useGlobalToast();
  const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deleteUser] = useUserDeleteOneByIdMutation();

  async function handleDelete() {
    try {
      dispatch(logout());
      await deleteUser().unwrap();
      await clearAuthCookies();
      router.push(`/auth/logout?returnTo=${window.location.origin}/${currentLocale}`);
      toast.showToast('success', dictionary.toast.profile.delete.success);
    } catch {
      toast.showToast('danger', dictionary.toast.profile.delete.error);
    }
  }

  return (
    <div className='flex items-center gap-2'>
      <Button
        rounded
        className='h-10 px-4'
        onClick={() => {
          setFormData({ firstName: user.firstName || '', lastName: user.lastName || '' });
          setIsEditing(true);
        }}
      >
        <i className='pi pi-pencil my-1' />
        <h3 className='hidden sm:block'>{dictionary.common.edit}</h3>
      </Button>

      <Popover.Root
        trapped
        closeOnEscape
        open={isOpen}
        onOpenChange={(e: PopoverRootOpenChangeEvent) => setIsOpen(!!e.value)}
      >
        <Popover.Trigger
          as={Button}
          severity='danger'
          rounded
          variant='outlined'
          className='h-10 w-10 p-0'
        >
          <i className='pi pi-trash' />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner>
            <Popover.Popup>
              <Popover.Arrow />
              <Popover.Content>
                <div className='border-surface-200 dark:border-surface-700 flex items-start gap-3 border-b p-2 pb-3'>
                  <i className='pi pi-exclamation-triangle my-1' />
                  <p className='m-0 flex-1 leading-relaxed'>
                    {dictionary.profile.actions.deleteUserConfirmation}
                  </p>
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

                  <Button size='small' severity='danger' onClick={() => handleDelete()}>
                    {dictionary.common.confirm}
                  </Button>
                </div>
              </Popover.Footer>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
