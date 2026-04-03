import serverFetch from '@/lib/server-fetch';
import StoreInitializerClient from './store-initializer-client';
import { cookies } from 'next/headers';
import { ACCESS_TOKEN_KEY, ACTIVE_COMPANY_ID_KEY } from '@/utils/cookie-constants';

export default async function StoreInitializer() {
  const cookieStore = await cookies();

  const isLoggedIn = !!cookieStore.get(ACCESS_TOKEN_KEY);
  const activeCompanyId = cookieStore.get(ACTIVE_COMPANY_ID_KEY)?.value;

  let userResponse = null;
  let companyResponse = null;

  try {
    if (isLoggedIn) {
      userResponse = await serverFetch('/api/user/me');
    }

    if (activeCompanyId) {
      companyResponse = await serverFetch(`/api/company/${activeCompanyId}?relations=members.user`);
    }
  } catch (error) {
    console.error('Pre-fetching failed in StoreInitializer:', error);
  }

  return (
    <StoreInitializerClient
      userResponse={userResponse}
      companyResponse={companyResponse}
      activeCompanyId={activeCompanyId}
    />
  );
}
