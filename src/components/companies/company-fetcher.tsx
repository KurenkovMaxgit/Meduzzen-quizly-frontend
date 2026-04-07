'use client';

import { useCompanyControllerFindOneByIdQuery } from '@/lib/quizly-api';
import { CompanyDetailsToolbar } from '@/components/companies/company-details-toolbar';
import { CompanyStatus, CompanyRole } from '@/utils/enums';
import { EditCompanyDialog } from '@/components/companies/company-edit-dialog-content';
import { useMessages } from 'next-intl';
import { CompanyUser } from '@/entities/company-user.entity';
import { useAppSelector } from '@/lib/hooks';
import { useEffect, useState } from 'react';
import { Skeleton } from '@primereact/ui/skeleton';
import { Button } from '@primereact/ui/button';
import { useRouter } from 'next/navigation';
import { Dialog } from '@primereact/ui/dialog';
import { DialogContentInstance } from '@primereact/types/shared/dialog';
import EditCompanyDialogContent from '@/components/companies/company-edit-dialog-content';
import { cn } from '@/utils/cn';

export function CompanyFetcher({ companyId }: { companyId: string }) {
  const dictionary = useMessages();
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);
  const { user: currentUser } = useAppSelector((state) => state.auth);

  const { data: response, isLoading } = useCompanyControllerFindOneByIdQuery({
    id: companyId,
    relations: 'members.user',
  });
  const company = response?.data;

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setIsMounted(true);
    });

    return () => cancelAnimationFrame(frameId);
  }, []);

  if (!isMounted || isLoading || !company) {
    return (
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
        </div>
        <Skeleton
          width='100%'
          height='16rem'
          borderRadius='16px'
          className='bg-surface-200 dark:bg-surface-700'
        />
      </div>
    );
  }

  const hasEditPermission = company.members?.some(
    (user: CompanyUser) =>
      (user.user.id === currentUser?.id && user.role === CompanyRole.OWNER) ||
      user.role === CompanyRole.ADMIN,
  );

  return (
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

        {hasEditPermission && (
          <Dialog.Root modal position='center' draggable={false}>
            <Dialog.Trigger>
              <i className='pi pi-pencil' />
              <h3 className='hidden sm:block'>{dictionary.companies.editDialog.title}</h3>
            </Dialog.Trigger>

            <Dialog.Backdrop className='cursor-pointer' />

            <Dialog.Portal className='w-[95vw] max-w-full sm:w-md'>
              <Dialog.Header>
                <Dialog.Title>{dictionary.companies.editDialog.title}</Dialog.Title>
                <Dialog.HeaderActions>
                  <Dialog.Close>
                    <i className='pi pi-times' />
                  </Dialog.Close>
                </Dialog.HeaderActions>
              </Dialog.Header>

              <Dialog.Content>
                {(instance: DialogContentInstance) => (
                  <EditCompanyDialogContent
                    company={company}
                    closeDialog={instance.dialog?.close as () => void}
                  />
                )}
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        )}
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
    </div>
  );
}
