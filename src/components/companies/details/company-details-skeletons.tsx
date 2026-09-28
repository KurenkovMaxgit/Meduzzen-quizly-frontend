import { useRouter } from '@/i18n/routing';
import { Button } from '@primereact/ui/button';
import { Skeleton } from '@primereact/ui/skeleton';
import { useMessages } from 'next-intl';

export function CompanyDetailsSkeleton() {
  const dictionary = useMessages();
  const router = useRouter();

  return (
    <div className='mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 md:p-8'>
      <div className='flex w-full flex-col gap-6'>
        <div className='flex min-h-10 items-center justify-between'>
          <Button
            icon='pi pi-arrow-left'
            severity='secondary'
            variant='text'
            onClick={() => router.back()}
          >
            <i className='pi pi-arrow-left' />
            {dictionary.common.back}
          </Button>
        </div>
        <Skeleton
          width='100%'
          height='16rem'
          borderRadius='16px'
          className='bg-surface-200 dark:bg-surface-700'
        />
      </div>
    </div>
  );
}
