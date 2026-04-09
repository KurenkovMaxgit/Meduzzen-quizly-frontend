'use client';

import { useLocale, useMessages } from 'next-intl';
import { Button } from '@primereact/ui/button';
import { Link } from '@/i18n/routing';

export function GoogleLoginButton() {
  const dictionary = useMessages();
  const currentLocale = useLocale();

  const handleLoginClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.assign(`/auth/login?connection=google-oauth2&returnTo=${currentLocale}`);
  };

  return (
    <Link
      href={`/auth/login?connection=google-oauth2&returnTo=${currentLocale}`}
      prefetch={false}
      onClick={handleLoginClick}
    >
      <Button
        type='button'
        variant='outlined'
        className='border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-0 hover:bg-surface-50 dark:hover:bg-surface-800 flex w-full items-center justify-center gap-3 bg-transparent transition-colors'
      >
        <i className='pi pi-google text-xl' />
        <span className='font-medium'>{dictionary.auth.googleButton}</span>
      </Button>
    </Link>
  );
}
