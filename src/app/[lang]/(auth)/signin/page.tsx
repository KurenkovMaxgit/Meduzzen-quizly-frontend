import LocalizedLink from '@/components/common/localized-link';
import GoogleLoginButton from '@/components/auth/google-button';
import SignInForm from '@/components/auth/signin-form';

export default function SignInPage() {
  return (
    <div className='flex w-full flex-col gap-5'>
      <div className='text-center'>
        <h1 className='text-surface-900 dark:text-surface-0 text-3xl font-bold'>Welcome Back</h1>
      </div>
      <SignInForm />

      <GoogleLoginButton />

      <div className='text-surface-600 dark:text-surface-400 text-center text-sm'>
        Don&apos;t have an account yet?{' '}
        <LocalizedLink href='/signup' className='text-primary font-medium hover:underline'>
          Sign up
        </LocalizedLink>
      </div>
    </div>
  );
}
