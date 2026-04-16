import { useRouter } from '@/i18n/routing';
import { ApiResponse } from '@/interfaces/common/api-response-interface';
import { useAppDispatch } from '@/lib/hooks';
import { useCompanyDeleteOneByIdMutation } from '@/lib/api-endpoints';
import { clearActiveCompany } from '@/lib/slices/company-slice';
import { useGlobalToast } from '@/providers/toast-provider';
import { ConfirmPopup } from '@primereact/ui/confirmpopup';
import { useLocale, useMessages } from 'next-intl';

export function CompanyDetailsDeleteButton({ companyId }: { companyId: string }) {
  const dictionary = useMessages();
  const currentLocale = useLocale();
  const router = useRouter();
  const toast = useGlobalToast();
  const dispatch = useAppDispatch();

  const [deleteCompany, { isLoading: isDeleting }] = useCompanyDeleteOneByIdMutation();

  const handleDeleteCompany = async () => {
    try {
      const createdCompany: ApiResponse<unknown> = await deleteCompany(companyId).unwrap();

      if (createdCompany.data) {
        dispatch(clearActiveCompany());

        router.push(`/${currentLocale}/`);

        toast.showToast('success', dictionary.toast.company.delete.success);
      }
    } catch {
      toast.showToast('error', dictionary.toast.company.delete.error);
    }
  };

  return (
    <ConfirmPopup.Root>
      <ConfirmPopup.Trigger severity='danger' variant='outlined' className='w-full justify-center'>
        <i className='pi pi-trash' />
        {dictionary.companies.actions.deleteCompany}
      </ConfirmPopup.Trigger>

      <ConfirmPopup.Portal>
        <ConfirmPopup.Content>
          <div className='border-surface-200 dark:border-surface-700 flex items-center gap-3 border-b p-2 pb-3'>
            <i className='pi pi-exclamation-triangle mb-1' />
            <p className='m-0'>{dictionary.companies.actions.deleteCompanyConfirmation}</p>
          </div>
        </ConfirmPopup.Content>

        <ConfirmPopup.Footer>
          <ConfirmPopup.Reject severity='contrast' variant='outlined'>
            {dictionary.common.cancel}
          </ConfirmPopup.Reject>

          <ConfirmPopup.Accept severity='danger' onClick={() => handleDeleteCompany()}>
            {dictionary.common.confirm}
            {isDeleting && <i className='pi pi-spin pi-spinner ml-2' />}
          </ConfirmPopup.Accept>
        </ConfirmPopup.Footer>
      </ConfirmPopup.Portal>
    </ConfirmPopup.Root>
  );
}
