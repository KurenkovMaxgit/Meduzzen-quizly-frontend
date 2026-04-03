'use client';

import { useRef } from 'react';
import { useAppDispatch } from '@/lib/hooks';
import { setCurrentUser } from '@/lib/slices/auth-slice';
import { setActiveCompany } from '@/lib/slices/company-slice';
import { quizlyApi } from '@/lib/quizly-api';
import { ApiResponse } from '@/interfaces/common/api-response-interface';
import { ReturnUser } from '@/types/user/return-user';
import { ReturnCompany } from '@/types/company/return-company';

export default function StoreInitializerClient({
  userResponse,
  companyResponse,
  activeCompanyId,
  children,
}: {
  userResponse: ApiResponse<ReturnUser> | null;
  companyResponse: ApiResponse<ReturnCompany> | null;
  activeCompanyId?: string;
  children: React.ReactNode;
}) {
  const initialized = useRef<boolean | null>(null);
  const dispatch = useAppDispatch();

  if (initialized.current === null) {
    const currentUser = userResponse?.data;
    const company = companyResponse?.data;

    if (currentUser) {
      dispatch(quizlyApi.util.upsertQueryData('userControllerMe', undefined, userResponse));
      dispatch(setCurrentUser({ user: currentUser }));
    }

    if (company && currentUser && activeCompanyId) {
      dispatch(
        quizlyApi.util.upsertQueryData(
          'companyControllerFindOneById',
          { id: activeCompanyId, relations: 'members.user' },
          companyResponse,
        ),
      );

      const currentMember = company.members?.find((member) => member.user?.id === currentUser.id);

      if (currentMember) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { members, ...companyWithoutMembers } = company;

        dispatch(
          setActiveCompany({
            company: companyWithoutMembers,
            role: currentMember.role,
          }),
        );
      }
    }

    initialized.current = true;
  }

  return <>{children}</>;
}
