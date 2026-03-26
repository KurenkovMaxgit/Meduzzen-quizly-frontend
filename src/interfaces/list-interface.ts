export interface UniversalListProps<T> {
  children?: React.ReactNode;
  items: T[];
  itemTemplate: (item: T, index: number) => React.ReactNode;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
  paginator?: boolean;
  rows?: number;
  dialog?: boolean;
  dialogTitle?: string;
  buttonLabel?: string;
  buttonIcon?: string;
}

export interface ListHeaderProps {
  title: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
  searchbar?: boolean;
}
