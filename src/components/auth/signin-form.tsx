'use client';

import { HttpExceptionResponse } from '@/interfaces/common/api-exception-interface';
import { useAppDispatch } from '@/lib/hooks';
import { useAuthControllerSigninMutation } from '@/lib/quizly-api';
import { setCurrentUser } from '@/lib/slices/auth-slice';
import { useLocale, useMessages } from 'next-intl';
import { Button } from '@primereact/ui/button';
import { Divider } from '@primereact/ui/divider';
import { FloatLabel } from '@primereact/ui/floatlabel';
import { InputText } from '@primereact/ui/inputtext';
import { useRouter } from '@/i18n/routing';
import { useState } from 'react';

export function SignInForm() {
  const dictionary = useMessages();
  const currentLocale = useLocale();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | string[]>('');

  const router = useRouter();
  const dispatch = useAppDispatch();
  const [signIn, { isLoading }] = useAuthControllerSigninMutation();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await signIn({ email, password }).unwrap();

      if (response.data) {
        dispatch(setCurrentUser({ user: response.data }));
        router.push(`/${currentLocale}`);
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
    <>
      <Divider.Root align='center' type='solid' className='my-0!'>
        <Divider.Content>
          <span className='text-surface-600 dark:text-surface-400 mt-2 text-center text-wrap'>
            {dictionary.auth.signIn.subTitle}
          </span>
        </Divider.Content>
      </Divider.Root>

      <form onSubmit={handleSubmit} className='flex flex-col gap-8 pt-2'>
        {errorMessage && (
          <div className='rounded-md bg-red-50 p-3 text-center text-sm font-medium text-red-600 dark:bg-red-900/20 dark:text-red-400'>
            {errorMessage}
          </div>
        )}

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
            {dictionary.auth.signIn.email}
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
            {dictionary.auth.signIn.password}
          </label>
        </FloatLabel>

        <Button type='submit' className='mt-6 w-full'>
          {isLoading && <i className='pi pi-spinner pi-spin' />}
          {dictionary.auth.signIn.signInButton}
        </Button>
      </form>

      <Divider.Root align='center' type='solid' className='my-0!'>
        <Divider.Content>
          <span className='text-surface-500 dark:text-surface-400 text-sm font-medium tracking-wider uppercase'>
            {dictionary.auth.or}
          </span>
        </Divider.Content>
      </Divider.Root>
    </>
  );
}
