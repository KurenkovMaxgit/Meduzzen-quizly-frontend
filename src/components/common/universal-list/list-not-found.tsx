'use client';

import Image from 'next/image';

export function ListNotFound({ emptyMessage }: { emptyMessage: string }) {
  return (
    <div className='text-surface-500 dark:text-surface-400 border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded-xl border p-8 text-center'>
      <div className='text-secondary mt-4 flex items-center justify-center gap-3 text-xl font-bold italic'>
        <span>{emptyMessage}</span>
        <div className='relative h-24 w-24 shrink-0'>
          <Image
            src='/sad-chepushila.png'
            alt='Sad chepushila'
            fill
            sizes='128px'
            className='object-contain'
          />
        </div>
      </div>
    </div>
  );
}
