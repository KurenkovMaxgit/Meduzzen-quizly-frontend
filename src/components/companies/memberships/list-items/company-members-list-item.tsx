'use client';

import { Button } from '@primereact/ui/button';
import { Tag } from '@primereact/ui/tag';
import { Link } from '@/i18n/routing';
import { useMessages } from 'next-intl';
import { PROFILE_ROUTE } from '@/utils/router-constants';
import { CompanyUser } from '@/entities/company-user.entity';
import { useAppSelector } from '@/lib/hooks';
import { KickMemberButton } from './kick-member-button';
import { COMPANY_ROLE_TAG_PROPS } from '@/utils/tag-props-constants';

export function CompanyMemberListItem({
  companyUser,
  isOwner,
  companyId,
}: {
  companyUser: CompanyUser;
  isOwner: boolean;
  companyId: string;
}) {
  const dictionary = useMessages();

  const { user: currentUser } = useAppSelector((state) => state.auth);

  return (
    <div className='bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 mb-4 flex flex-col justify-between gap-4 rounded-xl border p-4 shadow-sm sm:flex-row sm:items-center'>
      <div className='flex flex-col gap-1'>
        <div className='flex items-center gap-3'>
          <span className='text-surface-900 dark:text-surface-0 text-xl font-bold'>
            {companyUser.user.firstName + ' ' + companyUser.user.lastName}
          </span>
          <Tag {...COMPANY_ROLE_TAG_PROPS[companyUser.role].props} className='shrink-0'>
            {dictionary.common.companyRoles[companyUser.role]}
          </Tag>
        </div>
        <span className='text-surface-600 dark:text-surface-400 text-sm'>
          {companyUser.user.email}
        </span>
      </div>
      <div className='flex items-center gap-4 sm:ml-auto'>
        {currentUser?.id !== companyUser.user.id && isOwner && (
          <KickMemberButton memberId={companyUser.id} companyId={companyId} />
        )}
        <Link href={`${PROFILE_ROUTE}/${companyUser.user.id}`}>
          <Button
            rounded
            variant='outlined'
            severity='contrast'
            className='shrink-0'
            title={dictionary.companies.userActions.viewProfile}
          >
            <i className='pi pi-eye my-1' />
          </Button>
        </Link>
      </div>
    </div>
  );
}
