import { CompaniesList } from '@/components/companies/companies-list';

export default async function CompaniesPage() {
  return (
    <div className='mx-auto max-w-5xl'>
      <CompaniesList />
    </div>
  );
}
