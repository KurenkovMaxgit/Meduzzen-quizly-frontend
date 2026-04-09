'use client';

import { Popover } from '@primereact/ui/popover';
import { Menu } from '@primereact/ui/menu';
import Image from 'next/image';
import { startTransition, useState } from 'react';
import { usePopoverOpenChangeEvent } from '@primereact/types/shared/popover';
import { Button } from '@primereact/ui/button';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { cn } from '@/utils/cn';

const LANGUAGES = [
  { code: 'en', label: 'English', flagUrl: 'https://flagcdn.com/gb.svg' },
  { code: 'uk', label: 'Українська', flagUrl: 'https://flagcdn.com/ua.svg' },
];

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

  const currentLang = LANGUAGES.find((lang) => lang.code === currentLocale) || LANGUAGES[0];

  const changeLanguage = (code: string) => {
    setIsPopoverOpen(false);

    startTransition(() => {
      router.replace(pathname, { locale: code });
    });
  };

  return (
    <div className='relative flex items-center'>
      <Popover.Root
        open={isPopoverOpen}
        onOpenChange={(e: usePopoverOpenChangeEvent) => {
          const event = e as usePopoverOpenChangeEvent & { open?: boolean };
          setIsPopoverOpen(event.open ?? event.value ?? false);
        }}
      >
        <Popover.Trigger className='text-surface-700 dark:text-surface-0 hover:bg-surface-100 dark:hover:bg-surface-800 flex cursor-pointer items-center gap-2 rounded-md border-none bg-transparent p-2 transition-colors outline-none'>
          <Image
            alt={currentLang.label}
            src={currentLang.flagUrl}
            className='h-5 w-7 shrink-0 rounded-sm object-cover shadow-sm'
            width={28}
            height={20}
          />
          <span className='hidden font-medium uppercase sm:inline'>{currentLang.code}</span>
          <i
            className={cn(
              'pi pi-chevron-down text-xs opacity-70 transition-transform',
              isPopoverOpen && 'rotate-180',
            )}
          />
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Positioner sideOffset={8} side='bottom' align='end'>
            <Popover.Popup className='border-surface-200 bg-surface-0 dark:border-surface-700 dark:bg-surface-900 w-48 overflow-hidden rounded-xl border shadow-lg'>
              <Popover.Content className='p-0!'>
                <Menu.Root className='w-full border-none! bg-transparent!'>
                  <Menu.List className='p-1!'>
                    {LANGUAGES.map((lang) => (
                      <Menu.Item key={lang.code} className='m-0! p-0!'>
                        <Button
                          variant='outlined'
                          severity='contrast'
                          onClick={() => changeLanguage(lang.code)}
                          className='hover:bg-surface-100 dark:hover:bg-surface-800 flex w-full cursor-pointer items-center justify-start! gap-3 rounded-md border-0! border-none bg-transparent px-3 py-2 text-left transition-colors outline-none'
                        >
                          <Image
                            alt={lang.label}
                            src={lang.flagUrl}
                            className='h-5 w-7 shrink-0 rounded-sm object-cover shadow-sm'
                            width={28}
                            height={20}
                          />
                          <span className='text-surface-700 dark:text-surface-0 font-medium'>
                            {lang.label}
                          </span>
                        </Button>
                      </Menu.Item>
                    ))}
                  </Menu.List>
                </Menu.Root>
              </Popover.Content>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
