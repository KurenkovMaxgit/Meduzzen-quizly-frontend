import { Link } from '@/i18n/routing';
import { getMessages } from 'next-intl/server';
import { CompanyFetcher } from '@/components/companies/company-fetcher';
import { COMPANIES_ROUTE } from '@/utils/router-constants';

export default async function CompanyDetailsPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const resolvedParams = await params;
  const dictionary = await getMessages();

  return (
    <div className='mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 md:p-8'>
      <div className='flex items-center justify-between'>
        <Link
          href={COMPANIES_ROUTE}
          className='text-surface-500 hover:text-surface-900 dark:hover:text-surface-0 flex items-center gap-2 transition-colors'
        >
          <i className='pi pi-arrow-left' />

          <span className='font-medium'>{dictionary.common.back}</span>
        </Link>
      </div>

      <CompanyFetcher companyId={resolvedParams.companyId} />
    </div>
  );
}
