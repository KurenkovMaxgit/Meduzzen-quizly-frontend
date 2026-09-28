'use client';

import { Button } from '@primereact/ui/button';
import { useParams } from 'next/navigation';
import { useAppSelector } from '@/lib/hooks';
import { useUserFindOneByIdQuery } from '@/lib/api-endpoints';
import { User } from '@/entities/user.entity';
import { useRouter } from '@/i18n/routing';
import { ProfileFormSkeletons } from './profile-form-skeletons';
import { UserNotFound } from './profile-form-not-found';
import { EditableProfileForm } from './profile-edit-form';
import { useMessages } from 'next-intl';

export function ProfileForm({ userId }: { userId: User['id'] }) {
  const dictionary = useMessages();
  const params = useParams();
  const router = useRouter();

  const {
    data: response,
    isLoading: isFetching,
    isError,
    refetch,
  } = useUserFindOneByIdQuery({ id: userId });

  const { user: authUser } = useAppSelector((state) => state.auth);

  const user = response?.data;

  const userIdFromRoute = params.userId;
  const isOwner = authUser?.id === userIdFromRoute;

  if (isFetching) {
    return <ProfileFormSkeletons />;
  }

  if (isError || !user) {
    return <UserNotFound />;
  }

  return (
    <div className='mx-auto max-w-4xl space-y-6'>
      <Button severity='secondary' variant='text' onClick={() => router.back()}>
        <i className='pi pi-arrow-left mr-2' />
        {dictionary.common.back}
      </Button>

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

      <EditableProfileForm user={user} isOwner={isOwner} refetch={refetch} />
    </div>
  );
}
