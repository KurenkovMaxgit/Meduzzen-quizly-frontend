'use client';

import { useCompanyFindOneByIdQuery } from '@/lib/api-endpoints';
import { useAppSelector } from '@/lib/hooks';
import { CompanyRole } from '@/utils/enums';

export function useCompanyQuizPermissions(companyId: string) {
  const activeCompany = useAppSelector((state) => state.company.activeCompany);
  const activeRole = useAppSelector((state) => state.company.activeRole);
  const userId = useAppSelector((state) => state.auth.user?.id);
  const isActiveCompany = activeCompany?.id === companyId;
  const companyQuery = useCompanyFindOneByIdQuery(
    { id: companyId, relations: ['members', 'members.user'] },
    { skip: isActiveCompany },
  );
  const company = isActiveCompany ? activeCompany : companyQuery.data?.data;
  const role = isActiveCompany
    ? activeRole
    : company?.members?.find((member) => member.user.id === userId)?.role;

  return {
    canManage: role === CompanyRole.OWNER || role === CompanyRole.ADMIN,
    company,
    isLoading: !isActiveCompany && companyQuery.isLoading,
  };
}
