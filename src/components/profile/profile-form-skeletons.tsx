import { Skeleton } from '@primereact/ui/skeleton';

export function ProfileFormSkeletons() {
  return (
    <div className='mx-auto max-w-4xl space-y-6'>
      <div className='mb-8 flex items-center gap-4'>
        <Skeleton shape='circle' width='4rem' height='4rem' className='shrink-0' />
        <div className='flex flex-col gap-2'>
          <Skeleton width='16rem' height='2rem' />
          <Skeleton width='5rem' height='1.5rem' className='mt-1' />
        </div>
      </div>
      <div className='bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 rounded-xl border p-6 shadow-sm'>
        <div className='mb-6 flex items-center justify-between'>
          <Skeleton width='8rem' height='2rem' />
          <div className='flex items-center gap-2'>
            <Skeleton width='8rem' height='2.5rem' borderRadius='2rem' />
            <Skeleton shape='circle' width='2.5rem' height='2.5rem' />
          </div>
        </div>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div className='flex flex-col gap-2'>
            <Skeleton width='6rem' height='1.2rem' />
            <Skeleton width='100%' height='2.5rem' />
          </div>

          <div className='flex flex-col gap-2'>
            <Skeleton width='6rem' height='1.2rem' />
            <Skeleton width='100%' height='2.5rem' />
          </div>

          <div className='flex flex-col gap-2 md:col-span-2'>
            <Skeleton width='4rem' height='1.2rem' />
            <Skeleton width='100%' height='2.5rem' />
          </div>
        </div>
      </div>
    </div>
  );
}
