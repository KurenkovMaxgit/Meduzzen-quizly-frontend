'use client';

import React, { useState } from 'react';
import UniversalList from './list';
import { QueryUniversalListProps } from '@/interfaces/components/list-interface';

export default function QueryUniversalList<T, Q>({
  queryHook,
  queryParams,
  dataPath = (response) => response?.data?.items || [],
  totalPath = (response) => response?.data?.totalCount || 0,
  rows = 10,
  ...props
}: QueryUniversalListProps<T, Q>) {
  const [page, setPage] = useState<number>(1);

  const params = {
    ...queryParams,
    page,
    limit: rows,
  } as Q;

  const { data, isLoading, isFetching } = queryHook(params);

  const items = dataPath(data);
  const totalRecords = totalPath(data);

  return (
    <UniversalList
      {...props}
      items={items}
      isLoading={isLoading || isFetching}
      totalRecords={totalRecords}
      page={page}
      onPageChange={setPage}
      rows={rows}
    />
  );
}
