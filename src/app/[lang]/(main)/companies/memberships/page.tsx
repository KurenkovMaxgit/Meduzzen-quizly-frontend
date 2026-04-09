import { UniversalList } from '@/components/common/list';
import { ListHeader } from '@/components/common/list-header';
import { mockCompanyList } from '@/mock/company-mock';
import { CompanyMembershipListItem } from '@/components/companies/company-membership-list-item';
import { getMessages } from 'next-intl/server';

export default async function MembershipsPage() {
  const dictionary = await getMessages();

  return (
    <div className='mx-auto max-w-5xl'>
      <UniversalList
        className='border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded-2xl border p-8'
        items={mockCompanyList}
        itemTemplate={CompanyMembershipListItem}
        isLoading={false}
        emptyMessage={dictionary.memberships.emptyMessage}
        paginator={true}
        rows={2}
      >
        <ListHeader title={dictionary.memberships.listHeader.title} searchbar />
      </UniversalList>
    </div>
  );
}
