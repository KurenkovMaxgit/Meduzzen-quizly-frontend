'use client';

import { useTheme } from 'next-themes';
import { Button } from '@primereact/ui/button';
import { useState, useEffect } from 'react';

export default function ThemeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setMounted(true);
    });
  }, []);

  if (!mounted) {
    return (
      <Button disabled variant="outlined" className="w-10 h-10">
        <i className="pi pi-spinner pi-spin" />
      </Button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <Button
      type="button"
      variant="outlined"
      rounded
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="p-0 w-10 h-10"
      aria-label="Toggle Theme"
    >
      <i className={isDark ? 'pi pi-sun' : 'pi pi-moon'} />
    </Button>
  );
}
