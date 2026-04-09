'use client';

import { Button } from '@primereact/ui/button';
import { FloatLabel } from '@primereact/ui/floatlabel';
import { InputText } from '@primereact/ui/inputtext';
import { CreatePasswordInput } from './create-password-input';
import { Divider } from '@primereact/ui/divider';
import { useMessages } from 'next-intl';
import { useSignupForm } from '@/hooks/use-signup-validation';

export function SignupForm() {
  const dictionary = useMessages();

  const { formData, errorMessage, isLoading, updateField, handleSubmit } = useSignupForm();

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
            value={formData.firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateField('firstName', e.target.value)
            }
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
            value={formData.lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateField('lastName', e.target.value)
            }
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
            value={formData.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateField('email', e.target.value)
            }
            required
            className='w-full'
          />
          <label htmlFor='email' className='text-surface-900 dark:text-surface-0 font-medium'>
            {dictionary.auth.signUp.email}
          </label>
        </FloatLabel>

        <CreatePasswordInput
          value={formData.password}
          onChange={(value) => updateField('password', value)}
        />

        <FloatLabel>
          <InputText
            id='confirmPassword'
            type='password'
            value={formData.confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateField('confirmPassword', e.target.value)
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
