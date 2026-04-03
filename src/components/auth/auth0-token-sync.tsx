'use client';

import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Cookies from 'js-cookie';
import { ACCESS_TOKEN_KEY } from '@/utils/cookie-constants';

export default function TokenSync() {
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    const syncToken = async () => {
      if (isLoading) return;

      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          Cookies.set(ACCESS_TOKEN_KEY, token, {
            expires: 1,
            secure: true,
            sameSite: 'strict',
          });
        } catch (error) {
          console.error('Failed to sync token to cookie', error);
          Cookies.remove(ACCESS_TOKEN_KEY);
        }
      } else {
        Cookies.remove(ACCESS_TOKEN_KEY);
      }
    };

    syncToken();
  }, [isAuthenticated, isLoading, getAccessTokenSilently]);

  return null;
}
