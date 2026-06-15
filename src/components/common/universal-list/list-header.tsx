'use client';

import { Button } from '@primereact/ui/button';
import { useMessages } from 'next-intl';
import { Select } from '@primereact/ui/select';
import { SelectValueChangeEvent } from '@primereact/types/shared/select';
import { IconField } from '@primereact/ui/iconfield';
import { InputText } from '@primereact/ui/inputtext';

export function ListHeader<T>({
  title,
  buttonLabel,
  onButtonClick,
  searchbar = false,
  searchValue,
  setSearchValue,
  filterOptions = [],
  filterValue,
  onFilterChange,
  filterPlaceholder,
}: {
  title?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
  searchbar?: boolean;
  searchValue?: string;
  setSearchValue?: (value: string) => void;
  filterOptions?: {
    label: string;
    value: T;
  }[];
  filterValue?: T | null;
  onFilterChange?: (value: T | null) => void;
  filterPlaceholder?: string;
}) {
  const dictionary = useMessages();

  return (
    <div className='mb-6 flex flex-col gap-4 sm:gap-6'>
      {(title || buttonLabel) && (
        <div className='flex items-center justify-between'>
          {title && <h1 className='m-0 text-3xl font-bold'>{title}</h1>}

          {buttonLabel && onButtonClick && (
            <Button raised onClick={onButtonClick} className='shrink-0'>
              <i className='pi pi-plus sm:mr-2' />
              <span className='hidden font-bold sm:block'>{buttonLabel}</span>
            </Button>
          )}
        </div>
      )}

      {(searchbar || filterOptions.length > 0) && (
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
          {searchbar && setSearchValue && (
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
              {searchValue && (
                <IconField.Icon>
                  <i className='pi pi-times cursor-pointer' onClick={() => setSearchValue('')} />
                </IconField.Icon>
              )}
            </IconField.Root>
          )}

          {filterOptions.length > 0 && onFilterChange && (
            <Select.Root
              value={filterValue}
              onValueChange={(e: SelectValueChangeEvent) => onFilterChange(e.value as T | null)}
              options={filterOptions}
              optionLabel='label'
              optionValue='value'
              className='w-full shrink-0 sm:w-64'
            >
              <Select.Trigger className='h-full w-full border-none bg-transparent shadow-none'>
                <Select.Value
                  placeholder={filterPlaceholder || dictionary.common.filter.placeHolder}
                />

                {filterValue && (
                  <i
                    className='pi pi-times text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 cursor-pointer px-2 py-3 transition-colors'
                    onClick={(e) => {
                      e.stopPropagation();
                      onFilterChange(null);
                    }}
                  />
                )}

                <Select.Icon>
                  <i className='pi pi-chevron-down' />
                </Select.Icon>
              </Select.Trigger>

              <Select.Portal>
                <Select.Positioner className='z-50'>
                  <Select.Panel className='border-surface-200 bg-surface-0 dark:border-surface-700 dark:bg-surface-900 mt-1 min-w-48 overflow-hidden rounded-lg border shadow-xl'>
                    <Select.List className='py-1 outline-none'>
                      {filterOptions.map((option, index) => (
                        <Select.Option
                          key={index}
                          index={index}
                          uKey={String(option.value)}
                          className='text-surface-700 hover:bg-surface-100 data-[p-highlight=true]:bg-primary-50 dark:text-surface-0 dark:hover:bg-surface-800 dark:data-[p-highlight=true]:bg-primary-900/40 flex cursor-pointer items-center gap-2 px-4 py-2 transition-colors'
                        >
                          <span>{option.label}</span>
                        </Select.Option>
                      ))}
                    </Select.List>

                    {(!filterOptions || filterOptions.length === 0) && (
                      <Select.Empty className='text-surface-500 dark:text-surface-400 px-4 py-3'>
                        {dictionary.common?.noData || 'No options available'}
                      </Select.Empty>
                    )}
                  </Select.Panel>
                </Select.Positioner>
              </Select.Portal>
            </Select.Root>
          )}
        </div>
      )}
    </div>
  );
}
