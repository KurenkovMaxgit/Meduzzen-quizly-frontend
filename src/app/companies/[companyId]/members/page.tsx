import UniversalList from '@/components/common/list';
import { CompanyMemberListItem } from '@/components/companies/company-members-list-item';
import { mockCompanyMembers } from '@/mock/company-mock';

export default function CompanyMembersPage() {
  return (
    <div className='mx-auto max-w-5xl'>
      <UniversalList
        items={mockCompanyMembers}
        itemTemplate={CompanyMemberListItem}
        className='border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded-2xl border p-8'
        isLoading={false}
        emptyMessage='No companies found.'
      >
        {/* TODO: Add ListHeader with members management tools*/}
      </UniversalList>
    </div>
  );
}
