'use client';

import React from 'react';
import { ListHeaderProps } from '@/interfaces/components/list-interface';
import { Button } from '@primereact/ui/button';
import { IconField } from '@primereact/ui/iconfield';
import { InputText } from '@primereact/ui/inputtext';
import { useDictionary } from '@/providers/dictionary-provider';

export function ListHeader({
  title,
  buttonLabel,
  onButtonClick,
  searchbar = false,
}: ListHeaderProps) {
  const dictionary = useDictionary();

  const [searchValue, setSearchValue] = React.useState<string>('');

  return (
    <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
      <h1 className='text-3xl font-bold'>{title}</h1>
      {searchbar && (
        <div className='order-last flex w-full justify-center sm:order-0 sm:w-auto sm:flex-1 sm:px-4'>
          <IconField.Root className='w-full max-w-md'>
            <IconField.Icon>
              <i className='pi pi-search' />
            </IconField.Icon>
            <InputText
              value={searchValue}
              onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchValue(e.currentTarget.value)
              }
              placeholder={dictionary.common.searchbar.placeholder}
              className='w-full'
            />
            <IconField.Icon>
              <i className='pi pi-times cursor-pointer' onClick={() => setSearchValue('')} />
            </IconField.Icon>
          </IconField.Root>
        </div>
      )}

      {buttonLabel && onButtonClick && (
        <Button raised onClick={onButtonClick} className='shrink-0'>
          <i className='pi pi-plus sm:mr-2' />
          <h3 className='hidden sm:block'>{buttonLabel}</h3>
        </Button>
      )}
    </div>
  );
}
