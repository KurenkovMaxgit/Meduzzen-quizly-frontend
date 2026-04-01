'use client';

import { mockCompany } from '@/mock/company-mock';
import { useDictionary } from '@/providers/dictionary-provider';
import { Button } from '@primereact/ui/button';
import LocalizedLink from '../common/localized-link';

export const CompanyListItem = (company: typeof mockCompany) => {
  const dictionary = useDictionary();

  const handleSendRequest = async () => {
    //TODO: Add handling
  };

  return (
    <div className='bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 mb-4 flex flex-col justify-between gap-4 rounded-xl border p-4 shadow-sm sm:flex-row sm:items-center'>
      <div className='flex flex-col gap-1'>
        <div className='flex items-center gap-3'>
          <span className='text-surface-900 dark:text-surface-0 text-xl font-bold'>
            {company.name}
          </span>
        </div>
        <span className='text-surface-600 dark:text-surface-400 text-sm'>
          {company.description}
        </span>
      </div>
      <div className='flex items-center gap-4 sm:ml-auto'>
        <LocalizedLink href={`/companies/${company.id}`}>
          <Button
            rounded
            variant='outlined'
            severity='contrast'
            className='shrink-0'
            title={dictionary.companies.actions.viewDetails}
          >
            <i className='pi pi-eye' />
          </Button>
        </LocalizedLink>
        <Button
          rounded
          variant='outlined'
          severity='success'
          onClick={() => handleSendRequest()}
          title={dictionary.companies.actions.sendRequest}
        >
          <i className='pi pi-envelope' />
        </Button>
      </div>
    </div>
  );
};
