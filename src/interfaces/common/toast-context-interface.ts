import { ToastType } from '@primereact/types/shared/toaster';

export type ToastContextType = {
  showToast: (
    variant: ToastType['variant'] | 'error',
    summary: string,
    detail: string,
    duration?: number,
  ) => void;
};
