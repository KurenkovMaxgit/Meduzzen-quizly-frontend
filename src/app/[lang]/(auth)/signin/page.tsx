import { Link } from '@/i18n/routing';
import { SignInForm } from '@/components/auth/signin-form';
import { getMessages } from 'next-intl/server';
import { GoogleLoginButton } from '@/components/auth/google-button';
import { SIGNUP_ROUTE } from '@/utils/router-constants';

export default async function SignInPage() {
  const dictionary = await getMessages();

  return (
    <div className='flex w-full flex-col gap-5'>
      <div className='text-center'>
        <h1 className='text-surface-900 dark:text-surface-0 text-3xl font-bold'>
          {dictionary.auth.signIn.title}
        </h1>
      </div>
      <SignInForm />

      <GoogleLoginButton />

      <div className='text-surface-600 dark:text-surface-400 text-center text-sm'>
        {dictionary.auth.signIn.noAccount}{' '}
        <Link href={SIGNUP_ROUTE} className='text-primary font-medium hover:underline'>
          {dictionary.auth.signUp.signUpButton}
        </Link>
      </div>
    </div>
  );
}
