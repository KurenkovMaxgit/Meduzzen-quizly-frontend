import { CompanyMessagesList } from '@/components/notifications/company/notifications-company-list';
import { ActionType } from '@/utils/enums';

export default async function SentMessages({ params }: { params: Promise<{ companyId: string }> }) {
  const resolvedParams = await params;

  return (
    <div className='mx-auto max-w-5xl'>
      <CompanyMessagesList actionType={ActionType.INVITE} companyId={resolvedParams.companyId} />
    </div>
  );
}
