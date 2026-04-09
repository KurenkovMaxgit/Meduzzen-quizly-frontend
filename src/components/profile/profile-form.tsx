'use client';

import { InputText } from '@primereact/ui/inputtext';
import { Button } from '@primereact/ui/button';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLocale, useMessages } from 'next-intl';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { ReturnUser } from '@/types/user/return-user';
import { logout, setCurrentUser } from '@/lib/slices/auth-slice';
import {
  useUserControllerDeleteOneByIdMutation,
  useUserControllerFindOneByIdQuery,
  useUserControllerUpdateOneByIdMutation,
} from '@/lib/quizly-api';
import { useGlobalToast } from '@/providers/toast-provider';
import { ConfirmPopup } from '@primereact/ui/confirmpopup';
import { Skeleton } from '@primereact/ui/skeleton';
import { clearAuthCookies } from '@/utils/clear-cookies';
import { cn } from '@/utils/cn';

export function ProfileForm({ userId }: { userId: string }) {
  const dictionary = useMessages();
  const currentLocale = useLocale();
  const params = useParams();
  const router = useRouter();
  const toast = useGlobalToast();
  const dispatch = useAppDispatch();

  const {
    data: response,
    isLoading: isFetching,
    isError,
    refetch,
  } = useUserControllerFindOneByIdQuery({ id: userId });

  const { user: authUser } = useAppSelector((state) => state.auth);
  const [updateUser, { isLoading: isUpdating }] = useUserControllerUpdateOneByIdMutation();
  const [deleteUser] = useUserControllerDeleteOneByIdMutation();

  const user = response?.data as ReturnUser;

  const userIdFromRoute = params.userId as string;
  const isOwner = authUser?.id === userIdFromRoute;

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<{ firstName: string; lastName: string }>({
    firstName: '',
    lastName: '',
  });

  const isUnchanged =
    formData.firstName === (user?.firstName || '') && formData.lastName === (user?.lastName || '');

  async function handleSave() {
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

      toast.showToast('success', dictionary.toast.profileUpdate.success);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  }

  async function handleDelete() {
    try {
      dispatch(logout());

      await deleteUser().unwrap();

      await clearAuthCookies();

      window.location.assign(`/auth/logout?returnTo=${window.location.origin}/${currentLocale}`);
    } catch (error) {
      console.error('Failed to delete profile:', error);
    }
  }

  if (isFetching) {
    return (
      <div className='mx-auto max-w-4xl space-y-6'>
        <div className='mb-8 flex items-center gap-4'>
          <Skeleton shape='circle' width='4rem' height='4rem' className='shrink-0' />
          <div className='flex flex-col gap-2'>
            <Skeleton width='16rem' height='2rem' />
            <Skeleton width='5rem' height='1.5rem' className='mt-1' />
          </div>
        </div>
        <div className='bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 rounded-xl border p-6 shadow-sm'>
          <div className='mb-6 flex items-center justify-between'>
            <Skeleton width='8rem' height='2rem' />
            <div className='flex items-center gap-2'>
              <Skeleton width='8rem' height='2.5rem' borderRadius='2rem' />
              <Skeleton shape='circle' width='2.5rem' height='2.5rem' />
            </div>
          </div>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='flex flex-col gap-2'>
              <Skeleton width='6rem' height='1.2rem' />
              <Skeleton width='100%' height='2.5rem' />
            </div>

            <div className='flex flex-col gap-2'>
              <Skeleton width='6rem' height='1.2rem' />
              <Skeleton width='100%' height='2.5rem' />
            </div>

            <div className='flex flex-col gap-2 md:col-span-2'>
              <Skeleton width='4rem' height='1.2rem' />
              <Skeleton width='100%' height='2.5rem' />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className='border-surface-200 bg-surface-50/50 dark:border-surface-700 dark:bg-surface-900/50 flex min-h-100 flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center'>
        <div className='bg-surface-100 dark:bg-surface-800 mb-6 flex h-20 w-20 items-center justify-center rounded-full'>
          <i className='pi pi-user-minus text-surface-400 text-4xl' />
        </div>

        <h2 className='text-surface-900 dark:text-surface-0 mb-2 text-2xl font-bold'>
          {dictionary.profile.userNotFound.title}
        </h2>

        <p className='text-surface-500 dark:text-surface-400 mb-8 max-w-sm'>
          {dictionary.profile.userNotFound.description}
        </p>

        <Button
          icon='pi pi-arrow-left'
          severity='secondary'
          variant='outlined'
          onClick={() => router.back()}
        >
          {dictionary.common.back}
        </Button>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-4xl space-y-6'>
      <div className='mb-8 flex items-center gap-4'>
        <div className='bg-primary text-surface-0 flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold uppercase'>
          {user.firstName[0]}
          {user.lastName[0]}
        </div>
        <div>
          <h1 className='text-3xl font-bold'>
            {user.firstName} {user.lastName}
          </h1>
          <span className='text-surface-500 bg-surface-200 dark:bg-surface-800 mt-1 inline-block rounded-md px-2 py-1 text-sm capitalize'>
            {user.role}
          </span>
        </div>
      </div>

      <div className='bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 rounded-xl border p-6 shadow-sm'>
        <div className='mb-6 flex items-center justify-between'>
          <h2 className='text-2xl font-bold'>{dictionary.profile.title}</h2>
          {isOwner && !isEditing && (
            <div className='flex items-center gap-2'>
              <Button
                label='Edit Profile'
                rounded
                className='h-10 p-0'
                onClick={() => {
                  setFormData({
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                  });
                  setIsEditing(true);
                }}
              >
                <i className='pi pi-pencil' />
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
          )}
        </div>

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
              value={isEditing ? formData.firstName : user.firstName || ''}
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
              value={isEditing ? formData.lastName : user.lastName || ''}
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
              label='Cancel'
              severity='secondary'
              disabled={isUpdating}
              onClick={() => setIsEditing(false)}
            >
              {dictionary.common.cancel}
              <i className='pi pi-times' />
            </Button>
            <Button
              label='Save Changes'
              severity='success'
              raised
              onClick={handleSave}
              disabled={isUpdating || isUnchanged}
            >
              {dictionary.common.save}
              <i className={cn(isUpdating ? 'pi pi-spin pi-spinner' : 'pi pi-check')} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
