import { CompaniesListClient } from '@/components/companies/companies-list-client';

export default async function CompaniesPage() {
  return (
    <div className='mx-auto max-w-5xl'>
      <CompaniesListClient />
    </div>
  );
}
