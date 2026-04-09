'use client';

import { Button } from '@primereact/ui/button';
import { Link } from '@/i18n/routing';
import { useMessages } from 'next-intl';
import { COMPANIES_ROUTE } from '@/utils/router-constants';

export function HomePageTiles() {
  const dictionary = useMessages();

  const handleCreateCompany = () => {};

  return (
    <div className='mx-auto flex w-full max-w-5xl flex-col gap-8 md:flex-row'>
      <div className='border-surface-200 bg-surface-0 dark:border-surface-700 dark:bg-surface-900 flex flex-1 flex-col rounded-2xl border p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'>
        <div className='mb-6 flex items-center gap-4'>
          <div className='bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 flex h-14 w-14 items-center justify-center rounded-xl shadow-sm'>
            <i className='pi pi-building text-2xl' />
          </div>
          <h2 className='text-surface-900 dark:text-surface-0 text-2xl font-bold'>
            {dictionary.home.createCompanyTile.title}
          </h2>
        </div>
        <p className='text-surface-600 dark:text-surface-400 mb-8 flex-1 leading-relaxed'>
          {dictionary.home.createCompanyTile.description}
        </p>
        <div className='mt-auto'>
          <Button onClick={handleCreateCompany} className='w-full py-3 font-semibold'>
            <i className='pi pi-plus me-2' />
            {dictionary.home.createCompanyTile.buttonLabel}
          </Button>
        </div>
      </div>

      <div className='border-surface-200 bg-surface-0 dark:border-surface-700 dark:bg-surface-900 flex flex-1 flex-col rounded-2xl border p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'>
        <div className='mb-6 flex items-center gap-4'>
          <div className='bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 flex h-14 w-14 items-center justify-center rounded-xl'>
            <i className='pi pi-search text-primary text-2xl' />
          </div>
          <h2 className='text-surface-900 dark:text-surface-0 text-2xl font-bold'>
            {dictionary.home.joinCompanyTile.title}
          </h2>
        </div>
        <p className='text-surface-600 dark:text-surface-400 mb-8 flex-1 leading-relaxed'>
          {dictionary.home.joinCompanyTile.description}
        </p>
        <div className='mt-auto'>
          <Link href={COMPANIES_ROUTE} className='block w-full'>
            <Button variant='outlined' className='w-full py-3 font-semibold'>
              <i className='pi pi-search me-2' />
              {dictionary.home.joinCompanyTile.buttonLabel}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
