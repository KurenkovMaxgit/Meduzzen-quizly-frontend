'use client';

import { Popover } from '@primereact/ui/popover';
import { usePopoverOpenChangeEvent } from '@primereact/types/shared/popover';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import LanguageSwitcher from './language-switcher';
import ThemeSwitcher from './theme-switcher';

export default function SettingsTab() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setMounted(true);
    });
  }, []);

  return (
    <>
      <div className='hidden items-center gap-2 lg:flex'>
        <LanguageSwitcher />

        <ThemeSwitcher />
      </div>

      <div className='lg:hidden'>
        <Popover.Root
          open={isOpen}
          onOpenChange={(e: usePopoverOpenChangeEvent) => {
            const event = e as usePopoverOpenChangeEvent & { open?: boolean };
            setIsOpen(event.open ?? event.value ?? false);
          }}
        >
          <Popover.Trigger className='text-surface-900 dark:text-surface-0 border-surface-900 dark:border-surface-0 hover:bg-surface-100 dark:hover:bg-surface-800 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border bg-transparent p-0 transition-all outline-none active:scale-95'>
            <i
              className={`pi pi-cog text-lg transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            />
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner sideOffset={12} side='bottom' align='center'>
              <Popover.Popup className=''>
                <Popover.Arrow />
                <Popover.Content className='flex flex-col gap-2 p-2!'>
                  <div className='flex items-center justify-between gap-2 rounded-lg'>
                    {mounted ? (
                      <div key={resolvedTheme}>
                        <LanguageSwitcher />
                      </div>
                    ) : (
                      <div>
                        <LanguageSwitcher />
                      </div>
                    )}
                    <ThemeSwitcher />
                  </div>
                </Popover.Content>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </>
  );
}
