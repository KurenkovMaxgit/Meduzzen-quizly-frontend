import { UniversalList } from '@/components/common/list';
import { CompanyMemberListItem } from '@/components/companies/company-members-list-item';
import { mockCompanyMembers } from '@/mock/company-mock';
import { getMessages } from 'next-intl/server';

export default async function CompanyMembersPage() {
  const dictionary = await getMessages();

  return (
    <div className='mx-auto max-w-5xl'>
      <UniversalList
        items={mockCompanyMembers}
        itemTemplate={CompanyMemberListItem}
        className='border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded-2xl border p-8'
        isLoading={false}
        emptyMessage={dictionary.companies.emptyMessage}
      >
        {/* TODO: Add ListHeader with members management tools*/}
      </UniversalList>
    </div>
  );
}
