export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='bg-surface-50 dark:bg-surface-950 flex min-h-screen items-center justify-center p-4'>
      <div className='dark:bg-surface-900 border-surface-200 dark:border-surface-800 w-full max-w-md rounded-2xl border bg-white p-8 shadow-xl'>
        {children}
      </div>
    </div>
  );
}
