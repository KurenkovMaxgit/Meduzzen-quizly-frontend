'use client';

import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { SettingsTab } from './settings-tab';
import { UserProfileTab } from './user-profile-tab';
import { usePathname } from 'next/navigation';
import { SidebarContent } from './sidebar-content';
import { cn } from '@/utils/cn';
import { HOME_ROUTE } from '@/utils/router-constants';

export function SidebarLayout({
  children,
}: Readonly<{
  children?: React.ReactNode;
}>) {
  const pathname = usePathname();

  const [prevPathname, setPrevPathname] = useState<string>(pathname);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  return (
    <div className='bg-surface-50 dark:bg-surface-950 flex h-screen overflow-hidden'>
      {isOpen && (
        <div
          className='fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden'
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          'bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className='flex-1 overflow-y-auto p-4'>
          <div className='mt-2 mb-4 hidden items-center justify-between gap-4 ps-4 lg:flex'>
            <Link href={HOME_ROUTE}>
              <div className='text-primary text-2xl font-bold'>Quizly</div>
            </Link>
          </div>

          <SidebarContent />
        </div>
      </aside>

      <div className='flex min-w-0 flex-1 flex-col overflow-hidden'>
        <header className='bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 relative flex items-center justify-between border-b p-4'>
          <div className='flex items-center gap-4'>
            <button
              type='button'
              className='text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-0 rounded-md p-2 transition-colors lg:hidden'
              onClick={() => setIsOpen(true)}
              aria-label='Open Menu'
            >
              <i className='pi pi-bars text-xl' />
            </button>

            <Link href={HOME_ROUTE} className='lg:hidden'>
              <span className='text-primary text-xl font-bold'>Quizly</span>
            </Link>
          </div>

          <div className='flex items-center gap-4'>
            <SettingsTab />

            <UserProfileTab />
          </div>
        </header>

        <main className='flex-1 overflow-y-auto p-4 md:p-8'>{children}</main>
      </div>
    </div>
  );
}
