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
      <Button disabled rounded variant="outlined" className="h-10 w-10">
        <i className="pi pi-spinner pi-spin" />
      </Button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <Button
      type="button"
      variant="outlined"
      severity="contrast"
      rounded
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="h-10 w-10 p-0"
      aria-label="Toggle Theme"
    >
      <i className={isDark ? 'pi pi-sun' : 'pi pi-moon'} />
    </Button>
  );
}
