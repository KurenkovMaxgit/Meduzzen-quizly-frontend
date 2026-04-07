import { GetListResponse } from '../common/api-response-interface';

export interface UniversalListProps<T> {
  children?: React.ReactNode;
  items: T[];
  itemTemplate: (item: T, index: number) => React.ReactNode;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
  paginator?: boolean;
  rows?: number;
  page?: number;
  onPageChange?: (page: number) => void;
  totalRecords?: number;
  dialog?: boolean;
  dialogTitle?: string;
  dialogButtonLabel?: string;
  dialogButtonIcon?: string;
}

export interface ListHeaderProps {
  title: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
  searchbar?: boolean;
  searchValue?: string;
  setSearchValue?: (value: string) => void;
}

export interface QueryUniversalListProps<T, Q> extends Omit<
  UniversalListProps<T>,
  'items' | 'isLoading' | 'page' | 'onPageChange' | 'totalRecords'
> {
  queryHook: (params: Q) => { data?: GetListResponse<T>; isLoading: boolean; isFetching: boolean };
  queryParams?: Q;
  dataPath?: (data?: GetListResponse<T>) => T[];
  totalPath?: (data?: GetListResponse<T>) => number;
}
