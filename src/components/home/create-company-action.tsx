'use client';

import { useState } from 'react';
import { Dialog } from '@primereact/ui/dialog';
import { useMessages } from 'next-intl';
import CreateCompanyDialogContent from '../companies/company-create-dialog-content';

export function CreateCompanyAction() {
  const dictionary = useMessages();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog.Root open={isOpen} position='center' modal draggable={false}>
      <Dialog.Trigger className='w-full py-3 font-semibold' onClick={() => setIsOpen(true)}>
        <i className='pi pi-plus me-2' />
        {dictionary.home.createCompanyTile.buttonLabel}
      </Dialog.Trigger>

      <Dialog.Backdrop className='cursor-pointer' onClick={() => setIsOpen(false)} />
      <Dialog.Portal className='w-[95vw] max-w-full transform-gpu antialiased sm:w-md'>
        <Dialog.Header>
          <Dialog.Title>{dictionary.companies.createDialog.title}</Dialog.Title>

          <Dialog.HeaderActions>
            <Dialog.Close onClick={() => setIsOpen(false)}>
              <i className='pi pi-times' />
            </Dialog.Close>
          </Dialog.HeaderActions>
        </Dialog.Header>

        <Dialog.Content>
          <CreateCompanyDialogContent closeDialog={() => setIsOpen(false)} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
