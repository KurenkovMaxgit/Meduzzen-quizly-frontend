'use client';

import { useState } from 'react';
import { Dialog, type DialogRootChangeEvent } from '@primereact/ui/dialog';
import { useMessages } from 'next-intl';
import CreateCompanyDialogContent from '../company-create-dialog-content';
import { Button } from '@primereact/ui/button';

export function CreateCompanyAction() {
  const dictionary = useMessages();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(event: DialogRootChangeEvent) => {
        setIsOpen(Boolean(event.value));
      }}
      position='center'
      draggable={false}
      modal
      dismissable
    >
      <Dialog.Trigger as={Button} className='w-full py-3 font-semibold'>
        <i className='pi pi-plus me-2' />
        {dictionary.home.createCompanyTile.buttonLabel}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Popup className='w-[95vw] max-w-full transform-gpu antialiased sm:w-md'>
            <Dialog.Header>
              <Dialog.Title>{dictionary.companies.createDialog.title}</Dialog.Title>

              <Dialog.HeaderActions>
                <Dialog.Close as={Button}>
                  <i className='pi pi-times' />
                </Dialog.Close>
              </Dialog.HeaderActions>
            </Dialog.Header>

            <Dialog.Content>
              <CreateCompanyDialogContent closeDialogAction={() => setIsOpen(false)} />
            </Dialog.Content>
          </Dialog.Popup>
        </Dialog.Positioner>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
