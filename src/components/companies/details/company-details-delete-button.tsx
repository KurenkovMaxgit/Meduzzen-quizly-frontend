import { useRouter } from '@/i18n/routing';
import { ApiResponse } from '@/interfaces/common/api-response-interface';
import { useAppDispatch } from '@/lib/hooks';
import { useCompanyDeleteOneByIdMutation } from '@/lib/api-endpoints';
import { clearActiveCompany } from '@/lib/slices/company-slice';
import { useGlobalToast } from '@/providers/toast-provider';
import { useLocale, useMessages } from 'next-intl';
import { Popover, PopoverRootOpenChangeEvent } from '@primereact/ui/popover';
import { Button } from '@primereact/ui/button';
import { useState } from 'react';

export function CompanyDetailsDeleteButton({ companyId }: { companyId: string }) {
  const dictionary = useMessages();
  const currentLocale = useLocale();
  const router = useRouter();
  const toast = useGlobalToast();
  const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deleteCompany, { isLoading: isDeleting }] = useCompanyDeleteOneByIdMutation();

  const handleDeleteCompany = async () => {
    try {
      const createdCompany: ApiResponse<unknown> = await deleteCompany(companyId).unwrap();

      if (createdCompany.data) {
        dispatch(clearActiveCompany());

        router.push(`/${currentLocale}/`);

        toast.showToast('success', dictionary.toast.company.delete.success);
      }
    } catch {
      toast.showToast('error', dictionary.toast.company.delete.error);
    }
  };

  return (
    <Popover.Root
      trapped
      closeOnEscape
      open={isOpen}
      onOpenChange={(e: PopoverRootOpenChangeEvent) => setIsOpen(!!e.value)}
    >
      <Popover.Trigger
        as={Button}
        severity='danger'
        variant='outlined'
        className='w-full justify-center'
      >
        <i className='pi pi-trash' />
        {dictionary.companies.actions.deleteCompany}
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Positioner>
          <Popover.Popup>
            <Popover.Arrow />
            <Popover.Content>
              <div className='border-surface-200 dark:border-surface-700 flex items-center gap-3 border-b p-2 pb-3'>
                <i className='pi pi-exclamation-triangle my-1' />
                <p className='m-0'>{dictionary.companies.actions.deleteCompanyConfirmation}</p>
              </div>
            </Popover.Content>

            <Popover.Footer>
              <div className='flex flex-1 items-center justify-end gap-2'>
                <Button
                  size='small'
                  severity='contrast'
                  variant='outlined'
                  onClick={() => setIsOpen(false)}
                >
                  {dictionary.common.cancel}
                </Button>

                <Button size='small' severity='danger' onClick={() => handleDeleteCompany()}>
                  {dictionary.common.confirm}
                  {isDeleting && <i className='pi pi-spin pi-spinner ml-2' />}
                </Button>
              </div>
            </Popover.Footer>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
