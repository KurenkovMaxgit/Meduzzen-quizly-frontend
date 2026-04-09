import { CompanyListItem } from '@/components/companies/company-list-item';
import { UniversalList } from '@/components/common/list';
import { ListHeader } from '@/components/common/list-header';
import { mockCompanyList } from '@/mock/company-mock';
import { getDictionary } from '@/utils/get-dictionary';

export default async function CompaniesPage({ params }: { params: Promise<{ lang: string }> }) {
  const dictionary = await getDictionary((await params).lang);

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
        emptyMessage={dictionary.companies.emptyMessage}
        paginator={true}
        rows={2}
      >
        <ListHeader
          title={dictionary.companies.listHeader.title}
          buttonLabel={dictionary.companies.listHeader.buttonLabel}
          onButtonClick={handleCreateNew}
          searchbar
        />
      </UniversalList>
    </div>
  );
}
