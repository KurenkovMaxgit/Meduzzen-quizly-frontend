import { CompanyListItem } from '@/components/companies/company-list-item';
import UniversalList from '@/components/common/list';
import ListHeader from '@/components/common/list-header';
import { mockCompanyList } from '@/mock/company-mock';

export default function CompaniesPage() {
  const handleCreateNew = async () => {
    'use server';
    //TODO: Add opening creation modal or page
  };

  return (
    <div className='mx-auto max-w-5xl'>
      <UniversalList
        className='border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded-2xl border p-8'
        items={mockCompanyList}
        itemTemplate={CompanyListItem}
        isLoading={false}
        emptyMessage='No companies found.'
        paginator={true}
        rows={2}
      >
        <ListHeader
          title='Companies'
          buttonLabel='Create new'
          onButtonClick={handleCreateNew}
          searchbar
        />
      </UniversalList>
    </div>
  );
}
