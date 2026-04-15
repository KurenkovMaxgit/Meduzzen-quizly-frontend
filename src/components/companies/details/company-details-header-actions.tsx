import { Button } from '@primereact/ui/button';
import { Dialog } from '@primereact/ui/dialog';
import { DialogContentInstance } from '@primereact/types/shared/dialog';
import EditCompanyDialogContent from '@/components/companies/company-edit-dialog-content';
import { useMessages } from 'next-intl';
import { ReturnCompany } from '@/types/company/return-company';

export function CompanyHeaderActions({
  company,
  hasEditPermission,
}: {
  company: ReturnCompany;
  hasEditPermission: boolean;
}) {
  const dictionary = useMessages();

  if (!hasEditPermission) return null;

  return (
    <Dialog.Root modal position='center' draggable={false}>
      <Dialog.Trigger as={Button} rounded>
        <i className='pi pi-pencil my-1' />
        <h3 className='m-0 hidden sm:block'>{dictionary.companies.editDialog.title}</h3>
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
  );
}
