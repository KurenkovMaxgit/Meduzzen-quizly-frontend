'use client';

import { mockCompany } from '@/mock/company-mock';
import { useMessages } from 'next-intl';
import { Button } from '@primereact/ui/button';
import { Link } from '@/i18n/routing';
import { COMPANIES_ROUTE } from '@/utils/router-constants';
import { ReturnCompany } from '@/types/company/return-company';
import { useAppSelector } from '@/lib/hooks';
import { useCompanySession } from '@/hooks/use-company-session';

export const CompanyListItem = (company: ReturnCompany) => {
  const dictionary = useMessages();

  const currentUser = useAppSelector((state) => state.auth.user);
  const { activeCompany: currentCompany } = useAppSelector((state) => state.company);

  const isMember = company.members?.some((member) => member.user.id === currentUser?.id);

  const { enterCompany, exitCompany } = useCompanySession();

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
        {isMember ? (
          company.id === currentCompany?.id ? (
            <Button
              rounded
              variant='outlined'
              severity='danger'
              onClick={() => exitCompany()}
              title={dictionary.companies.actions.exitCompany}
            >
              <i className='pi pi-sign-out' />
            </Button>
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
          )
        ) : (
          <Button
            rounded
            variant='outlined'
            severity='info'
            onClick={() => handleSendRequest()}
            title={dictionary.companies.actions.sendRequest}
          >
            <i className='pi pi-envelope' />
          </Button>
        )}
      </div>
    </div>
  );
};
