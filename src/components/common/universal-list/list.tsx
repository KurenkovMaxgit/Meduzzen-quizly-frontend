'use client';

import { Paginator } from '@primereact/ui/paginator';
import type {
  PaginatorPagesInstance,
  usePaginatorChangeEvent,
} from '@primereact/types/shared/paginator';
import { DataView } from '@primereact/ui/dataview';
import React from 'react';
import { UniversalListProps } from '@/interfaces/components/list-interface';
import { ListDialogWrapper } from './list-dialog-wrapper';
import { ListSkeleton } from './list-skeletons';
import { ListNotFound } from './list-not-found';

export function UniversalList<T>(props: UniversalListProps<T>) {
  if (!props.dialog) {
    return <BaseListContent {...props} />;
  }

  return (
    <ListDialogWrapper
      title={props.dialogTitle}
      titleIcon={props.dialogTitleIcon}
      buttonLabel={props.dialogButtonLabel}
      buttonIcon={props.dialogButtonIcon}
    >
      <BaseListContent {...props} />
    </ListDialogWrapper>
  );
}

function BaseListContent<T>({
  children,
  items = [],
  itemTemplate,
  isLoading = false,
  emptyMessage = 'Item not found',
  className = '',
  paginator = false,
  rows = 10,
  page: externalPage,
  onPageChange,
  totalRecords,
}: UniversalListProps<T>) {
  const [internalPage, setInternalPage] = React.useState<number>(1);

  const currentPage = externalPage !== undefined ? externalPage : internalPage;
  const totalItems = totalRecords !== undefined ? totalRecords : items.length;
  const displayedItems =
    paginator && totalRecords === undefined
      ? items.slice((currentPage - 1) * rows, currentPage * rows)
      : items;

  const handlePageChange = (newPage: number) => {
    setInternalPage(newPage);
    if (onPageChange) onPageChange(newPage);
  };

  let content;

  if (isLoading) {
    content = (
      <div className='space-y-4'>
        {Array.from({ length: 2 }).map((_, index) => (
          <ListSkeleton index={index} key={index} />
        ))}
      </div>
    );
  } else if (items.length === 0) {
    content = <ListNotFound emptyMessage={emptyMessage} />;
  } else {
    content = (
      <DataView>
        <div className='flex flex-col'>
          {displayedItems.map((item, index) => (
            <React.Fragment key={index}>{itemTemplate(item, index)}</React.Fragment>
          ))}
        </div>

        {paginator && totalItems > rows && (
          <Paginator.Root
            total={totalItems}
            page={currentPage}
            itemsPerPage={rows}
            onPageChange={(e: usePaginatorChangeEvent) => handlePageChange(e.value)}
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
    );
  }

  return (
    <div className={className}>
      {children}
      {content}
    </div>
  );
}
