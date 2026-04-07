'use client';

import React from 'react';
import { ListHeaderProps } from '@/interfaces/components/list-interface';
import { Button } from '@primereact/ui/button';
import { IconField } from '@primereact/ui/iconfield';
import { InputText } from '@primereact/ui/inputtext';
import { useMessages } from 'next-intl';

export function ListHeader({
  title,
  buttonLabel,
  onButtonClick,
  searchbar = false,
  searchValue,
  setSearchValue,
}: ListHeaderProps) {
  const dictionary = useMessages();

  const [searchValue, setSearchValue] = React.useState<string>('');

  return (
    <div className='mb-6 flex flex-col gap-4 sm:gap-6'>
      <div className='flex items-center justify-between gap-4'>
        <h1 className='m-0 text-3xl font-bold'>{title}</h1>

        {buttonLabel && onButtonClick && (
          <Button raised onClick={onButtonClick} className='shrink-0'>
            <i className='pi pi-plus sm:mr-2' />
            <span className='hidden font-bold sm:block'>{buttonLabel}</span>
          </Button>
        )}
      </div>

      {searchbar && setSearchValue && (
        <div className='w-full'>
          <IconField.Root className='w-full'>
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
            {searchValue ? (
              <IconField.Icon>
                <i className='pi pi-times cursor-pointer' onClick={() => setSearchValue('')} />
              </IconField.Icon>
            ) : null}
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
