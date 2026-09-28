'use client';

import { useRef } from 'react';
import { useAppDispatch } from '@/lib/hooks';
import { setCurrentUser } from '@/lib/slices/auth-slice';
import { setActiveCompany } from '@/lib/slices/company-slice';
import { quizlyApi, setAuth0RefreshFn } from '@/lib/api-endpoints';
import { ApiResponse } from '@/interfaces/common/api-response-interface';
import { ReturnUser } from '@/types/user/return-user';
import { ReturnCompany } from '@/types/company/return-company';
import Cookies from 'js-cookie';
import {
  ACCESS_TOKEN_KEY,
  ACCESS_TOKEN_OPTIONS,
  REFRESH_TOKEN_KEY,
  REFRESH_TOKEN_OPTIONS,
} from '@/utils/cookie-constants';

export function StoreInitializerClient({
  userResponse,
  companyResponse,
  activeCompanyId,
  auth0Token,
  children,
  newAccessToken,
  newRefreshToken,
}: {
  userResponse: ApiResponse<ReturnUser> | null;
  companyResponse: ApiResponse<ReturnCompany> | null;
  activeCompanyId?: string;
  auth0Token?: string;
  children: React.ReactNode;
  newAccessToken?: string;
  newRefreshToken?: string;
}) {
  const initialized = useRef<boolean | null>(null);
  const dispatch = useAppDispatch();

  if (initialized.current === null) {
    if (newAccessToken) {
      Cookies.set(ACCESS_TOKEN_KEY, newAccessToken, ACCESS_TOKEN_OPTIONS);
    }

    if (newRefreshToken) {
      Cookies.set(REFRESH_TOKEN_KEY, newRefreshToken, REFRESH_TOKEN_OPTIONS);
    }

    if (auth0Token) {
      Cookies.set(ACCESS_TOKEN_KEY, auth0Token, {
        expires: 1,
        secure: true,
        sameSite: 'strict',
      });

      setAuth0RefreshFn(async () => {
        const res = await fetch('/api/auth/token');
        if (!res.ok) throw new Error('Failed to refresh Auth0 token');
        const data = await res.json();

        return data.token;
      });
    }

    const currentUser = userResponse?.data;
    const company = companyResponse?.data;

    if (currentUser) {
      dispatch(quizlyApi.util.upsertQueryData('userMe', undefined, userResponse));
      dispatch(setCurrentUser({ user: currentUser }));
    }

    if (company && currentUser && activeCompanyId) {
      dispatch(
        quizlyApi.util.upsertQueryData(
          'companyFindOneById',
          { id: activeCompanyId, relations: ['members.user'] },
          companyResponse,
        ),
      );

      const currentMember = company.members?.find((member) => member.user?.id === currentUser.id);

      if (currentMember) {
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

  return children;
}
