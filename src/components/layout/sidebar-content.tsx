import { currentCompany } from '@/mock/company-mock';
import { Menu } from '@primereact/ui/menu';
import LocalizedLink from '../common/localized-link';
import { useDictionary } from '@/providers/dictionary-provider';
import { ABOUT_ROUTE, COMPANIES_ROUTE } from '@/utils/router-constants';

export default function SidebarContent() {
  const dictionary = useDictionary();

  return (
    <>
      <div className='ms-2 mt-2 mb-4 flex items-center justify-between lg:hidden'>
        <LocalizedLink href='/'>
          <span className='text-primary text-2xl font-bold'>Quizly</span>
        </LocalizedLink>
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
                <LocalizedLink href={COMPANIES_ROUTE} className='flex w-full items-center gap-2'>
                  <i className='pi pi-list' />
                  {dictionary.sidebar.companiesDropdown.allCompanies}
                </LocalizedLink>
              </Menu.Item>

              <Menu.Item>
                <LocalizedLink
                  href={`${COMPANIES_ROUTE}/memberships`}
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
                    href={`${COMPANIES_ROUTE}/${currentCompany.id}/members`}
                    className='flex w-full items-center gap-2'
                  >
                    <i className='pi pi-users' />
                    {dictionary.sidebar.companyActionsDropdown.membersList}
                  </LocalizedLink>
                </Menu.Item>

                <Menu.Item>
                  <LocalizedLink
                    href={`${COMPANIES_ROUTE}/memberships`}
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
                <LocalizedLink href='/messages/received' className='flex w-full items-center gap-2'>
                  <i className='pi pi-download' />
                  {dictionary.sidebar.inboxDropdown.receivedNotifications}
                </LocalizedLink>
              </Menu.Item>

              <Menu.Item>
                <LocalizedLink href='/messages/archived' className='flex w-full items-center gap-2'>
                  <i className='pi pi-folder' />
                  {dictionary.sidebar.inboxDropdown.archivedNotifications}
                </LocalizedLink>
              </Menu.Item>
            </Menu.List>
          </Menu.Sub>

          <Menu.Item>
            <LocalizedLink href={ABOUT_ROUTE} className='flex w-full items-center gap-2'>
              <i className='pi pi-info-circle' /> {dictionary.sidebar.about}
            </LocalizedLink>
          </Menu.Item>
        </Menu.List>
      </Menu.Root>
    </>
  );
}
