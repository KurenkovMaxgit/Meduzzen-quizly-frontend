'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch } from '@/lib/hooks';
import { setActiveCompany } from '@/lib/slices/company-slice';
import { useCompanyControllerFindOneByIdQuery, useUserControllerMeQuery } from '@/lib/quizlyApi';
import { setCredentials } from '@/lib/slices/auth-slice';

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

  const { data: userResponse, isSuccess: userIsSuccess } = useUserControllerMeQuery(undefined, {
    skip: !isLoggedIn,
  });

  const { data: companyResponse, isSuccess: companyIsSuccess } =
    useCompanyControllerFindOneByIdQuery(
      { id: activeCompanyId!, relations: 'members.user' },
      { skip: !activeCompanyId },
    );

  useEffect(() => {
    const currentUser = userResponse?.data;

    if (userIsSuccess && currentUser && !userInitialized.current) {
      dispatch(setCredentials({ user: currentUser }));
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
          console.log('first'),
        );
        companyInitialized.current = true;
      }
    }
  }, [companyIsSuccess, companyResponse, dispatch, userResponse?.data]);

  return null;
}
