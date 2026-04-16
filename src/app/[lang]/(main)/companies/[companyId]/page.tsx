import { CompanyDetailsClient } from '@/components/companies/details/company-details';

export default async function CompanyDetailsPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const resolvedParams = await params;

  return <CompanyDetailsClient companyId={resolvedParams.companyId} />;
}
