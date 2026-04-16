'use client';

import { useState } from 'react';
import { UniversalList } from './list';
import { QueryUniversalListProps } from '@/interfaces/components/list-interface';

export function QueryUniversalList<T, Q>({
  queryHook,
  queryParams,
  dataPath = (response) => response?.data?.items || [],
  totalPath = (response) => response?.data?.totalCount || 0,
  rows = 10,
  paginator = false,
  ...props
}: QueryUniversalListProps<T, Q>) {
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
