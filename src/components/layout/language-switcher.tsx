'use client';

import { Popover } from '@primereact/ui/popover';
import { Menu } from '@primereact/ui/menu';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const LANGUAGES: {
  code: string;
  label: string;
  flagUrl: string;
}[] = [
  { code: 'en', label: 'English', flagUrl: 'https://flagcdn.com/gb.svg' },
  { code: 'uk', label: 'Українська', flagUrl: 'https://flagcdn.com/ua.svg' },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const currentPathSegment = pathname.split('/')[1];
  const isLangInUrl = LANGUAGES.some((lang) => lang.code === currentPathSegment);

  const currentLangCode = isLangInUrl ? currentPathSegment : 'en';
  const currentLang = LANGUAGES.find((lang) => lang.code === currentLangCode) || LANGUAGES[0];

  const changeLanguage = (code: string) => {
    const segments = pathname.split('/');

    if (isLangInUrl) {
      segments[1] = code;
    } else {
      segments.splice(1, 0, code);
    }

    const newPath = segments.join('/');
    setIsPopoverOpen(false);
    router.push(newPath);
  };

  return (
    <div className='relative flex items-center'>
      <Popover.Root
        open={isPopoverOpen}
        onOpenChange={(e: unknown) => {
          const event = e as { open?: boolean; value?: boolean };
          setIsPopoverOpen(event.open ?? event.value ?? false);
        }}
      >
        <Popover.Trigger className='text-surface-700 dark:text-surface-0 hover:bg-surface-100 dark:hover:bg-surface-800 flex cursor-pointer items-center gap-2 rounded-md border-none bg-transparent px-3 py-2 transition-colors outline-none'>
          <Image
            alt={currentLang.label}
            src={currentLang.flagUrl}
            className='h-5 w-7 shrink-0 rounded-sm object-cover shadow-sm'
            width={28}
            height={20}
          />
          <span className='hidden font-medium uppercase sm:inline'>{currentLang.code}</span>
          <i
            className={`pi pi-chevron-down text-xs opacity-70 transition-transform ${isPopoverOpen ? 'rotate-180' : ''}`}
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
                        <button
                          type='button'
                          onClick={() => changeLanguage(lang.code)}
                          className='hover:bg-surface-100 dark:hover:bg-surface-800 flex w-full cursor-pointer items-center justify-start gap-3 rounded-md border-none bg-transparent px-3 py-2 text-left transition-colors outline-none'
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
                        </button>
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
