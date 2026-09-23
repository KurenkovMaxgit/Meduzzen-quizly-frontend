import { Button } from '@primereact/ui/button';
import { Dialog, DialogContentInstance } from '@primereact/ui/dialog';
import EditCompanyDialogContent from '@/components/companies/company-edit-dialog-content';
import { useMessages } from 'next-intl';
import { ReturnCompany } from '@/types/company/return-company';
import { useState } from 'react';

export function CompanyHeaderActions({
  company,
  hasEditPermission,
}: {
  company: ReturnCompany;
  hasEditPermission: boolean;
}) {
  const dictionary = useMessages();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  if (!hasEditPermission) return null;

  return (
    <Dialog.Root open={isOpen} position='center' draggable={false}>
      <Dialog.Trigger
        as={Button}
        rounded
        className='flex py-3 font-semibold'
        onClick={() => setIsOpen(true)}
      >
        <i className='pi pi-pencil my-1' />
        <h3 className='m-0 hidden sm:block'>{dictionary.companies.editDialog.title}</h3>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner onClick={() => setIsOpen(false)}>
          <Dialog.Popup className='w-[95vw] max-w-full sm:w-md'>
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
          </Dialog.Popup>
        </Dialog.Positioner>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
