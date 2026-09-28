'use client';

import { useTheme } from 'next-themes';
import { Button } from '@primereact/ui/button';
import { useState, useEffect } from 'react';

export function ThemeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    queueMicrotask(() => {
      setMounted(true);
    });
  }, []);

  if (!mounted) {
    return (
      <Button disabled rounded variant='outlined' className='h-10 w-10'>
        <i className='pi pi-spinner pi-spin' />
      </Button>
    );
  }

  return (
    <Button
      type='button'
      variant='outlined'
      severity='contrast'
      rounded
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className='h-10 w-10 p-0'
      aria-label='Toggle Theme'
    >
      <i className='pi pi-moon absolute scale-100 opacity-100 transition-all dark:scale-0 dark:opacity-0' />

      <i className='pi pi-sun absolute scale-0 opacity-0 transition-all dark:scale-100 dark:opacity-100' />
    </Button>
  );
}
