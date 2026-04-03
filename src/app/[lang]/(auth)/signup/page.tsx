import LocalizedLink from '@/components/common/localized-link';
import GoogleLoginButton from '@/components/auth/google-button';
import { Divider } from '@primereact/ui/divider';
import SignupForm from '@/components/auth/signup-form';

export default function SignUpPage() {
  return (
    <div className='flex w-full flex-col gap-5'>
      <div className='text-center'>
        <h1 className='text-surface-900 dark:text-surface-0 text-3xl font-bold'>
          Create an Account
        </h1>
      </div>

      <Divider.Root align='center' type='solid' className='my-0!'>
        <Divider.Content>
          <span className='text-surface-600 dark:text-surface-400 mt-2 text-center text-wrap'>
            Sign up for Quizly
          </span>
        </Divider.Content>
      </Divider.Root>

      <SignupForm />

      <Divider.Root align='center' type='solid' className='my-0!'>
        <Divider.Content>
          <span className='text-surface-500 dark:text-surface-400 text-sm font-medium tracking-wider uppercase'>
            Or
          </span>
        </Divider.Content>
      </Divider.Root>

      <GoogleLoginButton />

      <div className='text-surface-600 dark:text-surface-400 text-center text-sm'>
        Already have an account?{' '}
        <LocalizedLink href='/signin' className='text-primary font-medium hover:underline'>
          Sign in
        </LocalizedLink>
      </div>
    </div>
  );
}
