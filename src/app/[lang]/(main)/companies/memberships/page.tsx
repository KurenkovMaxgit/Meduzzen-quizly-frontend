import { MembershipsList } from '@/components/companies/memberships/memberships-list';

export default async function CompaniesPage() {
  return (
    <div className='mx-auto max-w-5xl'>
      <MembershipsList />
    </div>
  );
}
