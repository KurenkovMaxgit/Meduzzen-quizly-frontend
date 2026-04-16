'use client';

import { Button } from '@primereact/ui/button';
import { CompanyMemberListItem } from '../memberships/list-items/company-members-list-item';
import { CompanyRole } from '@/utils/enums';
import { useMessages } from 'next-intl';
import { ReturnCompany } from '@/types/company/return-company';
import { Link } from '@/i18n/routing';
import { useAppSelector } from '@/lib/hooks';
import { useCompanySession } from '@/hooks/use-company-session';
import { cn } from '@/utils/cn';
import { CompanyDetailsLeaveButton } from './company-details-leave-button';
import { CompanyDetailsDeleteButton } from './company-details-delete-button';
import { CompanyUser } from '@/entities/company-user.entity';
import { FindCompanyMembers } from '@/types/company/find-company-members';
import { QueryUniversalList } from '@/components/common/universal-list/list-query';
import { useCompanyFindAllMembersQuery } from '@/lib/api-endpoints';
import { ListHeader } from '@/components/common/universal-list/list-header';
import { useDebounce } from '@/hooks/use-debounce';
import { useState } from 'react';

export function CompanyDetailsToolbar({ company }: { company: ReturnCompany }) {
  const dictionary = useMessages();

  const { user: currentUser } = useAppSelector((state) => state.auth);
  const { activeCompany: currentCompany } = useAppSelector((state) => state.company);
  const { enterCompany, exitCompany } = useCompanySession();

  const [searchValue, setSearchValue] = useState<string>('');
  const debouncedSearch = useDebounce(searchValue, 500);

  const currentUserMembership = company?.members?.find(
    (member) => member.user.id === currentUser?.id,
  );

  const isMember = !!currentUserMembership;
  const isOwner = currentUserMembership?.role === CompanyRole.OWNER;
  const canManage = isOwner || currentUserMembership?.role === CompanyRole.ADMIN;

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4',
        !isMember ? 'md:grid-cols-1 lg:grid-cols-2' : 'md:grid-cols-2 xl:grid-cols-4',
      )}
    >
      <QueryUniversalList<FindCompanyMembers, CompanyUser>
        queryHook={useCompanyFindAllMembersQuery}
        queryParams={{
          where: {
            company: {
              id: company.id,
            },
          },
          search: debouncedSearch,
          relations: ['user'],
        }}
        paginator={true}
        rows={10}
        itemTemplate={(member: CompanyUser) => (
          <CompanyMemberListItem
            companyUser={{ ...member }}
            canManage={canManage}
            companyId={company.id}
          />
        )}
        emptyMessage={''}
        dialog
        dialogButtonIcon='pi-users'
        dialogButtonLabel={dictionary.companies.details.membersList.buttonLabel}
        dialogTitle={dictionary.companies.details.membersList.title}
        dialogTitleIcon='pi-users'
      >
        <ListHeader searchbar searchValue={searchValue} setSearchValue={setSearchValue} />
      </QueryUniversalList>

      {!isMember ? (
        <Button severity='info' variant='outlined'>
          <i className='pi pi-envelope' />
          {dictionary.companies.actions.sendRequest}
        </Button>
      ) : (
        <>
          {/* PLACEHOLDER */}
          <Button>
            <i className='pi pi-clipboard' />
            {dictionary.companies.details.quizzesList.title}
          </Button>
          {/* PLACEHOLDER */}
          {company.id === currentCompany?.id ? (
            <Link href={'/'} className='block w-full'>
              <Button
                severity='danger'
                variant='outlined'
                className='w-full justify-center'
                onClick={() => exitCompany()}
              >
                <i className='pi pi-sign-out' />
                {dictionary.companies.actions.exitCompany}
              </Button>
            </Link>
          ) : (
            <Button severity='success' variant='outlined' onClick={() => enterCompany(company)}>
              <i className='pi pi-sign-in' />
              {dictionary.companies.actions.enterCompany}
            </Button>
          )}
          {isOwner ? (
            <CompanyDetailsDeleteButton companyId={company.id} />
          ) : (
            <CompanyDetailsLeaveButton companyId={company.id} />
          )}
        </>
      )}
    </div>
  );
}
