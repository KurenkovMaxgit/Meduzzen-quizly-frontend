'use client';

import { currentCompany, mockCompany } from '@/mock/company-mock';
import { Button } from '@primereact/ui/button';
import Link from 'next/link';

export const ChangeCompanyListItem = (company: typeof mockCompany) => {
  const logInCompany = async () => {
    //TODO: Add handling
  };

  const logOutOfCompany = async () => {
    //TODO: Add handling
  };

  return (
    <div className='bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 mb-4 flex w-full flex-col justify-between gap-4 rounded-xl border p-4 shadow-sm sm:flex-row sm:items-center'>
      <div className='flex min-w-0 flex-col gap-1'>
        <div className='flex items-center gap-3'>
          <span className='text-surface-900 dark:text-surface-0 truncate text-xl font-bold'>
            {company.name}
          </span>
        </div>
        <span className='text-surface-600 dark:text-surface-400 truncate text-sm'>
          {company.description}
        </span>
      </div>
      <div className='flex shrink-0 justify-end gap-4 sm:ml-auto sm:items-center'>
        <Link href={`/companies/${company.id}`}>
          <Button
            rounded
            variant='outlined'
            severity='contrast'
            className='shrink-0'
            title='View company details'
          >
            <i className='pi pi-eye' />
          </Button>
        </Link>
        {company.id === currentCompany?.id ? (
          <Button
            rounded
            variant='outlined'
            severity='danger'
            onClick={() => logOutOfCompany()}
            title='Exit company'
          >
            <i className='pi pi-sign-out' />
          </Button>
        ) : (
          <Button
            rounded
            variant='outlined'
            severity='success'
            onClick={() => logInCompany()}
            title='Enter company'
          >
            <i className='pi pi-sign-in' />
          </Button>
        )}
      </div>
    </div>
  );
};
