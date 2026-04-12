import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setActiveCompany, clearActiveCompany } from '@/lib/slices/company-slice';
import { useGlobalToast } from '@/providers/toast-provider';
import { ReturnCompany } from '@/types/company/return-company';
import { ACTIVE_COMPANY_ID_KEY } from '@/utils/cookie-constants';
import Cookies from 'js-cookie';
import { useMessages } from 'next-intl';

export function useCompanySession() {
  const dispatch = useAppDispatch();
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const dictionary = useMessages();
  const toast = useGlobalToast();

  const enterCompany = async (company: ReturnCompany) => {
    const { members, ...companyWithoutMembers } = company;
    const userRole = members?.find((member) => member.user.id === currentUser?.id)?.role;

    if (!userRole) return;

    dispatch(setActiveCompany({ company: companyWithoutMembers, role: userRole }));
    Cookies.set(ACTIVE_COMPANY_ID_KEY, company.id, { expires: 7 });

    toast.showToast('success', {
      summary: dictionary.toast.company.enter.success.summary,
      detail: `${dictionary.toast.company.enter.success.detail} ${company.name}`,
    });
  };

  const exitCompany = () => {
    dispatch(clearActiveCompany());
    Cookies.remove(ACTIVE_COMPANY_ID_KEY);
    toast.showToast('info', dictionary.toast.company.exit.success);
  };

  return { enterCompany, exitCompany };
}
