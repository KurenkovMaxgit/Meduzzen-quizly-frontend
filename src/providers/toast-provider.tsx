'use client';

import React, { createContext, useContext, useCallback } from 'react';
import { Toast } from '@primereact/ui/toast';
import { Toaster, ToasterRegionInstance, ToastType, toast } from '@primereact/ui/toaster';
import { Times } from '@primeicons/react';
import { ToastContextType, ToastSeverity } from '@/interfaces/common/toast-context-interface';
import { TOAST_SEVERITY_ICON_COMPONENTS } from '@/utils/toast-constants';

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const showToast = useCallback(
    (severity: ToastSeverity, content: { summary: string; detail: string }, duration?: number) => {
      const payload = {
        severity: severity,
        title: content.summary,
        description: content.detail,
        duration: duration ? duration : 3000,
      };

      toast(payload);
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toaster.Root position='bottom-right'>
        <Toaster.Portal>
          <Toaster.Region>
            {({ toaster }: ToasterRegionInstance) =>
              toaster?.toasts.map((toastItem: ToastType) => {
                const displaySeverity =
                  toastItem.severity === 'normal' ? 'info' : (toastItem.severity ?? 'info');
                const Icon = TOAST_SEVERITY_ICON_COMPONENTS[displaySeverity];

                return (
                  <Toast.Root
                    key={toastItem.id}
                    toast={toastItem}
                    className='pointer-events-auto relative rounded-xl border p-4 shadow-xl transition-all'
                  >
                    <div className='flex flex-col gap-2 pr-8'>
                      <div className='flex items-center gap-2'>
                        <Toast.Icon match={toastItem.severity}>
                          <Icon />
                        </Toast.Icon>
                        <Toast.Title className='font-bold text-ellipsis whitespace-nowrap not-first:overflow-hidden' />
                      </div>

                      <Toast.Description className='w-full text-sm leading-relaxed whitespace-pre-wrap opacity-90' />
                    </div>

                    <Toast.Close>
                      <Times />
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
