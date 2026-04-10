'use client';

import { CompanyListItem } from '@/components/companies/company-list-item';
import { useCompanyControllerFindAllQuery } from '@/lib/quizly-api';
import { QueryUniversalList } from '@/components/common/list-query';
import { ReturnCompany } from '@/types/company/return-company';
import { CompanyStatus } from '@/utils/enums';
import { ListHeader } from '../common/list-header';
import { useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { Dialog } from '@primereact/ui/dialog';
import CreateCompanyDialogContent from './company-create-dialog-content';
import { useMessages } from 'next-intl';

export function CompaniesListClient() {
  const dictionary = useMessages();

  const [searchValue, setSearchValue] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const debouncedSearch = useDebounce(searchValue, 500);

  return (
    <>
      <QueryUniversalList
        queryHook={useCompanyControllerFindAllQuery}
        queryParams={{
          where: {
            status: CompanyStatus.VISIBLE,
          },
          search: debouncedSearch,
          sort: 'ASC',
          relations: 'members.user',
        }}
        paginator={true}
        rows={12}
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
