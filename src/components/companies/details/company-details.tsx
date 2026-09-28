'use client';

import { useCompanyFindOneByIdQuery } from '@/lib/api-endpoints';
import { CompanyDetailsToolbar } from '@/components/companies/details/company-details-toolbar';
import { CompanyStatus, CompanyRole } from '@/utils/enums';
import { useMessages } from 'next-intl';
import { CompanyUser } from '@/entities/company-user.entity';
import { useAppSelector } from '@/lib/hooks';
import { Button } from '@primereact/ui/button';
import { cn } from '@/utils/cn';
import { useRouter } from '@/i18n/routing';
import { CompanyHeaderActions } from './company-details-header-actions';
import { CompanyNotFound } from './company-details-not-found';
import dynamic from 'next/dynamic';
import { CompanyDetailsSkeleton } from './company-details-skeletons';

export const CompanyDetailsClient = dynamic(
  () => import('./company-details').then((mod) => mod.CompanyDetails),
  {
    ssr: false,
    loading: () => <CompanyDetailsSkeleton />,
  },
);

export function CompanyDetails({ companyId }: { companyId: string }) {
  const dictionary = useMessages();
  const router = useRouter();

  const { user: currentUser } = useAppSelector((state) => state.auth);

  const { data: response, isLoading } = useCompanyFindOneByIdQuery({
    id: companyId,
    relations: ['members.user'],
  });
  const company = response?.data;

  if (isLoading) {
    return <CompanyDetailsSkeleton />;
  }

  if (!company) {
    return <CompanyNotFound />;
  }

  const hasEditPermission = company.members?.some(
    (user: CompanyUser) =>
      (user.user.id === currentUser?.id && user.role === CompanyRole.OWNER) ||
      user.role === CompanyRole.ADMIN,
  );

  return (
    <div className='mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 md:p-8'>
      <div className='flex w-full flex-col gap-6'>
        <div className='flex min-h-10 items-center justify-between'>
          <Button
            icon='pi pi-arrow-left'
            severity='secondary'
            variant='text'
            onClick={() => router.back()}
          >
            <i className='pi pi-arrow-left' />
            {dictionary.common.back}
          </Button>

          <CompanyHeaderActions company={company} hasEditPermission={hasEditPermission!} />
        </div>

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
                  {company.status === CompanyStatus.VISIBLE
                    ? dictionary.companies.details.statusVisible
                    : company.status === CompanyStatus.HIDDEN &&
                      dictionary.companies.details.statusHidden}
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
      </div>
    </div>
  );
}
