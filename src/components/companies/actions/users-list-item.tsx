import { Link } from '@/i18n/routing';
import { useAppSelector } from '@/lib/hooks';
import { useActionInviteUserMutation } from '@/lib/api-endpoints';
import { useGlobalToast } from '@/providers/toast-provider';
import { ReturnUser } from '@/types/user/return-user';
import { PROFILE_ROUTE } from '@/utils/router-constants';
import { Button } from '@primereact/ui/button';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { useMessages } from 'next-intl';
import { useState } from 'react';

export function UserListItem({ user }: { user: ReturnUser }) {
  const dictionary = useMessages();
  const toast = useGlobalToast();

  const [isInviteButtonDisabled, setInviteButtonDisabled] = useState<boolean>(false);

  const { activeCompany: currentCompany } = useAppSelector((state) => state.company);

  const [sendInvite] = useActionInviteUserMutation();

  const handleSendInvite = async () => {
    try {
      const response = await sendInvite({
        companyId: currentCompany!.id,
        subject: user.id,
      }).unwrap();

      if (response) {
        toast.showToast('success', dictionary.toast.members.invite.success);
        setInviteButtonDisabled(true);
      }
    } catch (error) {
      const errorCode = (error as FetchBaseQueryError).status;
      if (errorCode === 400) {
        toast.showToast('error', dictionary.toast.members.invite.alreadySent);
        setInviteButtonDisabled(true);
      } else {
        toast.showToast('error', dictionary.toast.members.invite.error);
      }
    }
  };

  return (
    <div className='bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 mb-4 flex flex-col justify-between gap-4 rounded-xl border p-4 shadow-sm sm:flex-row sm:items-center'>
      <div className='flex flex-col gap-1'>
        <div className='flex items-center gap-3'>
          <span className='text-surface-900 dark:text-surface-0 text-xl font-bold'>
            {user.firstName} {user.lastName}
          </span>
        </div>
        <span className='text-surface-600 dark:text-surface-400 text-sm'>{user.email}</span>
      </div>
      <div className='flex shrink-0 justify-end gap-4 sm:ml-auto sm:items-center'>
        <Link href={`${PROFILE_ROUTE}/${user.id}`}>
          <Button
            rounded
            variant='outlined'
            severity='contrast'
            className='shrink-0'
            title={dictionary.companies.actions.viewDetails}
          >
            <i className='pi pi-eye my-1' />
          </Button>
        </Link>
        <Button
          rounded
          variant='outlined'
          severity='info'
          disabled={isInviteButtonDisabled}
          onClick={() => handleSendInvite()}
          title={dictionary.companies.actions.sendInvite}
        >
          {isInviteButtonDisabled ? (
            <i className='pi pi-check my-1' />
          ) : (
            <i className='pi pi-envelope my-1' />
          )}
        </Button>
      </div>
    </div>
  );
}
