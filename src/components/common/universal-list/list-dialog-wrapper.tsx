'use client';

import { Button } from '@primereact/ui/button';
import { Dialog } from '@primereact/ui/dialog';

export function ListDialogWrapper({
  title,
  titleIcon,
  buttonLabel,
  buttonIcon,
  children,
}: {
  title?: string;
  titleIcon?: string;
  buttonLabel?: string;
  buttonIcon?: string;
  children: React.ReactNode;
}) {
  return (
    <Dialog.Root modal position='center' draggable={false}>
      <Dialog.Trigger as={Button} className='flex w-full justify-center gap-2'>
        {buttonIcon && <i className={`pi ${buttonIcon}`} />}
        {buttonLabel}
      </Dialog.Trigger>

      <Dialog.Backdrop className='cursor-pointer' />
      <Dialog.Portal className='w-[95vw] max-w-full sm:w-160'>
        <Dialog.Header className='border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 mb-4 flex items-center justify-between rounded-t-xl border-b p-4'>
          <Dialog.Title className='m-0 flex items-center gap-3 text-2xl font-bold'>
            {titleIcon && (
              <i className={`pi ${titleIcon} text-surface-500 dark:text-surface-400`} />
            )}
            {title}
          </Dialog.Title>

          <Dialog.HeaderActions>
            <Dialog.Close className='hover:bg-surface-100 dark:hover:bg-surface-800 flex h-8 w-8 items-center justify-center rounded-full transition-colors outline-none'>
              <i className='pi pi-times text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-0' />
            </Dialog.Close>
          </Dialog.HeaderActions>
        </Dialog.Header>
        <Dialog.Content>
          <div className='max-h-[75vh] overflow-y-auto p-1'>{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
