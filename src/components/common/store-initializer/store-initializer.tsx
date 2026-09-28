import { serverFetch } from '@/lib/server-fetch';
import { StoreInitializerClient } from './store-initializer-client';
import { cookies } from 'next/headers';
import {
  ACCESS_TOKEN_KEY,
  ACTIVE_COMPANY_ID_KEY,
  REFRESH_TOKEN_KEY,
} from '@/utils/cookie-constants';
import { auth0 } from '@/lib/auth0';
import { ApiResponse } from '@/interfaces/common/api-response-interface';

export async function StoreInitializer({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const activeCompanyId = cookieStore.get(ACTIVE_COMPANY_ID_KEY)?.value;
  const accessToken = cookieStore.get(ACCESS_TOKEN_KEY)?.value;
  const refreshToken = cookieStore.get(REFRESH_TOKEN_KEY)?.value;

  let auth0Token = undefined;
  try {
    const session = await auth0.getSession();
    if (session) {
      const { token } = await auth0.getAccessToken();
      auth0Token = token;
    }
  } catch {}

  let isLoggedIn = !!accessToken || !!auth0Token;
  let newAccessToken: string | undefined = undefined;
  let newRefreshToken: string | undefined = undefined;

  let userResponse = null;
  let companyResponse = null;

  try {
    if (!accessToken && !!refreshToken) {
      const refreshRes: ApiResponse<{ accessToken: string; refreshToken: string }> =
        await serverFetch('/api/auth/refresh', {
          method: 'POST',
        });

      newAccessToken = refreshRes.data?.accessToken;
      newRefreshToken = refreshRes.data?.refreshToken;

      if (newAccessToken) {
        isLoggedIn = true;
      }
    }

    let fetchOptions = undefined;
    if (newAccessToken) {
      const updatedCookies = [];
      updatedCookies.push(`${ACCESS_TOKEN_KEY}=${newAccessToken}`);
      if (newRefreshToken) {
        updatedCookies.push(`${REFRESH_TOKEN_KEY}=${newRefreshToken}`);
      }
      fetchOptions = { headers: { Cookie: updatedCookies.join('; ') } };
    }

    if (isLoggedIn) {
      userResponse = await serverFetch('/api/user/me', fetchOptions);
    }

    if (activeCompanyId) {
      companyResponse = await serverFetch(
        `/api/company/${activeCompanyId}?relations=members.user`,
        fetchOptions,
      );
    }
  } catch (error) {
    console.error('Pre-fetching failed in StoreInitializer:', error);
  }

  return (
    <StoreInitializerClient
      userResponse={userResponse}
      companyResponse={companyResponse}
      activeCompanyId={activeCompanyId}
      auth0Token={auth0Token}
      newAccessToken={newAccessToken}
      newRefreshToken={newRefreshToken}
    >
      {children}
    </StoreInitializerClient>
  );
}
