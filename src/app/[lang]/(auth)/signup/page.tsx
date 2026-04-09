import { LocalizedLink } from '@/components/common/localized-link';
import { SignupForm } from '@/components/auth/signup-form';
import { getDictionary } from '@/utils/get-dictionary';
import { GoogleLoginButton } from '@/components/auth/google-button';
import { SIGNIN_ROUTE } from '@/utils/router-constants';

export default async function SignUpPage({ params }: { params: Promise<{ lang: string }> }) {
  const dictionary = await getDictionary((await params).lang);

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
        <LocalizedLink href={SIGNIN_ROUTE} className='text-primary font-medium hover:underline'>
          {dictionary.auth.signIn.signInButton}
        </LocalizedLink>
      </div>
    </div>
  );
}
