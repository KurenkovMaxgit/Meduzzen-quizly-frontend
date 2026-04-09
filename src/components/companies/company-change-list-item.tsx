'use client';

import { useDictionary } from '@/providers/dictionary-provider';
import { ReturnCompany } from '@/types/company/return-company';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { clearActiveCompany, setActiveCompany } from '@/lib/slices/company-slice';
import { Button } from '@primereact/ui/button';
import { LocalizedLink } from '../common/localized-link';
import { useGlobalToast } from '@/providers/toast-provider';
import Cookies from 'js-cookie';
import { ACTIVE_COMPANY_ID_KEY } from '@/utils/cookie-constants';
import { COMPANIES_ROUTE } from '@/utils/router-constants';

export const ChangeCompanyListItem = ({ company }: { company: ReturnCompany }) => {
  const dictionary = useDictionary();
  const dispatch = useAppDispatch();
  const toast = useGlobalToast();

  const { user: currentUser } = useAppSelector((state) => state.auth);
  const { activeCompany: currentCompany } = useAppSelector((state) => state.company);

  const enterCompany = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { members, ...companyWithoutMembers } = company;
    dispatch(
      setActiveCompany({
        company: companyWithoutMembers,
        role: company.members.find((member) => member.user.id === currentUser?.id)!.role,
      }),
    );

    Cookies.set(ACTIVE_COMPANY_ID_KEY, company.id, { expires: 7 });

    toast.showToast('success', {
      summary: dictionary.toast.company.enter.success.summary,
      detail: `${dictionary.toast.company.enter.success.detail} ${company.name}`,
    });
  };

  const exitCompany = () => {
    dispatch(clearActiveCompany());

    Cookies.remove(ACTIVE_COMPANY_ID_KEY);

    toast.showToast('info', dictionary.toast.company.exit.success);
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
        <LocalizedLink href={`${COMPANIES_ROUTE}/${company.id}`}>
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
        {company.id === currentCompany?.id ? (
          <LocalizedLink href={'/'}>
            <Button
              rounded
              variant='outlined'
              severity='danger'
              onClick={() => exitCompany()}
              title={dictionary.companies.actions.exitCompany}
            >
              <i className='pi pi-sign-out' />
            </Button>
          </LocalizedLink>
        ) : (
          <LocalizedLink href={`${COMPANIES_ROUTE}/${company.id}`}>
            <Button
              rounded
              variant='outlined'
              severity='success'
              onClick={() => enterCompany()}
              title={dictionary.companies.actions.enterCompany}
            >
              <i className='pi pi-sign-in' />
            </Button>
          </LocalizedLink>
        )}
      </div>
    </div>
  );
};
