'use client';

import { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '@/lib/hooks';
import { setActiveCompany } from '@/lib/slices/company-slice';
import { useCompanyControllerFindOneByIdQuery, useUserControllerMeQuery } from '@/lib/quizlyApi';
import { setCurrentUser } from '@/lib/slices/auth-slice';
import { useAuth0 } from '@auth0/auth0-react';
import Cookies from 'js-cookie';
import { ACCESS_TOKEN_KEY } from '@/utils/cookie-constants';

export default function StoreInitializer({
  activeCompanyId,
  isLoggedIn,
}: {
  activeCompanyId?: string;
  isLoggedIn: boolean;
}) {
  const userInitialized = useRef(false);
  const companyInitialized = useRef(false);
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading: authLoading } = useAuth0();

  const [shouldFetchUser, setShouldFetchUser] = useState(isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) return;

    if (!authLoading && isAuthenticated) {
      const cookieInterval = setInterval(() => {
        if (Cookies.get(ACCESS_TOKEN_KEY)) {
          setShouldFetchUser(true);
          clearInterval(cookieInterval);
        }
      }, 50);

      return () => clearInterval(cookieInterval);
    }
  }, [isLoggedIn, isAuthenticated, authLoading]);

  const { data: userResponse, isSuccess: userIsSuccess } = useUserControllerMeQuery(undefined, {
    skip: !shouldFetchUser,
  });

  const { data: companyResponse, isSuccess: companyIsSuccess } =
    useCompanyControllerFindOneByIdQuery(
      { id: activeCompanyId!, relations: 'members.user' },
      { skip: !activeCompanyId },
    );

  useEffect(() => {
    const currentUser = userResponse?.data;

    if (userIsSuccess && currentUser && !userInitialized.current) {
      dispatch(setCurrentUser({ user: currentUser }));
      userInitialized.current = true;
    }
  }, [userIsSuccess, userResponse, dispatch]);

  useEffect(() => {
    const currentUser = userResponse?.data;
    const company = companyResponse?.data;

    if (companyIsSuccess && company && currentUser && !companyInitialized.current) {
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
        companyInitialized.current = true;
      }
    }
  }, [companyIsSuccess, companyResponse, dispatch, userResponse?.data]);

  return null;
}
