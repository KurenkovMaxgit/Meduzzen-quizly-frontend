import { Link } from '@/i18n/routing';
import { SignupForm } from '@/components/auth/signup-form';
import { getMessages } from 'next-intl/server';
import { GoogleLoginButton } from '@/components/auth/google-button';
import { SIGNIN_ROUTE } from '@/utils/router-constants';

export default async function SignUpPage() {
  const dictionary = await getMessages();

  return (
    <div className='flex w-full flex-col gap-5'>
      <div className='text-center'>
        <h1 className='text-surface-900 dark:text-surface-0 text-3xl font-bold'>
          {dictionary.auth.signUp.title}
        </h1>
      </div>

      <SignupForm />

      <GoogleLoginButton />

      <div className='text-surface-600 dark:text-surface-400 text-center text-sm'>
        {dictionary.auth.signUp.alreadyHaveAccount}{' '}
        <Link href={SIGNIN_ROUTE} className='text-primary font-medium hover:underline'>
          {dictionary.auth.signIn.signInButton}
        </Link>
      </div>
    </div>
  );
}
