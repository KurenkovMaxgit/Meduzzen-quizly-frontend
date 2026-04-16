import { MembersList } from '@/components/companies/actions/members-list';

export default async function CompanyMembersPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  return <MembersList companyId={(await params).companyId} />;
}
