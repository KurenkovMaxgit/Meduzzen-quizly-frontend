import { useState } from 'react';
import { InputText } from '@primereact/ui/inputtext';
import { Button } from '@primereact/ui/button';
import { useMessages } from 'next-intl';
import { useAppDispatch } from '@/lib/hooks';
import { ReturnUser } from '@/types/user/return-user';
import { setCurrentUser } from '@/lib/slices/auth-slice';
import { useUserUpdateOneByIdMutation } from '@/lib/api-endpoints';
import { useGlobalToast } from '@/providers/toast-provider';
import { cn } from '@/utils/cn';
import { UpdateUser } from '@/types/user/update-user';
import { ProfileHeaderActions } from './profile-header-actions';

export function EditableProfileForm({
  user,
  isOwner,
  refetch,
}: {
  user: ReturnUser;
  isOwner: boolean;
  refetch: () => void;
}) {
  const dictionary = useMessages();
  const toast = useGlobalToast();
  const dispatch = useAppDispatch();

  const [updateUser, { isLoading: isUpdating }] = useUserUpdateOneByIdMutation();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<UpdateUser>({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
  });

  const isUnchanged =
    formData.firstName === (user?.firstName || '') && formData.lastName === (user?.lastName || '');

  async function handleSave(e: React.SyntheticEvent) {
    e.preventDefault();
    if (isUnchanged) return;

    try {
      const result = await updateUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
      }).unwrap();

      setIsEditing(false);

      refetch();

      if (isOwner && result?.data) {
        dispatch(setCurrentUser({ user: result.data }));
      }
      toast.showToast('success', dictionary.toast.profile.update.success);
    } catch {
      toast.showToast('danger', dictionary.toast.profile.update.error);
    }
  }

  return (
    <div className='bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 rounded-xl border p-6 shadow-sm'>
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>{dictionary.profile.title}</h2>

        {isOwner && !isEditing && (
          <ProfileHeaderActions setFormData={setFormData} setIsEditing={setIsEditing} user={user} />
        )}
      </div>

      <form onSubmit={handleSave}>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div className='flex flex-col gap-2'>
            <label
              htmlFor='firstName'
              className='text-surface-700 dark:text-surface-300 font-semibold'
            >
              {dictionary.profile.firstName}
            </label>
            <InputText
              id='firstName'
              value={isEditing ? formData.firstName : user.firstName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData((prev) => ({ ...prev, firstName: e.target.value }))
              }
              disabled={!isEditing || isUpdating}
              className='w-full'
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label
              htmlFor='lastName'
              className='text-surface-700 dark:text-surface-300 font-semibold'
            >
              {dictionary.profile.lastName}
            </label>
            <InputText
              id='lastName'
              value={isEditing ? formData.lastName : user.lastName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData((prev) => ({ ...prev, lastName: e.target.value }))
              }
              disabled={!isEditing || isUpdating}
              className='w-full'
            />
          </div>

          <div className='flex flex-col gap-2 md:col-span-2'>
            <label htmlFor='email' className='text-surface-700 dark:text-surface-300 font-semibold'>
              {dictionary.profile.email}
            </label>
            <InputText
              id='email'
              value={user.email}
              disabled={true}
              className='w-full opacity-70'
            />
          </div>
        </div>

        {isEditing && (
          <div className='border-surface-200 dark:border-surface-700 mt-8 flex justify-center gap-3 border-t pt-4 sm:justify-end'>
            <Button
              type='button'
              severity='secondary'
              disabled={isUpdating}
              onClick={() => setIsEditing(false)}
            >
              {dictionary.common.cancel}
              <i className='pi pi-times ml-2' />
            </Button>

            <Button type='submit' severity='success' raised disabled={isUpdating || isUnchanged}>
              {dictionary.common.save}
              <i className={cn('ml-2', isUpdating ? 'pi pi-spin pi-spinner' : 'pi pi-check')} />
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
