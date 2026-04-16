'use client';

import { ListHeader } from '@/components/common/universal-list/list-header';
import { QueryUniversalList } from '@/components/common/universal-list/list-query';
import { CompanyAction } from '@/entities/action.entity';
import { useActionGetUserActionsQuery } from '@/lib/api-endpoints';
import { FindAction } from '@/types/actions/find-action.dto';
import { ActionStatus, ActionType } from '@/utils/enums';
import { useMessages } from 'next-intl';
import { UserMessagesListItem } from './notifications-user-list-item';
import { useRouter } from '@/i18n/routing';
import { useAppSelector } from '@/lib/hooks';
import { useState } from 'react';

export function UserMessagesList({ actionType }: { actionType: ActionType }) {
  const dictionary = useMessages();
  const router = useRouter();
  const { activeCompany: currentCompany } = useAppSelector((state) => state.company);

  if (!currentCompany) {
    router.back();
  }

  const [selectedStatus, setSelectedStatus] = useState<ActionStatus | null>(null);

  const roleFilterOptions = [
    { label: dictionary.common.actionStatus.pending, value: ActionStatus.PENDING },
    { label: dictionary.common.actionStatus.accepted, value: ActionStatus.ACCEPTED },
    { label: dictionary.common.actionStatus.declined, value: ActionStatus.DECLINED },
  ];

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
        onFilterChange={setSelectedStatus}
        filterPlaceholder={dictionary.common.filter.byStatus}
      />
    </QueryUniversalList>
  );
}
