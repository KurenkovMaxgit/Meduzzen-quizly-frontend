'use client';

import { InputText } from '@primereact/ui/inputtext';
import { Button } from '@primereact/ui/button';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDictionary } from '@/providers/dictionary-provider';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { ReturnUser } from '@/types/user/return-user';
import { setCredentials } from '@/lib/slices/auth-slice';
import {
  useUserControllerFindOneByIdQuery,
  useUserControllerUpdateOneByIdMutation,
} from '@/lib/quizly-api';

export default function ProfileForm({ userId }: { userId: string }) {
  const dictionary = useDictionary();
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    data: response,
    isLoading: isFetching,
    isError,
    refetch,
  } = useUserControllerFindOneByIdQuery({ id: userId });

  const { user: authUser } = useAppSelector((state) => state.auth);
  const [updateUser, { isLoading: isUpdating }] = useUserControllerUpdateOneByIdMutation();

  const user = response?.data as ReturnUser;

  const userIdFromRoute = params.userId as string;
  const isOwner = authUser?.id === userIdFromRoute;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
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
        dispatch(setCredentials({ user: result.data }));
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  }

  if (isFetching) return <div className='p-4 text-center'>{dictionary.profile.loadingMessage}</div>;
  if (isError || !user)
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
            <Button
              label='Edit Profile'
              rounded
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
              <i className={isUpdating ? 'pi pi-spin pi-spinner' : 'pi pi-check'} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
