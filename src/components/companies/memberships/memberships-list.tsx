'use client';

import { CompanyListItem } from '@/components/companies/list-items/company-list-item';
import { useCompanyFindAllQuery } from '@/lib/api-endpoints';
import { ReturnCompany } from '@/types/company/return-company';
import { useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { useMessages } from 'next-intl';
import { FindCompany } from '@/types/company/find-company';
import { useAppSelector } from '@/lib/hooks';
import { ListHeader } from '@/components/common/universal-list/list-header';
import { QueryUniversalList } from '@/components/common/universal-list/list-query';

export function MembershipsList() {
  const dictionary = useMessages();

  const { user: currentUser } = useAppSelector((state) => state.auth);

  const [searchValue, setSearchValue] = useState<string>('');

  const debouncedSearch = useDebounce(searchValue, 500);

  return (
    <QueryUniversalList<FindCompany, ReturnCompany>
      queryHook={useCompanyFindAllQuery}
      queryParams={{
        where: {
          members: { user: { id: currentUser?.id } },
        },
        search: debouncedSearch,
        order: { name: 'ASC' },
        relations: ['members.user'],
      }}
      paginator={true}
      rows={10}
      itemTemplate={(company: ReturnCompany) => <CompanyListItem {...company} />}
      emptyMessage={dictionary.companies.emptyMessage}
    >
      <ListHeader
        title={dictionary.memberships.listHeader.title}
        searchbar
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
    </QueryUniversalList>
  );
}
