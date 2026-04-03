import { ACCESS_TOKEN_KEY } from '@/utils/cookie-constants';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@primereact/ui/button';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

export default function GoogleLoginButton() {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = async () => {
    await loginWithRedirect({
      authorizationParams: {
        connection: 'google-oauth2',
      },
    });
  };

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

  return (
    <Button
      type='button'
      variant='outlined'
      onClick={handleLogin}
      className='border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-0 hover:bg-surface-50 dark:hover:bg-surface-800 flex w-full items-center justify-center gap-3 bg-transparent transition-colors'
    >
      <i className='pi pi-google text-xl' />
      <span className='font-medium'>Continue with Google</span>
    </Button>
  );
}
