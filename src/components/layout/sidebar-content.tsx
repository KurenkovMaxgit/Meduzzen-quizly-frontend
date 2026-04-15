import { Menu } from '@primereact/ui/menu';
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

export function SidebarContent() {
  const dictionary = useMessages();

  const currentCompany = useAppSelector((state) => state.company.activeCompany);

  return (
    <>
      <div className='ms-2 mt-2 mb-4 flex items-center justify-between lg:hidden'>
        <Link href={HOME_ROUTE}>
          <span className='text-primary text-2xl font-bold'>Quizly</span>
        </Link>
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
                <Link href={COMPANIES_ROUTE} className='flex w-full items-center gap-2'>
                  <i className='pi pi-list' />
                  {dictionary.sidebar.companiesDropdown.allCompanies}
                </Link>
              </Menu.Item>

              <Menu.Item>
                <Link href={MEMBERSHIPS_ROUTE} className='flex w-full items-center gap-2'>
                  <i className='pi pi-users' />
                  {dictionary.sidebar.companiesDropdown.myMemberships}
                </Link>
              </Menu.Item>
            </Menu.List>
          </Menu.Sub>

          {currentCompany && (
            <>
              <Menu.Sub defaultOpen={true}>
                <Menu.Trigger>
                  <i className='pi pi-th-large' />
                  {dictionary.sidebar.companyActionsDropdown.title}
                  <Menu.Icon />
                </Menu.Trigger>

                <Menu.List>
                  <Menu.Item>
                    <Link
                      href={`${COMPANIES_ROUTE}/${currentCompany.id}/${MEMBERS_ROUTE}`}
                      className='flex w-full items-center gap-2'
                    >
                      <i className='pi pi-users' />
                      {dictionary.sidebar.companyActionsDropdown.membersList}
                    </Link>
                  </Menu.Item>

                  <Menu.Item>
                    <Link href={MEMBERSHIPS_ROUTE} className='flex w-full items-center gap-2'>
                      <i className='pi pi-clipboard' />
                      {dictionary.sidebar.companyActionsDropdown.quizzesList}
                    </Link>
                  </Menu.Item>
                </Menu.List>
              </Menu.Sub>
              <Menu.Sub defaultOpen={true}>
                <Menu.Trigger>
                  <i className='pi pi-inbox' />
                  {dictionary.sidebar.companyInboxDropdown.title}
                  <Menu.Icon />
                </Menu.Trigger>

                <Menu.List>
                  <Menu.Item>
                    <Link
                      href={`${COMPANIES_ROUTE}/${currentCompany.id}/${SENT_MESSAGES_ROUTE}`}
                      className='flex w-full items-center gap-2'
                    >
                      <i className='pi pi-send' />
                      {dictionary.sidebar.companyInboxDropdown.sentNotifications}
                    </Link>
                  </Menu.Item>

                  <Menu.Item>
                    <Link
                      href={`${COMPANIES_ROUTE}/${currentCompany.id}/${RECEIVED_MESSAGES_ROUTE}`}
                      className='flex w-full items-center gap-2'
                    >
                      <i className='pi pi-download' />
                      {dictionary.sidebar.companyInboxDropdown.receivedNotifications}
                    </Link>
                  </Menu.Item>
                </Menu.List>
              </Menu.Sub>
            </>
          )}

          <Menu.Sub defaultOpen={true}>
            <Menu.Trigger>
              <i className='pi pi-envelope' />
              {dictionary.sidebar.inboxDropdown.title}
              <Menu.Icon />
            </Menu.Trigger>

            <Menu.List>
              <Menu.Item>
                <Link href={`${SENT_MESSAGES_ROUTE}`} className='flex w-full items-center gap-2'>
                  <i className='pi pi-send' />
                  {dictionary.sidebar.inboxDropdown.sentNotifications}
                </Link>
              </Menu.Item>

              <Menu.Item>
                <Link
                  href={`${RECEIVED_MESSAGES_ROUTE}`}
                  className='flex w-full items-center gap-2'
                >
                  <i className='pi pi-download' />
                  {dictionary.sidebar.inboxDropdown.receivedNotifications}
                </Link>
              </Menu.Item>
            </Menu.List>
          </Menu.Sub>

          <Menu.Item>
            <Link href={ABOUT_ROUTE} className='flex w-full items-center gap-2'>
              <i className='pi pi-info-circle' /> {dictionary.sidebar.about}
            </Link>
          </Menu.Item>
        </Menu.List>
      </Menu.Root>
    </>
  );
}
