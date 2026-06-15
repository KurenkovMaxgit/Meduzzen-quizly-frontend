'use client';

import { useState } from 'react';
import { UniversalList } from './list';
import { GetListResponse } from '@/interfaces/common/api-response-interface';
import { FindAllQuery } from '@/types/common/find-queries';

export function QueryUniversalList<T, Q>({
  queryHook,
  queryParams,
  dataPath = (response) => response?.data?.items || [],
  totalPath = (response) => response?.data?.totalCount || 0,
  rows = 10,
  paginator = false,
  ...props
}: {
  children?: React.ReactNode;
  itemTemplate: (item: Q, index: number) => React.ReactNode;
  emptyMessage?: string;
  className?: string;
  paginator?: boolean;
  rows?: number;
  dialog?: boolean;
  dialogTitle?: string;
  dialogTitleIcon?: string;
  dialogButtonLabel?: string;
  dialogButtonIcon?: string;
  queryHook: (params: FindAllQuery<T>) => {
    data?: GetListResponse<Q>;
    isLoading: boolean;
    isFetching: boolean;
  };
  queryParams?: FindAllQuery<T>;
  dataPath?: (data?: GetListResponse<Q>) => Q[];
  totalPath?: (data?: GetListResponse<Q>) => number;
}) {
  const [page, setPage] = useState<number>(1);

  const params = {
    ...queryParams,
    ...(paginator ? { skip: page * rows - rows, take: rows } : {}),
  };

  const { data, isLoading, isFetching } = queryHook(params);

  const items = dataPath(data);
  const totalRecords = totalPath(data);

  return (
    <UniversalList
      {...props}
      paginator={paginator}
      items={items}
      isLoading={isLoading || isFetching}
      totalRecords={totalRecords}
      page={page}
      onPageChange={setPage}
      rows={rows}
    />
  );
}
