'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InputText } from '@primereact/ui/inputtext';
import { Button } from '@primereact/ui/button';
import { useAppDispatch } from '@/lib/hooks';
import { setCurrentUser } from '@/lib/slices/auth-slice';
import { useAuthControllerSigninMutation } from '@/lib/quizlyApi';
import LocalizedLink from '@/components/common/localized-link';
import GoogleLoginButton from '@/components/auth/google-button';
import { Divider } from '@primereact/ui/divider';
import { FloatLabel } from '@primereact/ui/floatlabel';
import { HttpExceptionResponse } from '@/interfaces/common/api-exception-interface';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | string[]>('');

  const router = useRouter();
  const dispatch = useAppDispatch();
  const [signIn, { isLoading }] = useAuthControllerSigninMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await signIn({ email, password }).unwrap();

      if (response.data) {
        dispatch(setCurrentUser({ user: response.data }));
        router.push('/');
      }
    } catch (error) {
      if (error && typeof error === 'object' && 'data' in error) {
        const apiError = (error as { data: HttpExceptionResponse }).data;

        setErrorMessage(apiError.message + '. Try again.');
      } else {
        setErrorMessage('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className='flex w-full flex-col gap-5'>
      <div className='text-center'>
        <h1 className='text-surface-900 dark:text-surface-0 text-3xl font-bold'>Welcome Back</h1>
      </div>

      <Divider.Root align='center' type='solid' className='my-0!'>
        <Divider.Content>
          <span className='text-surface-600 dark:text-surface-400 mt-2 text-center text-wrap'>
            Sign in to your Quizly account
          </span>
        </Divider.Content>
      </Divider.Root>

      <form onSubmit={handleSubmit} className='flex flex-col gap-8 pt-2'>
        {errorMessage ? (
          <div className='rounded-md bg-red-50 p-3 text-center text-sm font-medium text-red-600 dark:bg-red-900/20 dark:text-red-400'>
            {errorMessage}
          </div>
        ) : null}

        <FloatLabel>
          <InputText
            id='email'
            type='email'
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            required
            className='w-full'
          />
          <label htmlFor='email' className='text-surface-900 dark:text-surface-0 font-medium'>
            Email
          </label>
        </FloatLabel>

        <FloatLabel>
          <InputText
            id='password'
            type='password'
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            required
            className='w-full'
          />
          <label htmlFor='password' className='text-surface-900 dark:text-surface-0 font-medium'>
            Password
          </label>
        </FloatLabel>

        <Button type='submit' className='mt-6 w-full'>
          {isLoading ? <i className='pi pi-spinner pi-spin' /> : null}
          Sign In
        </Button>
      </form>

      <Divider.Root align='center' type='solid' className='my-0!'>
        <Divider.Content>
          <span className='text-surface-500 dark:text-surface-400 text-sm font-medium tracking-wider uppercase'>
            Or
          </span>
        </Divider.Content>
      </Divider.Root>

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
