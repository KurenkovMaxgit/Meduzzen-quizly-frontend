'use client';

import { Avatar } from '@primereact/ui/avatar';
import { Menu } from '@primereact/ui/menu';
import { Popover } from '@primereact/ui/popover';
import * as React from 'react';
import { useState } from 'react';
import ThemeSwitcher from './theme-switcher';
import { mockUser } from '@/mock/user-mock';
import { currentCompany, mockCompanyList } from '@/mock/company-mock';
import { Dialog } from '@primereact/ui/dialog';
import { DialogRootChangeEvent } from '@primereact/types/shared/dialog';
import UniversalList from '../common/list';
import { ChangeCompanyListItem } from '../companies/company-change-list-item';
import { usePathname } from 'next/navigation';
import { useDictionary } from '@/providers/dictionary-provider';
import LanguageSwitcher from './language-switcher';
import LocalizedLink from '../common/localized-link';

export default function Sidebar({
  children,
}: Readonly<{
  children?: React.ReactNode;
}>) {
  const dictionary = useDictionary();

  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
    setIsDialogOpen(false);
  }

  const signOut = () => {
    //TODO: Add handling
  };

  const exitCompany = () => {
    //TODO: Add handling
  };

  return (
    <div className='bg-surface-50 dark:bg-surface-950 flex h-screen overflow-hidden'>
      {isOpen && (
        <div
          className='fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden'
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className='flex-1 overflow-y-auto p-4'>
          <div className='mt-2 mb-4 hidden items-center justify-between gap-4 ps-4 lg:flex'>
            <LocalizedLink href='/'>
              <div className='text-primary text-2xl font-bold'>Quizly</div>
            </LocalizedLink>
            <LanguageSwitcher />
          </div>
          <div className='ms-2 mt-2 mb-4 flex items-center justify-between lg:hidden'>
            <LocalizedLink href='/'>
              <span className='text-primary text-2xl font-bold'>Quizly</span>
            </LocalizedLink>
            <LanguageSwitcher />
          </div>

          <Menu.Root className='w-full border-none! bg-transparent!'>
            <Menu.List className='p-0!'>
              <Menu.Sub defaultOpen={false}>
                <Menu.Trigger>
                  <i className='pi pi-building' /> {dictionary.sidebar.companiesDropdown.title}
                  <Menu.Icon />
                </Menu.Trigger>

                <Menu.List>
                  <Menu.Item>
                    <LocalizedLink href='/companies' className='flex w-full items-center gap-2'>
                      <i className='pi pi-list' />
                      {dictionary.sidebar.companiesDropdown.allCompanies}
                    </LocalizedLink>
                  </Menu.Item>

                  <Menu.Item>
                    <LocalizedLink
                      href='/companies/memberships'
                      className='flex w-full items-center gap-2'
                    >
                      <i className='pi pi-users' />
                      {dictionary.sidebar.companiesDropdown.myMemberships}
                    </LocalizedLink>
                  </Menu.Item>
                </Menu.List>
              </Menu.Sub>

              {currentCompany ? (
                <Menu.Sub defaultOpen={true}>
                  <Menu.Trigger>
                    <i className='pi pi-th-large' />
                    {dictionary.sidebar.companyActionsDropdown.title}
                    <Menu.Icon />
                  </Menu.Trigger>

                  <Menu.List>
                    <Menu.Item>
                      <LocalizedLink
                        href={`/companies/${currentCompany.id}/members`}
                        className='flex w-full items-center gap-2'
                      >
                        <i className='pi pi-users' />
                        {dictionary.sidebar.companyActionsDropdown.membersList}
                      </LocalizedLink>
                    </Menu.Item>

                    <Menu.Item>
                      <LocalizedLink
                        href='/companies/memberships'
                        className='flex w-full items-center gap-2'
                      >
                        <i className='pi pi-clipboard' />
                        {dictionary.sidebar.companyActionsDropdown.quizzesList}
                      </LocalizedLink>
                    </Menu.Item>
                  </Menu.List>
                </Menu.Sub>
              ) : null}

              <Menu.Sub defaultOpen={true}>
                <Menu.Trigger>
                  <i className='pi pi-inbox' />
                  {dictionary.sidebar.inboxDropdown.title}
                  <Menu.Icon />
                </Menu.Trigger>

                <Menu.List>
                  <Menu.Item>
                    <LocalizedLink href='/messages' className='flex w-full items-center gap-2'>
                      <i className='pi pi-envelope' />
                      {dictionary.sidebar.inboxDropdown.allNotifications}
                    </LocalizedLink>
                  </Menu.Item>

                  <Menu.Item>
                    <LocalizedLink href='/messages/sent' className='flex w-full items-center gap-2'>
                      <i className='pi pi-send' />
                      {dictionary.sidebar.inboxDropdown.sentNotifications}
                    </LocalizedLink>
                  </Menu.Item>

                  <Menu.Item>
                    <LocalizedLink
                      href='/messages/received'
                      className='flex w-full items-center gap-2'
                    >
                      <i className='pi pi-download' />
                      {dictionary.sidebar.inboxDropdown.receivedNotifications}
                    </LocalizedLink>
                  </Menu.Item>

                  <Menu.Item>
                    <LocalizedLink
                      href='/messages/archived'
                      className='flex w-full items-center gap-2'
                    >
                      <i className='pi pi-folder' />
                      {dictionary.sidebar.inboxDropdown.archivedNotifications}
                    </LocalizedLink>
                  </Menu.Item>
                </Menu.List>
              </Menu.Sub>

              <Menu.Item>
                <LocalizedLink href='/about' className='flex w-full items-center gap-2'>
                  <i className='pi pi-info-circle' /> {dictionary.sidebar.about}
                </LocalizedLink>
              </Menu.Item>
            </Menu.List>
          </Menu.Root>
        </div>
      </aside>

      <div className='flex min-w-0 flex-1 flex-col overflow-hidden'>
        <header className='bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 relative flex items-center justify-between border-b p-4'>
          <div className='flex items-center gap-4'>
            <button
              type='button'
              className='text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-0 rounded-md p-2 transition-colors lg:hidden'
              onClick={() => setIsOpen(true)}
              aria-label='Open Menu'
            >
              <i className='pi pi-bars text-xl' />
            </button>

            <LocalizedLink href='/' className='lg:hidden'>
              <span className='text-primary text-xl font-bold'>Quizly</span>
            </LocalizedLink>
          </div>

          <div className='flex items-center gap-4'>
            <ThemeSwitcher />

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
                    <Avatar.Fallback>
                      {mockUser.firstName[0] + mockUser.lastName[0]}
                    </Avatar.Fallback>
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
          </div>
        </header>

        <main className='flex-1 overflow-y-auto p-4 md:p-8'>{children}</main>
      </div>
    </div>
  );
}
