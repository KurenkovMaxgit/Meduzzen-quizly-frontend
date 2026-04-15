import { MembershipsListClient } from '@/components/companies/memberships/memberships-list-client';

export default async function CompaniesPage() {
  return (
    <div className='mx-auto max-w-5xl'>
      <MembershipsListClient />
    </div>
  );
}
