import { currentCompany, mockCompanyList } from '@/mock/company-mock';
import { mockUser } from '@/mock/user-mock';
import { DialogRootChangeEvent } from '@primereact/types/shared/dialog';
import { Avatar } from '@primereact/ui/avatar';
import { Dialog } from '@primereact/ui/dialog';
import { Menu } from '@primereact/ui/menu';
import { Popover } from '@primereact/ui/popover';
import UniversalList from '../common/list';
import LocalizedLink from '../common/localized-link';
import { ChangeCompanyListItem } from '../companies/company-change-list-item';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useDictionary } from '@/providers/dictionary-provider';

export default function UserProfileTab() {
  const dictionary = useDictionary();
  const pathname = usePathname();

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsDialogOpen(false);
  }

  const signOut = () => {
    //TODO: Add handling
  };

  const exitCompany = () => {
    //TODO: Add handling
  };

  return (
    <div className='relative flex items-center'>
      <Popover.Root
        open={isPopoverOpen}
        onOpenChange={(e: DialogRootChangeEvent) => {
          const event = e as DialogRootChangeEvent & { open?: boolean; value?: boolean };
          setIsPopoverOpen(event.open ?? event.value ?? false);
        }}
      >
        <Popover.Trigger className='hover:bg-surface-100 dark:hover:bg-surface-800 flex w-auto cursor-pointer items-center gap-2 rounded-lg border-none bg-transparent p-2 transition-colors outline-none sm:w-56 sm:gap-3'>
          <Avatar.Root shape='circle' size='normal' className='shrink-0'>
            <Avatar.Fallback>{mockUser.firstName[0] + mockUser.lastName[0]}</Avatar.Fallback>
          </Avatar.Root>

          <div className='hidden min-w-0 flex-1 flex-col items-start text-left sm:flex'>
            <span className='text-surface-900 dark:text-surface-0 w-full truncate text-sm font-semibold'>
              {mockUser.firstName + ' ' + mockUser.lastName}
            </span>

            <p className='text-surface-300 w-full truncate text-sm'>
              {currentCompany
                ? currentCompany.name
                : `${dictionary.sidebar.profileDropdown.noCompany}`}
            </p>
          </div>

          <i className='pi pi-ellipsis-v hidden shrink-0 text-sm sm:block' />
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Positioner sideOffset={12} side='bottom' align='end'>
            <Popover.Popup className='border-surface-200 bg-surface-0 dark:border-surface-700 dark:bg-surface-900 w-48 overflow-hidden rounded-xl border shadow-lg'>
              <Popover.Content className='p-0!'>
                <div className='border-surface-200 dark:border-surface-700 mx-1 mt-3 mb-2 flex flex-col gap-1 border-b pb-2'>
                  <span className='text-surface-900 dark:text-surface-0 text-md w-full truncate px-2 font-semibold'>
                    {`${mockUser.firstName} ${mockUser.lastName}`}
                  </span>

                  <LocalizedLink
                    href={currentCompany ? `/companies/${currentCompany.id}` : '#'}
                    onClick={() => setIsPopoverOpen(false)}
                    className='hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-600 dark:text-surface-300 flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors'
                  >
                    <span className='line-clamp-2 font-medium break-all'>
                      {currentCompany
                        ? currentCompany.name
                        : `${dictionary.sidebar.profileDropdown.noCompany}`}
                    </span>
                    {currentCompany && (
                      <i className='pi pi-chevron-right text-surface-400 text-[10px]' />
                    )}
                  </LocalizedLink>
                </div>

                <Menu.Root className='w-full border-none! bg-transparent!'>
                  <Menu.List className='p-1!'>
                    <Menu.Item className='m-0! p-0!'>
                      <button
                        type='button'
                        onClick={() => {
                          setIsPopoverOpen(false);
                          setIsDialogOpen(true);
                        }}
                        className='text-surface-900 dark:text-surface-0 hover:bg-surface-100 dark:hover:bg-surface-800 flex w-full cursor-pointer items-center gap-3 rounded-md border-none bg-transparent px-3 py-2 text-left font-normal transition-colors outline-none'
                      >
                        <i className='pi pi-building text-surface-500 dark:text-surface-400' />
                        {currentCompany
                          ? `${dictionary.sidebar.profileDropdown.changeCompany}`
                          : `${dictionary.companies.actions.enterCompany}`}
                      </button>
                    </Menu.Item>

                    <Menu.Item className='m-0! p-0!'>
                      <LocalizedLink
                        href={`/profile/${mockUser?.id || ''}`}
                        onClick={() => setIsPopoverOpen(false)}
                        className='text-surface-900 dark:text-surface-0 hover:bg-surface-100 dark:hover:bg-surface-800 flex w-full items-center gap-3 rounded-md px-3 py-2 transition-colors'
                      >
                        <i className='pi pi-user text-surface-500 dark:text-surface-400' />
                        {dictionary.sidebar.profileDropdown.viewProfile}
                      </LocalizedLink>
                    </Menu.Item>

                    <Menu.Separator className='my-1' />

                    <Menu.Item className='m-0! p-0!'>
                      <button
                        type='button'
                        className='hover:bg-surface-100 dark:hover:bg-surface-800 flex w-full items-center gap-3 rounded-md border-none bg-transparent px-3 py-2 text-left text-red-600 transition-colors outline-none dark:text-red-400'
                        onClick={() => exitCompany()}
                      >
                        <i className='pi pi-sign-out opacity-80' />
                        {dictionary.companies.actions.exitCompany}
                      </button>
                    </Menu.Item>

                    <Menu.Item className='m-0! p-0!'>
                      <button
                        type='button'
                        className='hover:bg-surface-100 dark:hover:bg-surface-800 flex w-full items-center gap-3 rounded-md border-none bg-transparent px-3 py-2 text-left text-red-600 transition-colors outline-none dark:text-red-400'
                        onClick={() => signOut()}
                      >
                        <i className='pi pi-power-off opacity-80' />
                        {dictionary.sidebar.profileDropdown.signOut}
                      </button>
                    </Menu.Item>
                  </Menu.List>
                </Menu.Root>
              </Popover.Content>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>

      <Dialog.Root
        modal
        dismissableMask
        open={isDialogOpen}
        onOpenChange={(e: DialogRootChangeEvent) => {
          const event = e as DialogRootChangeEvent & { open?: boolean; value?: boolean };
          setIsDialogOpen(event.open ?? event.value ?? false);
        }}
        draggable={false}
      >
        <Dialog.Backdrop className='cursor-pointer' />

        <Dialog.Portal className='w-[95vw] max-w-full sm:w-3xl' style={{ zIndex: 2000 }}>
          <Dialog.Header className='border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 mb-1 rounded-t-xl border-b p-4'>
            <Dialog.Title className='flex w-full items-center gap-2'>
              <i className='pi pi-building text-surface-500 dark:text-surface-400' />
              {dictionary.sidebar.changeCompanyDialog.title}
            </Dialog.Title>
            <Dialog.HeaderActions>
              <Dialog.Close onClick={() => setIsDialogOpen(false)}>
                <i className='pi pi-times' />
              </Dialog.Close>
            </Dialog.HeaderActions>
          </Dialog.Header>

          <Dialog.Content>
            {() => {
              return (
                <div className='flex max-h-[75vh] flex-col gap-4 pt-3 sm:gap-6'>
                  <div className='mx-auto w-full max-w-5xl'>
                    <UniversalList
                      className='bg-surface-0 dark:bg-surface-900 w-full rounded-2xl'
                      items={mockCompanyList}
                      itemTemplate={ChangeCompanyListItem}
                      isLoading={false}
                      emptyMessage='No companies found.'
                    />
                  </div>
                </div>
              );
            }}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
