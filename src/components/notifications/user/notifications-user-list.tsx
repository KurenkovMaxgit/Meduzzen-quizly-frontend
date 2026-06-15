'use client';

import { ListHeader } from '@/components/common/universal-list/list-header';
import { QueryUniversalList } from '@/components/common/universal-list/list-query';
import { CompanyAction } from '@/entities/action.entity';
import { useActionGetUserActionsQuery } from '@/lib/api-endpoints';
import { FindAction } from '@/types/actions/find-action.dto';
import { ActionStatus, ActionType } from '@/utils/enums';
import { useMessages } from 'next-intl';
import { UserMessagesListItem } from './notifications-user-list-item';
import { usePathname, useRouter } from '@/i18n/routing';
import { useAppSelector } from '@/lib/hooks';
import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { NOTIFICATION_STATUS_FILTER_OPTIONS } from '@/utils/filter-options';

export function UserMessagesList({ actionType }: { actionType: ActionType }) {
  const dictionary = useMessages();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { activeCompany: currentCompany } = useAppSelector((state) => state.company);

  if (!currentCompany) {
    router.back();
  }

  const roleFilterOptions = useMemo(
    () =>
      NOTIFICATION_STATUS_FILTER_OPTIONS.map((filter) => ({
        label: dictionary.common.actionStatus[filter.key],
        value: filter.value,
      })),
    [dictionary],
  );

  const selectedStatus = searchParams.get('status') as ActionStatus | null;

  const handleStatusChange = (status: ActionStatus | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (status) {
      params.set('status', status);
    } else {
      params.delete('status');
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const messageAppearance = actionType === ActionType.INVITE ? 'received' : 'sent';

  return (
    <QueryUniversalList<FindAction, CompanyAction>
      queryHook={useActionGetUserActionsQuery}
      queryParams={{
        where: { type: actionType, status: selectedStatus ? selectedStatus : undefined },
        relations: ['company', 'subject'],
        order: { createdAt: 'DESC' },
      }}
      paginator={true}
      rows={10}
      itemTemplate={(action: CompanyAction) => <UserMessagesListItem action={{ ...action }} />}
      emptyMessage={dictionary.messages.list.emptyMessage}
    >
      <ListHeader
        title={dictionary.messages.list[messageAppearance].title}
        filterOptions={roleFilterOptions}
        filterValue={selectedStatus}
        onFilterChange={handleStatusChange}
        filterPlaceholder={dictionary.common.filter.byStatus}
      />
    </QueryUniversalList>
  );
}
