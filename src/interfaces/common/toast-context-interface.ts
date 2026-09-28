export type ToastSeverity = 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast';

export type ToastContent = {
  summary: string;
  detail: string;
};

export type ToastContextType = {
  showToast: (severity: ToastSeverity, content: ToastContent, duration?: number) => void;
};
