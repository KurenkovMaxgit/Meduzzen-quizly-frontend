'use client';

import { Link } from '@/i18n/routing';
import { useNotificationGetCountQuery } from '@/lib/api-endpoints';
import { useTranslations } from 'next-intl';
import { Badge } from '@primereact/ui/badge';
import { Button } from '@primereact/ui/button';
import { OverlayBadge } from '@primereact/ui/overlaybadge';

export function NotificationBell() {
  const t = useTranslations('notifications');
  const { data } = useNotificationGetCountQuery();
  const count = data?.data?.count ?? 0;

  return (
    <OverlayBadge>
      <Button
        as={Link}
        href='/notifications'
        aria-label={t('unreadBadge', { count })}
        title={t('title')}
        variant='text'
        rounded
        iconOnly
      >
        <i className='pi pi-bell text-xl' aria-hidden='true' />
      </Button>
      {count > 0 && (
        <Badge severity='danger' className='min-w-5 px-1 text-xs'>
          {count > 99 ? '99+' : count}
        </Badge>
      )}
    </OverlayBadge>
  );
}
