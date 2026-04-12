import { CompanyFetcher } from '@/components/companies/company-fetcher';

export default async function CompanyDetailsPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const resolvedParams = await params;

  return (
    <div className='mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 md:p-8'>
      <CompanyFetcher companyId={resolvedParams.companyId} />
    </div>
  );
}
