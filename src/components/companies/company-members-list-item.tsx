'use client';

import { currentCompany } from '@/mock/company-mock';
import { CompanyRole } from '@/utils/enums';
import { Button } from '@primereact/ui/button';
import { Tag } from '@primereact/ui/tag';
import { TagProps } from '@primereact/types/shared/tag';
import { Link } from '@/i18n/routing';
import { mockUser } from '@/mock/user-mock';
import { useMessages } from 'next-intl';
import { PROFILE_ROUTE } from '@/utils/router-constants';
import { CompanyUser } from '@/entities/company-user.entity';

const tagProps: { [key in CompanyRole]: { props: TagProps } } = {
  [CompanyRole.OWNER]: { props: { rounded: true } },
  [CompanyRole.ADMIN]: { props: { severity: 'info', rounded: true } },
  [CompanyRole.MEMBER]: { props: { severity: 'secondary', rounded: true } },
};

export const CompanyMemberListItem = (companyUser: CompanyUser) => {
  const dictionary = useMessages();

  const handleKickUser = async () => {
    //TODO: Add handling
  };

  return (
    <div className='bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 mb-4 flex flex-col justify-between gap-4 rounded-xl border p-4 shadow-sm sm:flex-row sm:items-center'>
      <div className='flex flex-col gap-1'>
        <div className='flex items-center gap-3'>
          <span className='text-surface-900 dark:text-surface-0 text-xl font-bold'>
            {companyUser.user.firstName + ' ' + companyUser.user.lastName}
          </span>
          <Tag {...tagProps[companyUser.role].props}>{companyUser.role}</Tag>
        </div>
        <span className='text-surface-600 dark:text-surface-400 text-sm'>
          {companyUser.user.email}
        </span>
      </div>
      <div className='flex items-center gap-4 sm:ml-auto'>
        {mockUser.id !== companyUser.user.id &&
          currentCompany.members.find((member) => member.user.id === mockUser.id)?.role ===
            CompanyRole.OWNER && (
            <Button
              rounded
              variant='outlined'
              severity='danger'
              onClick={() => handleKickUser}
              title={dictionary.companies.userActions.kick}
            >
              <i className='pi pi-user-minus' />
            </Button>
          )}
        <Link href={`${PROFILE_ROUTE}/${companyUser.user.id}`}>
          <Button
            rounded
            variant='outlined'
            severity='contrast'
            className='shrink-0'
            title={dictionary.companies.userActions.viewProfile}
          >
            <i className='pi pi-eye' />
          </Button>
        </Link>
      </div>
    </div>
  );
};
