'use client';

import { useCompanyControllerFindOneByIdQuery } from '@/lib/quizly-api';
import { CompanyDetailsToolbar } from '@/components/companies/company-details-toolbar';
import { CompanyStatus, CompanyRole } from '@/utils/enums';
import { mockUser } from '@/mock/user-mock';
import { EditCompanyDialog } from '@/components/companies/company-edit-dialog';
import { useDictionary } from '@/providers/dictionary-provider';
import { CompanyUser } from '@/entities/company-user.entity';
import { cn } from '@/utils/cn';

export function CompanyFetcher({ companyId }: { companyId: string }) {
  const { data: response, isLoading } = useCompanyControllerFindOneByIdQuery({ id: companyId });
  const company = response?.data;

  const dictionary = useDictionary();

  if (isLoading || !company) {
    return (
      <div className='bg-surface-200 dark:bg-surface-700 h-64 w-full animate-pulse rounded-2xl'></div>
    );
  }

  const hasEditPermission = company.members?.some(
    (user: CompanyUser) =>
      (user.user.id === mockUser.id && user.role === CompanyRole.OWNER) ||
      user.role === CompanyRole.ADMIN,
  );

  return (
    <>
      {hasEditPermission && (
        <div className='mb-4 flex items-center justify-end'>
          <EditCompanyDialog company={company} />
        </div>
      )}

      <div className='bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 flex w-full flex-col rounded-2xl border p-6 shadow-sm sm:p-8'>
        <div className='flex flex-col gap-8 md:flex-row md:items-start'>
          <div className='flex w-full flex-col gap-6'>
            <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
              <h1 className='text-surface-900 dark:text-surface-0 m-0 w-full text-2xl font-bold wrap-break-word break-all sm:text-3xl'>
                {company.name}
              </h1>
              <div
                className={cn(
                  'flex shrink-0 items-center gap-2 self-start rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase',
                  company.status === CompanyStatus.VISIBLE
                    ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                    : 'bg-surface-100 text-surface-700 dark:bg-surface-500/20 dark:text-surface-400',
                )}
              >
                <i
                  className={cn(
                    'pi text-[10px]',
                    company.status === CompanyStatus.VISIBLE ? 'pi-check-circle' : 'pi-eye-slash',
                  )}
                />
                {company.status}
              </div>
            </div>

            <div className='bg-surface-50 dark:bg-surface-800/50 rounded-xl p-5'>
              <h3 className='text-surface-500 m-0 mb-2 text-xs font-bold tracking-wider uppercase'>
                {dictionary.companies.details.about}
              </h3>
              <p className='text-surface-700 dark:text-surface-300 m-0 leading-relaxed'>
                {company.description}
              </p>
            </div>

            <CompanyDetailsToolbar company={company} />
          </div>
        </div>
      </div>
    </>
  );
}
