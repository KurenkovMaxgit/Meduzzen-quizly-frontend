import { Button } from '@primereact/ui/button';
import { ConfirmPopup } from '@primereact/ui/confirmpopup';
import { useMessages, useLocale } from 'next-intl';
import { useAppDispatch } from '@/lib/hooks';
import { logout } from '@/lib/slices/auth-slice';
import { useUserDeleteOneByIdMutation } from '@/lib/api-endpoints';
import { useGlobalToast } from '@/providers/toast-provider';
import { clearAuthCookies } from '@/utils/clear-cookies';
import { useRouter } from '@/i18n/routing';
import { ReturnUser } from '@/types/user/return-user';
import { UpdateUser } from '@/types/user/update-user';

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

      <ConfirmPopup.Root>
        <ConfirmPopup.Trigger
          severity='danger'
          rounded
          variant='outlined'
          className='h-10 w-10 p-0'
        >
          <i className='pi pi-trash' />
        </ConfirmPopup.Trigger>
        <ConfirmPopup.Portal>
          <ConfirmPopup.Content>
            <div className='border-surface-200 dark:border-surface-700 flex items-start gap-3 border-b p-3 pb-3'>
              <i className='pi pi-exclamation-triangle mt-0.5 text-xl' />
              <p className='m-0 flex-1 leading-relaxed'>
                {dictionary.profile.actions.deleteUserConfirmation}
              </p>
            </div>
          </ConfirmPopup.Content>

          <ConfirmPopup.Footer>
            <ConfirmPopup.Reject severity='contrast' variant='outlined'>
              {dictionary.common.cancel}
            </ConfirmPopup.Reject>

            <ConfirmPopup.Accept severity='danger' onClick={() => handleDelete()}>
              {dictionary.common.confirm}
            </ConfirmPopup.Accept>
          </ConfirmPopup.Footer>
        </ConfirmPopup.Portal>
      </ConfirmPopup.Root>
    </div>
  );
}
