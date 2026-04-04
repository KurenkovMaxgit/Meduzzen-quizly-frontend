import { DialogRootChangeEvent } from '@primereact/types/shared/dialog';
import { Avatar } from '@primereact/ui/avatar';
import { Dialog } from '@primereact/ui/dialog';
import { Menu } from '@primereact/ui/menu';
import { Popover } from '@primereact/ui/popover';
import LocalizedLink from '@/components/common/localized-link';
import { ChangeCompanyListItem } from '@/components/companies/company-change-list-item';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useDictionary } from '@/providers/dictionary-provider';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { clearActiveCompany } from '@/lib/slices/company-slice';
import QueryUniversalList from '../common/list-query';
import {
  useAuthControllerLogoutMutation,
  useCompanyControllerFindAllQuery,
} from '@/lib/quizly-api';
import { ReturnCompany } from '@/types/company/return-company';
import { logout } from '@/lib/slices/auth-slice';
import Cookies from 'js-cookie';
import { ACTIVE_COMPANY_ID_KEY } from '@/utils/cookie-constants';
import { COMPANIES_ROUTE, PROFILE_ROUTE } from '@/utils/router-constants';
import { useGlobalToast } from '@/providers/toast-provider';

export default function UserProfileTab() {
  const dictionary = useDictionary();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const toast = useGlobalToast();

  const { user: currentUser } = useAppSelector((state) => state.auth);
  const { activeCompany: currentCompany } = useAppSelector((state) => state.company);

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsDialogOpen(false);
  }

  const [logoutFromApi] = useAuthControllerLogoutMutation();

  const signOut = async () => {
    dispatch(logout());

    try {
      await logoutFromApi().unwrap();
    } catch (error) {
      console.error('Failed to logout from server', error);
    }

    Cookies.remove(ACTIVE_COMPANY_ID_KEY);

    window.location.assign('/auth/logout');
  };

  const exitCompany = () => {
    dispatch(clearActiveCompany());

    Cookies.remove(ACTIVE_COMPANY_ID_KEY);

    toast.showToast('info', dictionary.toast.company.exit.success);
  };

  const rawInitials = (currentUser?.firstName?.[0] || '') + (currentUser?.lastName?.[0] || '');
  const userInitials = rawInitials ? rawInitials.toUpperCase() : 'U';

  const userFullName =
    currentUser?.firstName || currentUser?.lastName
      ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim()
      : dictionary.common.loading;

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
            <Avatar.Fallback>{userInitials}</Avatar.Fallback>
          </Avatar.Root>

          <div className='hidden min-w-0 flex-1 flex-col items-start text-left sm:flex'>
            <span className='text-surface-900 dark:text-surface-0 w-full truncate text-sm font-semibold'>
              {userFullName}
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
                    {userFullName}
                  </span>

                  <LocalizedLink
                    href={currentCompany ? `${COMPANIES_ROUTE}/${currentCompany.id}` : '#'}
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
                        href={`${PROFILE_ROUTE}/${currentUser?.id || ''}`}
                        onClick={() => setIsPopoverOpen(false)}
                        className='text-surface-900 dark:text-surface-0 hover:bg-surface-100 dark:hover:bg-surface-800 flex w-full items-center gap-3 rounded-md px-3 py-2 transition-colors'
                      >
                        <i className='pi pi-user text-surface-500 dark:text-surface-400' />
                        {dictionary.sidebar.profileDropdown.viewProfile}
                      </LocalizedLink>
                    </Menu.Item>

                    <Menu.Separator className='my-1' />

                    <Menu.Item className='m-0! p-0!'>
                      <LocalizedLink href={'/'}>
                        <button
                          type='button'
                          className='hover:bg-surface-100 dark:hover:bg-surface-800 flex w-full items-center gap-3 rounded-md border-none bg-transparent px-3 py-2 text-left text-red-600 transition-colors outline-none dark:text-red-400'
                          onClick={() => exitCompany()}
                        >
                          <i className='pi pi-sign-out opacity-80' />
                          {dictionary.companies.actions.exitCompany}
                        </button>
                      </LocalizedLink>
                    </Menu.Item>

                    <Menu.Item className='m-0! p-0!'>
                      <LocalizedLink href={'/'}>
                        <button
                          type='button'
                          className='hover:bg-surface-100 dark:hover:bg-surface-800 flex w-full items-center gap-3 rounded-md border-none bg-transparent px-3 py-2 text-left text-red-600 transition-colors outline-none dark:text-red-400'
                          onClick={() => signOut()}
                        >
                          <i className='pi pi-power-off opacity-80' />
                          {dictionary.sidebar.profileDropdown.signOut}
                        </button>
                      </LocalizedLink>
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
                    <QueryUniversalList
                      queryHook={useCompanyControllerFindAllQuery}
                      queryParams={{
                        where: {
                          members: { user: { id: currentUser?.id } },
                        },
                        relations: 'members.user',
                      }}
                      paginator={true}
                      rows={12}
                      itemTemplate={(company: ReturnCompany) => (
                        <ChangeCompanyListItem company={company} />
                      )}
                      emptyMessage={dictionary.companies.emptyMessage}
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
