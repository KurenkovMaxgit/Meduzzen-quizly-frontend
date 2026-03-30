import LocalizedLink from '@/components/common/localized-link';
import { mockCompany, mockCompanyWithMembers } from '@/mock/company-mock';
import { CompanyRole, CompanyStatus } from '@/utils/enums';
import EditCompanyDialog from '@/components/companies/company-edit-dialog';
import { mockUser } from '@/mock/user-mock';
import CompanyDetailsToolbar from '@/components/companies/company-details-toolbar';
import { getDictionary } from '@/utils/get-dictionary';

export default async function CompanyDetailsPage({
  params,
}: {
  params: Promise<{ companyId: string; lang: string }>;
}) {
  const dictionary = await getDictionary((await params).lang);

  async function getCompany(companyId: string) {
    //TODO: Add fetching
    return mockCompanyWithMembers;
  }
  const company = await getCompany((await params).companyId);

  return (
    <div className='mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 md:p-8'>
      <div className='flex items-center justify-between'>
        <LocalizedLink
          href='/companies'
          className='text-surface-500 hover:text-surface-900 dark:hover:text-surface-0 flex items-center gap-2 transition-colors'
        >
          <i className='pi pi-arrow-left' />
          <span className='font-medium'>{dictionary.common.back}</span>
        </LocalizedLink>
        {company.members.find(
          (user) =>
            (user.user.id === mockUser.id && user.role === CompanyRole.OWNER) ||
            user.role === CompanyRole.ADMIN,
        ) ? (
          <EditCompanyDialog company={mockCompany} />
        ) : null}
      </div>

      <div className='bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 flex w-full flex-col rounded-2xl border p-6 shadow-sm sm:p-8'>
        <div className='flex flex-col gap-8 md:flex-row md:items-start'>
          <div className='flex w-full flex-col gap-6'>
            <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
              <h1 className='text-surface-900 dark:text-surface-0 m-0 w-full text-2xl font-bold wrap-break-word break-all sm:text-3xl'>
                {company.name}
              </h1>
              <div
                className={`flex shrink-0 items-center gap-2 self-start rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase ${
                  company.status === CompanyStatus.VISIBLE
                    ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                    : 'bg-surface-100 text-surface-700 dark:bg-surface-500/20 dark:text-surface-400'
                }`}
              >
                <i
                  className={`pi ${company.status === CompanyStatus.VISIBLE ? 'pi-check-circle' : 'pi-eye-slash'} text-[10px]`}
                />
                {company.status}
              </div>
            </div>

            <div className='bg-surface-50 dark:bg-surface-800/50 rounded-xl p-5'>
              <h3 className='text-surface-500 m-0 mb-2 text-xs font-bold tracking-wider uppercase'>
                {dictionary.companies.details.about}
              </h3>
              <p className='text-surface-700 dark:text-surface-300 m-0 leading-relaxed'>
                {company.description}
              </p>
            </div>

            <CompanyDetailsToolbar company={company} />

            <div className='border-surface-200 dark:border-surface-700 mt-2 flex flex-wrap gap-x-12 gap-y-6 border-t pt-6'>
              <div className='flex flex-col gap-1'>
                <span className='text-surface-500 text-sm font-semibold'>
                  {dictionary.companies.details.id}
                </span>
                <span className='text-surface-900 dark:text-surface-0 font-mono text-xs'>
                  {company.id}
                </span>
              </div>
              <div className='flex flex-col gap-1'>
                <span className='text-surface-500 text-sm font-semibold'>
                  {dictionary.common.createdAt}
                </span>
                <span className='text-surface-900 dark:text-surface-0 text-sm'>
                  {new Date(company.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className='flex flex-col gap-1'>
                <span className='text-surface-500 text-sm font-semibold'>
                  {dictionary.common.updatedAt}
                </span>
                <span className='text-surface-900 dark:text-surface-0 text-sm'>
                  {new Date(company.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
