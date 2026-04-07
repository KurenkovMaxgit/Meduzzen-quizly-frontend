'use client';

import { useMessages } from 'next-intl';
import { ReturnCompany } from '@/types/company/return-company';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Button } from '@primereact/ui/button';
import { Link } from '@/i18n/routing';
import { useGlobalToast } from '@/providers/toast-provider';
import Cookies from 'js-cookie';
import { ACTIVE_COMPANY_ID_KEY } from '@/utils/cookie-constants';
import { COMPANIES_ROUTE, HOME_ROUTE } from '@/utils/router-constants';
import { useCompanySession } from '@/hooks/use-company-session';

export const ChangeCompanyListItem = ({ company }: { company: ReturnCompany }) => {
  const dictionary = useMessages();
  const dispatch = useAppDispatch();
  const toast = useGlobalToast();

  const { activeCompany: currentCompany } = useAppSelector((state) => state.company);

  const { enterCompany, exitCompany } = useCompanySession();

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
        <Link href={`${COMPANIES_ROUTE}/${company.id}`}>
          <Button
            rounded
            variant='outlined'
            severity='contrast'
            className='shrink-0'
            title={dictionary.companies.actions.viewDetails}
          >
            <i className='pi pi-eye' />
          </Button>
        </Link>
        {company.id === currentCompany?.id ? (
          <Link href={HOME_ROUTE}>
            <Button
              rounded
              variant='outlined'
              severity='danger'
              onClick={() => exitCompany()}
              title={dictionary.companies.actions.exitCompany}
            >
              <i className='pi pi-sign-out' />
            </Button>
          </Link>
        ) : (
          <Link href={`${COMPANIES_ROUTE}/${company.id}`}>
            <Button
              rounded
              variant='outlined'
              severity='success'
              onClick={() => enterCompany(company)}
              title={dictionary.companies.actions.enterCompany}
            >
              <i className='pi pi-sign-in' />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
