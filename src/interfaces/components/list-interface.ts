 
import { FindAllQuery } from '@/types/common/find-queries';
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
  dialogTitleIcon?: string;
  dialogButtonLabel?: string;
  dialogButtonIcon?: string;
}

export interface FilterOption<T = string> {
  label: string;
  value: T;
}

export interface ListHeaderProps<T = string> {
  title?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
  searchbar?: boolean;
  searchValue?: string;
  setSearchValue?: (value: string) => void;
  filterOptions?: FilterOption<T>[];
  filterValue?: T | null;
  onFilterChange?: (value: T | null) => void;
  filterPlaceholder?: string;
}

export interface QueryUniversalListProps<T, Q> extends Omit<
  UniversalListProps<Q>,
  'items' | 'isLoading' | 'page' | 'onPageChange' | 'totalRecords'
> {
  queryHook: (params: FindAllQuery<T>) => {
    data?: GetListResponse<Q>;
    isLoading: boolean;
    isFetching: boolean;
  };
  queryParams?: FindAllQuery<T>;
  dataPath?: (data?: GetListResponse<Q>) => Q[];
  totalPath?: (data?: GetListResponse<Q>) => number;
}
