import { LanguageSwitcher } from '@/components/layout/language-switcher';
import { ThemeSwitcher } from '@/components/layout/theme-switcher';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='bg-surface-50 dark:bg-surface-950 relative flex min-h-screen items-center justify-center p-4'>
      <div className='absolute top-4 right-4 z-10 flex items-center gap-2 md:top-8 md:right-8'>
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>

      <div className='dark:bg-surface-900 border-surface-200 dark:border-surface-800 w-full max-w-md rounded-2xl border bg-white p-8 shadow-xl'>
        {children}
      </div>
    </div>
  );
}
