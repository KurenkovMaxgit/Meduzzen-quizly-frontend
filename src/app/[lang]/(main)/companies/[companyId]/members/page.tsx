import { MembersListClient } from '@/components/companies/actions/members-list-client';

export default async function CompanyMembersPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  return <MembersListClient companyId={(await params).companyId} />;
}
