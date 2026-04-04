'use client';

import React, { createContext, useContext, useCallback } from 'react';
import { Toast } from '@primereact/ui/toast';
import { Toaster } from '@primereact/ui/toaster';
import { toast } from '@primereact/headless/toaster';
import { ToasterRegionInstance, ToastType } from '@primereact/types/shared/toaster';
import { Button } from '@primereact/ui/button';
import { ToastContextType } from '@/interfaces/common/toast-context-interface';

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const showToast = useCallback(
    (
      variant: ToastType['variant'] | 'error',
      content: { summary: string; detail: string },
      duration?: number,
    ) => {
      const payload = {
        title: content.summary,
        description: content.detail,
        duration: duration ? duration : 3000,
      };

      if (variant === 'success') toast.success(payload);
      else if (variant === 'danger' || variant === 'error') toast.danger(payload);
      else if (variant === 'warn') toast.warn(payload);
      else if (variant === 'info') toast.info(payload);
      else toast(payload);
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toaster.Root>
        <Toaster.Portal>
          <Toaster.Region>
            {({ toaster }: ToasterRegionInstance) =>
              toaster?.toasts.map((toastItem: ToastType) => {
                const variant = toastItem.variant;

                let textColorClass = '!text-surface-900 dark:!text-surface-0';
                let iconClass = 'pi-info-circle';

                if (variant === 'danger') {
                  textColorClass = '!text-red-500 dark:!text-red-400';
                  iconClass = 'pi-times-circle';
                } else if (variant === 'success') {
                  textColorClass = '!text-green-500 dark:!text-green-400';
                  iconClass = 'pi-check';
                } else if (variant === 'warn') {
                  textColorClass = '!text-orange-500 dark:!text-orange-400';
                  iconClass = 'pi-exclamation-triangle';
                } else if (variant === 'info') {
                  textColorClass = '!text-blue-500 dark:!text-blue-400';
                  iconClass = 'pi-info-circle';
                }

                return (
                  <Toast.Root
                    key={toastItem.id}
                    toast={toastItem}
                    className='bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 pointer-events-auto relative rounded-xl border p-4 shadow-xl transition-all'
                  >
                    <div className='flex flex-col gap-2 pr-8'>
                      <div className='flex items-center gap-2'>
                        <i className={`pi ${iconClass} text-lg ${textColorClass}`} />
                        <Toast.Title
                          className={`overflow-hidden font-bold text-ellipsis whitespace-nowrap ${textColorClass}`}
                        />
                      </div>

                      <Toast.Description
                        className={`w-full text-sm leading-relaxed whitespace-pre-wrap opacity-90`}
                      />
                      <Toast.Action as={Button} size='small' className='mt-1' />
                    </div>

                    <Toast.Close
                      as={Button}
                      iconOnly
                      variant='text'
                      size='small'
                      severity={variant || 'secondary'}
                      className={`absolute! top-2! right-2! hover:bg-black/10 dark:hover:bg-white/10 ${textColorClass}`}
                    >
                      <i className='pi pi-times' />
                    </Toast.Close>
                  </Toast.Root>
                );
              })
            }
          </Toaster.Region>
        </Toaster.Portal>
      </Toaster.Root>

      {children}
    </ToastContext.Provider>
  );
}

export function useGlobalToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useGlobalToast must be used within a ToastProvider');
  }

  return context;
}
