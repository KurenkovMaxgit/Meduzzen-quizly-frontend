import { HttpExceptionResponse } from '@/interfaces/common/api-exception-interface';
import { useAppDispatch } from '@/lib/hooks';
import { useAuthControllerSignupMutation } from '@/lib/quizly-api';
import { setCurrentUser } from '@/lib/slices/auth-slice';
import { Button } from '@primereact/ui/button';
import { FloatLabel } from '@primereact/ui/floatlabel';
import { InputText } from '@primereact/ui/inputtext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import CreatePasswordInput from './create-password-input';
import { useGlobalToast } from '@/providers/toast-provider';

export default function SignupForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const toast = useGlobalToast();
  const [signup, { isLoading, isSuccess }] = useAuthControllerSignupMutation();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | string[]>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const validationErrors: string[] = [];

    if (firstName.trim().length < 1 || firstName.length > 250) {
      validationErrors.push('First name must be between 1 and 250 characters.');
    }

    if (lastName.trim().length < 1 || lastName.length > 250) {
      validationErrors.push('Last name must be between 1 and 250 characters.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || email.length > 255) {
      validationErrors.push('Please enter a valid email address.');
    }

    if (password.length < 8 || password.length > 255) {
      validationErrors.push('Password must be between 8 and 255 characters.');
    }

    if (password !== confirmPassword) {
      validationErrors.push('Passwords do not match.');
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
          setErrorMessage('Account with this email already exists.');
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
      {isSuccess
        ? toast.showToast('success', 'Welcome to Quizly!', 'Account created successfully!')
        : null}
      <form onSubmit={handleSubmit} className='flex flex-col gap-8 pt-2'>
        {errorMessage ? (
          <div className='rounded-md bg-red-50 p-3 text-center text-sm font-medium text-red-600 dark:bg-red-900/20 dark:text-red-400'>
            {errorMessage}
          </div>
        ) : null}

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
            First Name
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
            Last Name
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
            Email
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
            Confirm Password
          </label>
        </FloatLabel>

        <Button type='submit' className='mt-6 w-full'>
          {isLoading ? <i className='pi pi-spinner pi-spin' /> : null}
          Sign Up
        </Button>
      </form>
    </>
  );
}
