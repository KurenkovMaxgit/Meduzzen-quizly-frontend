'use client';

import { Paginator } from '@primereact/ui/paginator';
import type {
  PaginatorPagesInstance,
  usePaginatorChangeEvent,
} from '@primereact/types/shared/paginator';
import { DataView } from '@primereact/ui/dataview';
import { Skeleton } from '@primereact/ui/skeleton';
import { Dialog } from '@primereact/ui/dialog';
import Image from 'next/image';
import * as React from 'react';
import { UniversalListProps } from '@/interfaces/list-interface';
import { Button } from '@primereact/ui/button';

export default function UniversalList<T>({
  children,
  items,
  itemTemplate,
  isLoading = false,
  emptyMessage,
  className = '',
  paginator = false,
  rows = 10,
  dialog = false,
  dialogTitle,
  buttonLabel = '',
  buttonIcon = 'pi-eye',
}: UniversalListProps<T>) {
  const [page, setPage] = React.useState(1);

  const displayedItems = paginator ? items.slice((page - 1) * rows, page * rows) : items;

  const renderContent = () => {
    if (isLoading) {
      const skeletonRows = Array.from({ length: 5 });

      return (
        <div className={`space-y-4 ${className}`}>
          {skeletonRows.map((_, index) => (
            <div
              key={index}
              className='bg-surface-0 dark:border-surface-700 dark:bg-surface-900 border-surface-200 flex items-center gap-4 rounded-xl border p-4 shadow-sm'
            >
              <div className='flex flex-1 flex-col gap-2'>
                <Skeleton width='30%' height='1.2rem' />
                <Skeleton width='70%' height='0.8rem' />
              </div>
              <Skeleton width='5rem' height='2rem' className='shrink-0' />
            </div>
          ))}
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div
          className={`text-surface-500 dark:text-surface-400 border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded-xl border p-8 text-center ${className}`}
        >
          {children}
          <div className='text-secondary mt-4 flex justify-center text-xl font-bold italic'>
            {emptyMessage}
            <Image width={64} height={64} src='/sad-chepushila.png' alt='Sad chepushila' />
          </div>
        </div>
      );
    }

    return (
      <div className={className}>
        {children}
        <DataView>
          <div className='flex flex-col'>
            {displayedItems.map((item, index) => (
              <React.Fragment key={index}>{itemTemplate(item, index)}</React.Fragment>
            ))}
          </div>

          {paginator && items.length > rows && (
            <Paginator.Root
              total={items.length}
              itemsPerPage={rows}
              onPageChange={(e: usePaginatorChangeEvent) => setPage(e.value)}
              className='border-surface-200 dark:border-surface-700 mt-4 border-t pt-4'
            >
              <Paginator.Content>
                <Paginator.First>
                  <i className='pi pi-angle-double-left' />
                </Paginator.First>

                <Paginator.Prev>
                  <i className='pi pi-angle-left' />
                </Paginator.Prev>

                <Paginator.Pages>
                  {({ paginator }: PaginatorPagesInstance) =>
                    paginator?.pages.map((p, index) =>
                      p.type === 'page' ? (
                        <Paginator.Page key={index} value={p.value} />
                      ) : (
                        <Paginator.Ellipsis key={index}>
                          <i className='pi pi-ellipsis-h' />
                        </Paginator.Ellipsis>
                      ),
                    )
                  }
                </Paginator.Pages>

                <Paginator.Next>
                  <i className='pi pi-angle-right' />
                </Paginator.Next>

                <Paginator.Last>
                  <i className='pi pi-angle-double-right' />
                </Paginator.Last>
              </Paginator.Content>
            </Paginator.Root>
          )}
        </DataView>
      </div>
    );
  };

  if (!dialog) {
    return renderContent();
  }

  return (
    <Dialog.Root modal position='center' draggable={false}>
      <Dialog.Trigger as={Button} className='flex w-full justify-center gap-2'>
        {buttonIcon && <i className={`pi ${buttonIcon}`} />}
        {buttonLabel}
      </Dialog.Trigger>

      <Dialog.Backdrop className='cursor-pointer' />
      <Dialog.Portal className='w-[95vw] max-w-full sm:w-160'>
        <Dialog.Header>
          <Dialog.Title>{dialogTitle}</Dialog.Title>
          <Dialog.HeaderActions>
            <Dialog.Close>
              <i className='pi pi-times' />
            </Dialog.Close>
          </Dialog.HeaderActions>
        </Dialog.Header>
        <Dialog.Content>
          <div className='max-h-[75vh] overflow-y-auto p-1'>{renderContent()}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
