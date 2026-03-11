'use client';

import { Menu } from '@primereact/ui/menu';
import ThemeSwitcher from './theme-switcher';

export default function MenuBar() {
  return (
    <>
      <div className="flex justify-center p-4">
        <div className="flex gap-8 bg-surface-100 dark:bg-surface-800 rounded-md p-2 w-fit">
          <Menu.Trigger>Tab 1</Menu.Trigger>

          <ThemeSwitcher />
        </div>
      </div>
    </>
  );
}
