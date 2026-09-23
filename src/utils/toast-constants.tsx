import {
  Bell,
  Check,
  ExclamationTriangle,
  InfoCircle,
  Megaphone,
  TimesCircle,
} from '@primeicons/react';
import type { IconProps } from '@primeicons/react';
import type { ComponentType } from 'react';
import type { ToastSeverity } from '@/interfaces/common/toast-context-interface';

export type ToastIconComponent = ComponentType<IconProps>;

export const TOAST_SEVERITY_ICON_COMPONENTS: Record<ToastSeverity, ToastIconComponent> = {
  success: Check,
  info: InfoCircle,
  warn: ExclamationTriangle,
  error: TimesCircle,
  secondary: Megaphone,
  contrast: Bell,
};
