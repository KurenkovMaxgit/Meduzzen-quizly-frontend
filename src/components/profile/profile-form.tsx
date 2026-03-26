'use client';

import { InputText } from '@primereact/ui/inputtext';
import { Button } from '@primereact/ui/button';
import { useState } from 'react';
import { mockUser } from '@/mock/user-mock';
import { useDictionary } from '@/providers/dictionary-provider';

export default function ProfileForm({
  user,
  isOwner,
}: {
  user: typeof mockUser;
  isOwner: boolean;
}) {
  const dictionary = useDictionary();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  function handleSave() {
    setIsEditing(false);
  }

  return (
    <div className='bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 rounded-xl border p-6 shadow-sm'>
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>{dictionary.profile.title}</h2>
        {isOwner && !isEditing && (
          <Button label='Edit Profile' rounded onClick={() => setIsEditing(true)}>
            <i className='pi pi-pencil' />

            <h3 className='hidden sm:block'>{dictionary.common.edit}</h3>
          </Button>
        )}
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <div className='flex flex-col gap-2'>
          <label
            htmlFor='firstName'
            className='text-surface-700 dark:text-surface-300 font-semibold'
          >
            {dictionary.profile.firstName}
          </label>
          <InputText
            id='firstName'
            value={formData.firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            disabled={!isEditing}
            className='w-full'
          />
        </div>

        <div className='flex flex-col gap-2'>
          <label
            htmlFor='lastName'
            className='text-surface-700 dark:text-surface-300 font-semibold'
          >
            {dictionary.profile.lastName}
          </label>
          <InputText
            id='lastName'
            value={formData.lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            disabled={!isEditing}
            className='w-full'
          />
        </div>

        <div className='flex flex-col gap-2 md:col-span-2'>
          <label htmlFor='email' className='text-surface-700 dark:text-surface-300 font-semibold'>
            {dictionary.profile.email}
          </label>
          <InputText
            id='email'
            value={formData.email}
            disabled={true}
            className='w-full opacity-70'
          />
        </div>
      </div>

      {isEditing && (
        <div className='border-surface-200 dark:border-surface-700 mt-8 flex justify-center gap-3 border-t pt-4 sm:justify-end'>
          <Button
            label='Cancel'
            severity='secondary'
            onClick={() => {
              setFormData(user);
              setIsEditing(false);
            }}
          >
            {dictionary.common.cancel}
            <i className='pi pi-times' />
          </Button>
          <Button label='Save Changes' severity='success' raised onClick={handleSave}>
            {dictionary.common.save}
            <i className='pi pi-check' />
          </Button>
        </div>
      )}
    </div>
  );
}
