import { Skeleton } from '@primereact/ui/skeleton';

export function ListSkeleton() {
  return (
    <div className='bg-surface-0 dark:border-surface-700 dark:bg-surface-900 border-surface-200 flex items-center gap-4 rounded-xl border p-4 shadow-sm'>
      <div className='flex flex-1 flex-col gap-2'>
        <Skeleton width='30%' height='1.2rem' />
        <Skeleton width='70%' height='0.8rem' />
      </div>
      <Skeleton width='5rem' height='2rem' className='shrink-0' />
    </div>
  );
}
