'use client';

import { CompanyListItem } from '@/components/companies/list-items/company-list-item';
import { useCompanyFindAllQuery } from '@/lib/api-endpoints';
import { ReturnCompany } from '@/types/company/return-company';
import { CompanyStatus } from '@/utils/enums';
import { useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { Dialog } from '@primereact/ui/dialog';
import CreateCompanyDialogContent from './company-create-dialog-content';
import { useMessages } from 'next-intl';
import { FindCompany } from '@/types/company/find-company';
import { QueryUniversalList } from '../common/universal-list/list-query';
import { ListHeader } from '../common/universal-list/list-header';

export function CompaniesListClient() {
  const dictionary = useMessages();

  const [searchValue, setSearchValue] = useState<string>('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);

  const debouncedSearch = useDebounce(searchValue, 500);

  return (
    <>
      <QueryUniversalList<FindCompany, ReturnCompany>
        queryHook={useCompanyFindAllQuery}
        queryParams={{
          where: {
            status: CompanyStatus.VISIBLE,
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
          title={dictionary.companies.listHeader.title}
          buttonLabel={dictionary.companies.listHeader.buttonLabel}
          onButtonClick={() => setIsCreateDialogOpen(true)}
          searchbar
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
      </QueryUniversalList>

      <Dialog.Root open={isCreateDialogOpen} position='center' modal draggable={false}>
        <Dialog.Backdrop className='cursor-pointer' />
        <Dialog.Portal className='w-[95vw] max-w-full transform-gpu antialiased sm:w-md'>
          <Dialog.Header>
            <Dialog.Title>{dictionary.companies.createDialog.title}</Dialog.Title>

            <Dialog.HeaderActions>
              <Dialog.Close onClick={() => setIsCreateDialogOpen(false)}>
                <i className='pi pi-times' />
              </Dialog.Close>
            </Dialog.HeaderActions>
          </Dialog.Header>

          <Dialog.Content>
            <CreateCompanyDialogContent closeDialog={() => setIsCreateDialogOpen(false)} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
