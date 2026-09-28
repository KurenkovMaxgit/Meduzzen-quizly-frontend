'use client';

import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useLocale, useTranslations } from 'next-intl';
import Cookies from 'js-cookie';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { quizlyApi, refreshAccessToken } from '@/lib/api-endpoints';
import { useGlobalToast } from '@/providers/toast-provider';
import { ACCESS_TOKEN_KEY } from '@/utils/cookie-constants';
import { API_BASE_URL } from '@/utils/api-constants';
import { NewNotificationEvent } from '@/types/notification/notification';
import { NotificationType } from '@/utils/enums';

function isNotificationEvent(value: unknown): value is NewNotificationEvent {
  if (!value || typeof value !== 'object') return false;
  const payload = value as Record<string, unknown>;

  return (
    typeof payload.id === 'string' &&
    typeof payload.text === 'string' &&
    typeof payload.createdAt === 'string' &&
    typeof payload.type === 'string'
  );
}

export function NotificationSocketManager() {
  const userId = useAppSelector((state) => state.auth.user?.id);
  const dispatch = useAppDispatch();
  const { showToast } = useGlobalToast();
  const t = useTranslations('notifications');
  const locale = useLocale();

  useEffect(() => {
    if (!userId || typeof window === 'undefined') return;

    const token = Cookies.get(ACCESS_TOKEN_KEY);
    if (!token) return;

    let closed = false;
    let refreshing = false;
    let retriedAuth = false;
    let socketToken = token;
    const baseUrl = API_BASE_URL || window.location.origin;
    const socketOrigin = new URL(baseUrl, window.location.origin).origin;
    const socket = io(`${socketOrigin}/notifications`, {
      autoConnect: false,
      auth: { token: socketToken },
    });

    const refreshAndReconnect = async () => {
      if (refreshing || closed) return;
      refreshing = true;
      socket.disconnect();
      try {
        const nextToken = await refreshAccessToken();
        if (nextToken && !closed) {
          socketToken = nextToken;
          socket.auth = { token: socketToken };
          socket.connect();
        }
      } catch {
        // A failed refresh leaves REST and the rest of the page usable.
      } finally {
        refreshing = false;
      }
    };

    socket.on('connect', () => {
      retriedAuth = false;
      dispatch(quizlyApi.util.invalidateTags(['Notifications', 'NotificationCount']));
    });

    socket.on('new_notification', (value: unknown) => {
      if (!isNotificationEvent(value)) return;
      const event = value;
      const title =
        event.type === NotificationType.QUIZ_CREATED
          ? t('toast.quizCreated')
          : event.type === NotificationType.QUIZ_REMINDER
            ? t('toast.quizReminder')
            : event.type === NotificationType.SYSTEM_ALERT
              ? t('toast.systemAlert')
              : event.type === NotificationType.COMPANY_ACTION
                ? t('toast.companyAction')
                : t('toast.generic');
      showToast('info', { summary: title, detail: event.text || t('toast.generic') });
      dispatch(quizlyApi.util.invalidateTags(['Notifications', 'NotificationCount']));
    });

    socket.on('connect_error', (error: Error) => {
      if (/unauthorized|token|expired/i.test(error.message)) {
        if (retriedAuth) {
          socket.disconnect();

          return;
        }
        retriedAuth = true;
        void refreshAndReconnect();
      }
    });

    socket.connect();

    return () => {
      closed = true;
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [dispatch, locale, showToast, t, userId]);

  return null;
}
