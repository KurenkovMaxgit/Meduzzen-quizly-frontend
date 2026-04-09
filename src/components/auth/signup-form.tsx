'use client';

import { HttpExceptionResponse } from '@/interfaces/common/api-exception-interface';
import { useAppDispatch } from '@/lib/hooks';
import { useAuthControllerSignupMutation } from '@/lib/quizly-api';
import { setCurrentUser } from '@/lib/slices/auth-slice';
import { Button } from '@primereact/ui/button';
import { FloatLabel } from '@primereact/ui/floatlabel';
import { InputText } from '@primereact/ui/inputtext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CreatePasswordInput } from './create-password-input';
import { useGlobalToast } from '@/providers/toast-provider';
import { Divider } from '@primereact/ui/divider';
import { useDictionary } from '@/providers/dictionary-provider';

export function SignupForm() {
  const dictionary = useDictionary();

  const router = useRouter();
  const dispatch = useAppDispatch();
  const toast = useGlobalToast();
  const [signup, { isLoading, isSuccess }] = useAuthControllerSignupMutation();

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | string[]>('');

  useEffect(() => {
    if (isSuccess) {
      toast.showToast('success', dictionary.toast.signup.success);
    }
  }, [isSuccess, toast, dictionary]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const validationErrors: string[] = [];

    if (firstName.trim().length < 1 || firstName.length > 250) {
      validationErrors.push(`${dictionary.auth.signUp.validationErrors.firstName}`);
    }

    if (lastName.trim().length < 1 || lastName.length > 250) {
      validationErrors.push(`${dictionary.auth.signUp.validationErrors.lastName}`);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || email.length > 255) {
      validationErrors.push(`${dictionary.auth.signUp.validationErrors.email}`);
    }

    if (password.length < 8 || password.length > 255) {
      validationErrors.push(`${dictionary.auth.signUp.validationErrors.password}`);
    }

    if (password !== confirmPassword) {
      validationErrors.push(`${dictionary.auth.signUp.validationErrors.confirmPassword}`);
    }

    if (validationErrors.length > 0) {
      setErrorMessage(validationErrors.join(' '));

      return;
    }

    try {
      const response = await signup({ firstName, lastName, email, password }).unwrap();

      if (response.data) {
        dispatch(setCurrentUser({ user: response.data }));
        router.push('/');
      }
    } catch (error) {
      if (error && typeof error === 'object' && 'data' in error) {
        const apiError = (error as { data: HttpExceptionResponse }).data;

        if (apiError.statusCode === 409) {
          setErrorMessage(`${dictionary.auth.signUp.validationErrors.accountAlreadyExists}`);
        }

        if (Array.isArray(apiError.details) && apiError.details.length > 0) {
          const validationMessages = apiError.details
            .flatMap((detail: { messages?: string[] }) => detail.messages || [])
            .join(', ');
          setErrorMessage(validationMessages);
        }
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
            {dictionary.auth.signUp.subTitle}
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
            id='firstName'
            type='text'
            value={firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
            required
            className='w-full'
          />
          <label htmlFor='firstName' className='text-surface-900 dark:text-surface-0 font-medium'>
            {dictionary.auth.signUp.firstName}
          </label>
        </FloatLabel>

        <FloatLabel>
          <InputText
            id='lastName'
            type='text'
            value={lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
            required
            className='w-full'
          />
          <label htmlFor='lastName' className='text-surface-900 dark:text-surface-0 font-medium'>
            {dictionary.auth.signUp.lastName}
          </label>
        </FloatLabel>

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
            {dictionary.auth.signUp.email}
          </label>
        </FloatLabel>

        <CreatePasswordInput value={password} onChange={setPassword} />

        <FloatLabel>
          <InputText
            id='confirmPassword'
            type='password'
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setConfirmPassword(e.target.value)
            }
            required
            className='w-full'
          />
          <label
            htmlFor='confirmPassword'
            className='text-surface-900 dark:text-surface-0 font-medium'
          >
            {dictionary.auth.signUp.confirmPassword}
          </label>
        </FloatLabel>

        <Button type='submit' className='mt-6 w-full'>
          {isLoading && <i className='pi pi-spinner pi-spin' />}
          {dictionary.auth.signUp.signUpButton}
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
