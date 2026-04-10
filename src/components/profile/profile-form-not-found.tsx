import { useRouter } from '@/i18n/routing';
import { Button } from '@primereact/ui/button';
import { useMessages } from 'next-intl';

export function ProfileNotFoundFallback() {
  const dictionary = useMessages();
  const router = useRouter();

  return (
    <div className='border-surface-200 bg-surface-50/50 dark:border-surface-700 dark:bg-surface-900/50 flex min-h-100 flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center'>
      <div className='bg-surface-100 dark:bg-surface-800 mb-6 flex h-20 w-20 items-center justify-center rounded-full'>
        <i className='pi pi-user-minus text-surface-400 text-4xl' />
      </div>
      <h2 className='text-surface-900 dark:text-surface-0 mb-2 text-2xl font-bold'>
        {dictionary.profile.userNotFound.title}
      </h2>
      <p className='text-surface-500 dark:text-surface-400 mb-8 max-w-sm'>
        {dictionary.profile.userNotFound.description}
      </p>
      <Button severity='secondary' variant='text' onClick={() => router.back()}>
        <i className='pi pi-arrow-left mr-2' />
        {dictionary.common.back}
      </Button>
    </div>
  );
}
