'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@primereact/ui/button';
import { Paginator, PaginatorPagesInstance } from '@primereact/ui/paginator';
import { Select, SelectValueChangeEvent } from '@primereact/ui/select';
import { Tag } from '@primereact/ui/tag';
import { ListNotFound } from '@/components/common/universal-list/list-not-found';
import { ListSkeleton } from '@/components/common/universal-list/list-skeletons';
import {
  useNotificationFindAllQuery,
  useNotificationUpdateStatusMutation,
} from '@/lib/api-endpoints';
import { Notification } from '@/types/notification/notification';
import { ActionType, NotificationStatus, NotificationType } from '@/utils/enums';

const PAGE_SIZE = 10;

const statusSeverity = {
  [NotificationStatus.UNREAD]: 'info',
  [NotificationStatus.READ]: 'success',
  [NotificationStatus.ARCHIVED]: 'secondary',
} as const;

function typeTranslationKey(type: string) {
  switch (type) {
    case NotificationType.QUIZ_CREATED:
      return 'quizCreated';
    case NotificationType.QUIZ_REMINDER:
      return 'quizReminder';
    case NotificationType.SYSTEM_ALERT:
      return 'systemAlert';
    case NotificationType.COMPANY_ACTION:
      return 'companyAction';
    default:
      return 'generic';
  }
}

function getObjectiveHref(notification: Notification) {
  const metadata = notification.metadata ?? {};
  const companyId = notification.companyId ?? notification.company?.id;
  const quizId = metadata.quizId;

  if (
    (notification.type === NotificationType.QUIZ_CREATED ||
      notification.type === NotificationType.QUIZ_REMINDER) &&
    typeof quizId === 'string' &&
    companyId
  ) {
    return `/companies/${companyId}/quizzes/${quizId}/attempt`;
  }

  if (notification.type === NotificationType.COMPANY_ACTION) {
    const audience = metadata.audience;
    const actionType = metadata.actionType;
    if (metadata.actionStatus === 'cancelled') return '/notifications';

    if (actionType === ActionType.INVITE && audience === 'invitee') return '/messages/received';
    if (actionType === ActionType.REQUEST && audience === 'requester') return '/messages/sent';
    if (companyId && actionType === ActionType.REQUEST && audience === 'company_admin') {
      return `/companies/${companyId}/messages/received`;
    }
    if (companyId && actionType === ActionType.INVITE && audience === 'inviter') {
      return `/companies/${companyId}/messages/sent`;
    }
  }

  return '/notifications';
}

export function NotificationCenter() {
  const t = useTranslations('notifications');
  const locale = useLocale();
  const [status, setStatus] = useState<NotificationStatus | 'all'>('all');
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, isError } = useNotificationFindAllQuery({
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    where: status === 'all' ? undefined : { status },
    order: { createdAt: 'DESC', id: 'DESC' },
    relations: ['company'],
  });
  const [updateStatus, { isLoading: isUpdating }] = useNotificationUpdateStatusMutation();
  const notifications = data?.data?.items ?? [];
  const total = data?.data?.totalCount ?? 0;

  const changeStatus = async (notification: Notification, nextStatus: NotificationStatus) => {
    await updateStatus({ status: nextStatus, notificationIds: [notification.id] });
  };

  const statusOptions = [
    { label: t('allStatuses'), value: 'all' },
    { label: t('statuses.unread'), value: NotificationStatus.UNREAD },
    { label: t('statuses.read'), value: NotificationStatus.READ },
    { label: t('statuses.archived'), value: NotificationStatus.ARCHIVED },
  ];

  const formatDate = (value: string | Date) =>
    new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(
      new Date(value),
    );

  return (
    <section className='mx-auto w-full max-w-5xl'>
      <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <h1 className='m-0 text-3xl font-bold'>{t('title')}</h1>
        <div className='flex flex-col gap-2 sm:w-64'>
          <label className='text-sm' htmlFor='notification-status-filter'>
            {t('filter')}
          </label>
          <Select.Root
            value={status}
            onValueChange={(event: SelectValueChangeEvent) => {
              setStatus((event.value as NotificationStatus | 'all') ?? 'all');
              setPage(1);
            }}
            options={statusOptions}
            optionLabel='label'
            optionValue='value'
            className='w-full'
          >
            <Select.Trigger id='notification-status-filter' className='w-full'>
              <Select.Value placeholder={t('filter')} />
              <Select.Indicator>
                <i className='pi pi-chevron-down' />
              </Select.Indicator>
            </Select.Trigger>
            <Select.Portal>
              <Select.Positioner className='z-50'>
                <Select.Popup className='border-surface-200 bg-surface-0 dark:border-surface-700 dark:bg-surface-900 mt-1 min-w-48 overflow-hidden rounded-lg border shadow-xl'>
                  <Select.List className='py-1 outline-none'>
                    {statusOptions.map((option, index) => (
                      <Select.Option
                        key={option.value}
                        index={index}
                        uKey={option.value}
                        className='text-surface-700 hover:bg-surface-100 data-[p-highlight=true]:bg-primary-50 dark:text-surface-0 dark:hover:bg-surface-800 dark:data-[p-highlight=true]:bg-primary-900/40 flex cursor-pointer items-center gap-2 px-4 py-2 transition-colors'
                      >
                        {option.label}
                      </Select.Option>
                    ))}
                  </Select.List>
                </Select.Popup>
              </Select.Positioner>
            </Select.Portal>
          </Select.Root>
        </div>
      </div>

      {isLoading || isFetching ? (
        <div className='space-y-4' aria-label={t('loading')}>
          <ListSkeleton />
          <ListSkeleton />
        </div>
      ) : isError ? (
        <p className='text-danger-600 py-8 text-center'>{t('loadError')}</p>
      ) : notifications.length === 0 ? (
        <ListNotFound emptyMessage={t('empty')} />
      ) : (
        <div className='space-y-3'>
          {notifications.map((notification) => {
            const companyId = notification.companyId ?? notification.company?.id;
            const objectiveHref = getObjectiveHref(notification);

            return (
              <div
                key={notification.id}
                className='bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 mb-4 flex flex-col justify-between gap-4 rounded-xl border p-4 shadow-sm sm:flex-row sm:items-center'
              >
                <div className='flex min-w-0 flex-col gap-1'>
                  <div className='flex flex-wrap items-center gap-3'>
                    <span className='text-surface-900 dark:text-surface-0 text-lg font-semibold sm:text-xl'>
                      {t(`typeLabels.${typeTranslationKey(notification.type)}`)}
                    </span>
                    <Tag severity={statusSeverity[notification.status]} className='shrink-0'>
                      {t(`statuses.${notification.status}`)}
                    </Tag>
                  </div>
                  <p className='text-surface-600 dark:text-surface-400 sm:text-md my-1 text-sm'>
                    {notification.type === NotificationType.QUIZ_CREATED ||
                    notification.type === NotificationType.QUIZ_REMINDER ? (
                      <Button
                        as={Link}
                        href={objectiveHref}
                        variant='text'
                        severity='secondary'
                        className='h-auto max-w-full justify-start p-0 text-left font-normal whitespace-normal hover:underline'
                      >
                        {notification.text}
                      </Button>
                    ) : (
                      notification.text
                    )}
                  </p>
                  {notification.company && companyId && (
                    <div className='flex flex-wrap items-center'>
                      <span className='text-surface-600 dark:text-surface-400 text-sm'>
                        {t('company')}:{' '}
                      </span>
                      <Button
                        as={Link}
                        href={`/companies/${companyId}`}
                        variant='text'
                        severity='primary'
                        className='h-auto max-w-full justify-start px-1 py-0 text-left text-sm font-medium hover:underline'
                      >
                        {notification.company.name}
                      </Button>
                    </div>
                  )}
                  <time
                    className='text-surface-500 dark:text-surface-400 text-xs'
                    dateTime={new Date(notification.createdAt).toISOString()}
                  >
                    {formatDate(notification.createdAt)}
                  </time>
                </div>
                <div className='flex shrink-0 flex-wrap justify-end gap-3 sm:ml-auto sm:items-center'>
                  <Button
                    as={Link}
                    href={objectiveHref}
                    rounded
                    variant='outlined'
                    severity='contrast'
                    iconOnly
                    title={t('actions.view')}
                    aria-label={t('actions.view')}
                    className='shrink-0'
                  >
                    <i className='pi pi-eye my-1' />
                  </Button>
                  {notification.status !== NotificationStatus.ARCHIVED && (
                    <>
                      {notification.status === NotificationStatus.UNREAD && (
                        <Button
                          rounded
                          disabled={isUpdating}
                          size='small'
                          variant='outlined'
                          severity='success'
                          title={t('actions.markRead')}
                          aria-label={t('actions.markRead')}
                          onClick={() => void changeStatus(notification, NotificationStatus.READ)}
                        >
                          <i className='pi pi-check my-1' />
                          <span className='hidden sm:inline'>{t('actions.markRead')}</span>
                        </Button>
                      )}
                      <Button
                        rounded
                        disabled={isUpdating}
                        size='small'
                        variant='outlined'
                        severity='secondary'
                        title={t('actions.archive')}
                        aria-label={t('actions.archive')}
                        onClick={() => void changeStatus(notification, NotificationStatus.ARCHIVED)}
                      >
                        <i className='pi pi-inbox my-1' />
                        <span className='hidden sm:inline'>{t('actions.archive')}</span>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {total > PAGE_SIZE && (
            <nav aria-label={t('pagination')}>
              <Paginator.Root
                total={total}
                page={page}
                itemsPerPage={PAGE_SIZE}
                PaginatorRootChangeEvent={(nextPage: number) => setPage(nextPage)}
                className='border-surface-200 dark:border-surface-700 mt-4 border-t pt-4'
              >
                <Paginator.Content>
                  <Paginator.First>
                    <i className='pi pi-angle-double-left' />
                  </Paginator.First>
                  <Paginator.Prev>
                    <i className='pi pi-angle-left' />
                  </Paginator.Prev>
                  <Paginator.Pages>
                    {({ paginator }: PaginatorPagesInstance) =>
                      paginator?.pages.map((item, index) =>
                        item.type === 'page' ? (
                          <Paginator.Page key={index} value={item.value} />
                        ) : (
                          <Paginator.Ellipsis key={index}>
                            <i className='pi pi-ellipsis-h' />
                          </Paginator.Ellipsis>
                        ),
                      )
                    }
                  </Paginator.Pages>
                  <Paginator.Next>
                    <i className='pi pi-angle-right' />
                  </Paginator.Next>
                  <Paginator.Last>
                    <i className='pi pi-angle-double-right' />
                  </Paginator.Last>
                </Paginator.Content>
              </Paginator.Root>
            </nav>
          )}
        </div>
      )}
    </section>
  );
}
