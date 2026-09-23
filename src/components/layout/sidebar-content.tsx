'use client';

import { Menu } from '@primereact/ui/menu';
import { useMenu } from '@primereact/headless/menu';
import { useMenuSubmenu } from '@primereact/headless/menu/submenu';
import { Link } from '@/i18n/routing';
import { useMessages } from 'next-intl';
import {
  ABOUT_ROUTE,
  COMPANIES_ROUTE,
  HOME_ROUTE,
  MEMBERS_ROUTE,
  MEMBERSHIPS_ROUTE,
  RECEIVED_MESSAGES_ROUTE,
  SENT_MESSAGES_ROUTE,
} from '@/utils/router-constants';
import { useAppSelector } from '@/lib/hooks';
import { ChevronDown } from '@primeicons/react';
import { CompanyRole } from '@/utils/enums';

export function SidebarContent() {
  const dictionary = useMessages();
  const currentCompany = useAppSelector((state) => state.company.activeCompany);

  const currentCompanyRole = useAppSelector((state) => state.company.activeRole);

  const menu = useMenu({ composite: false, closeOnSelect: false });
  const companiesSubmenu = useMenuSubmenu({ defaultOpen: false });
  const companyActionsSubmenu = useMenuSubmenu({ defaultOpen: true });
  const companyInboxSubmenu = useMenuSubmenu({ defaultOpen: true });
  const inboxSubmenu = useMenuSubmenu({ defaultOpen: true });

  const submenuTriggerClassName =
    'hover:bg-surface-100 dark:hover:bg-surface-800 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left transition-colors outline-none';
  const submenuListClassName = 'ms-3! flex flex-col pe-3!';

  return (
    <>
      <div className='ms-2 mt-2 mb-4 flex items-center justify-between lg:hidden'>
        <Link href={HOME_ROUTE}>
          <span className='text-primary text-2xl font-bold'>Quizly</span>
        </Link>
      </div>

      <Menu.Root {...menu.rootProps} className='w-full border-none! bg-transparent!'>
        <Menu.List {...menu.getListProps()} className='p-0!'>
          <Menu.Submenu {...companiesSubmenu.subProps} as='div'>
            <Menu.SubmenuTrigger
              {...menu.getSubTriggerProps({ value: 'companies', sub: companiesSubmenu })}
              className={submenuTriggerClassName}
            >
              <i className='pi pi-building' />
              <span className='flex-1'>{dictionary.sidebar.companiesDropdown.title}</span>
              <ChevronDown
                className={`size-3.5 transition-transform duration-200 ${companiesSubmenu.state.open ? 'rotate-180' : ''}`}
              />
            </Menu.SubmenuTrigger>

            {companiesSubmenu.state.open && (
              <Menu.List
                {...menu.getListProps({ value: 'companies', sub: companiesSubmenu })}
                className={submenuListClassName}
              >
                <Menu.Item as={Link} href={COMPANIES_ROUTE} className='flex items-center gap-2'>
                  <i className='pi pi-list' />
                  {dictionary.sidebar.companiesDropdown.allCompanies}
                </Menu.Item>

                <Menu.Item as={Link} href={MEMBERSHIPS_ROUTE} className='flex items-center gap-2'>
                  <i className='pi pi-users' />
                  {dictionary.sidebar.companiesDropdown.myMemberships}
                </Menu.Item>
              </Menu.List>
            )}
          </Menu.Submenu>

          {currentCompany &&
            [CompanyRole.ADMIN, CompanyRole.OWNER].includes(currentCompanyRole!) && (
              <>
                <Menu.Submenu {...companyActionsSubmenu.subProps} as='div'>
                  <Menu.SubmenuTrigger
                    {...menu.getSubTriggerProps({
                      value: 'company-actions',
                      sub: companyActionsSubmenu,
                    })}
                    className={submenuTriggerClassName}
                  >
                    <i className='pi pi-th-large' />
                    <span className='flex-1'>
                      {dictionary.sidebar.companyActionsDropdown.title}
                    </span>
                    <ChevronDown
                      className={`size-3.5 transition-transform duration-200 ${companyActionsSubmenu.state.open ? 'rotate-180' : ''}`}
                    />
                  </Menu.SubmenuTrigger>

                  {companyActionsSubmenu.state.open && (
                    <Menu.List
                      {...menu.getListProps({
                        value: 'company-actions',
                        sub: companyActionsSubmenu,
                      })}
                      className={submenuListClassName}
                    >
                      <Menu.Item
                        as={Link}
                        href={`${COMPANIES_ROUTE}/${currentCompany.id}/${MEMBERS_ROUTE}`}
                        className='flex w-full items-center gap-2'
                      >
                        <i className='pi pi-users' />
                        {dictionary.sidebar.companyActionsDropdown.membersList}
                      </Menu.Item>

                      <Menu.Item
                        as={Link}
                        href={MEMBERSHIPS_ROUTE}
                        className='flex w-full items-center gap-2'
                      >
                        <i className='pi pi-clipboard' />
                        {dictionary.sidebar.companyActionsDropdown.quizzesList}
                      </Menu.Item>
                    </Menu.List>
                  )}
                </Menu.Submenu>

                <Menu.Submenu {...companyInboxSubmenu.subProps} as='div'>
                  <Menu.SubmenuTrigger
                    {...menu.getSubTriggerProps({
                      value: 'company-inbox',
                      sub: companyInboxSubmenu,
                    })}
                    className={submenuTriggerClassName}
                  >
                    <i className='pi pi-inbox' />
                    <span className='flex-1'>{dictionary.sidebar.companyInboxDropdown.title}</span>
                    <ChevronDown
                      className={`size-3.5 transition-transform duration-200 ${companyInboxSubmenu.state.open ? 'rotate-180' : ''}`}
                    />
                  </Menu.SubmenuTrigger>

                  {companyInboxSubmenu.state.open && (
                    <Menu.List
                      {...menu.getListProps({
                        value: 'company-inbox',
                        sub: companyInboxSubmenu,
                      })}
                      className={submenuListClassName}
                    >
                      <Menu.Item
                        as={Link}
                        href={`${COMPANIES_ROUTE}/${currentCompany.id}/${SENT_MESSAGES_ROUTE}`}
                        className='flex w-full items-center gap-2'
                      >
                        <i className='pi pi-send' />
                        {dictionary.sidebar.companyInboxDropdown.sentNotifications}
                      </Menu.Item>

                      <Menu.Item
                        as={Link}
                        href={`${COMPANIES_ROUTE}/${currentCompany.id}/${RECEIVED_MESSAGES_ROUTE}`}
                        className='flex w-full items-center gap-2'
                      >
                        <i className='pi pi-download' />
                        {dictionary.sidebar.companyInboxDropdown.receivedNotifications}
                      </Menu.Item>
                    </Menu.List>
                  )}
                </Menu.Submenu>
              </>
            )}

          <Menu.Submenu {...inboxSubmenu.subProps} as='div'>
            <Menu.SubmenuTrigger
              {...menu.getSubTriggerProps({ value: 'inbox', sub: inboxSubmenu })}
              className={submenuTriggerClassName}
            >
              <i className='pi pi-envelope' />
              <span className='flex-1'>{dictionary.sidebar.inboxDropdown.title}</span>
              <ChevronDown
                className={`size-3.5 transition-transform duration-200 ${inboxSubmenu.state.open ? 'rotate-180' : ''}`}
              />
            </Menu.SubmenuTrigger>

            {inboxSubmenu.state.open && (
              <Menu.List
                {...menu.getListProps({ value: 'inbox', sub: inboxSubmenu })}
                className={submenuListClassName}
              >
                <Menu.Item
                  as={Link}
                  href={`${SENT_MESSAGES_ROUTE}`}
                  className='flex w-full items-center gap-2'
                >
                  <i className='pi pi-send' />
                  {dictionary.sidebar.inboxDropdown.sentNotifications}
                </Menu.Item>

                <Menu.Item
                  as={Link}
                  href={`${RECEIVED_MESSAGES_ROUTE}`}
                  className='flex w-full items-center gap-2'
                >
                  <i className='pi pi-download' />
                  {dictionary.sidebar.inboxDropdown.receivedNotifications}
                </Menu.Item>
              </Menu.List>
            )}
          </Menu.Submenu>

          <Menu.Item as={Link} href={ABOUT_ROUTE} className='flex w-full items-center gap-2'>
            <i className='pi pi-info-circle' /> {dictionary.sidebar.about}
          </Menu.Item>
        </Menu.List>
      </Menu.Root>
    </>
  );
}
