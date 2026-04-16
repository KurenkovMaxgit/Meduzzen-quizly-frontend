'use client';

import { ListHeader } from '@/components/common/universal-list/list-header';
import { QueryUniversalList } from '@/components/common/universal-list/list-query';
import { CompanyAction } from '@/entities/action.entity';
import { useActionGetCompanyActionsQuery } from '@/lib/api-endpoints';
import { FindAction } from '@/types/actions/find-action.dto';
import { ActionStatus, ActionType } from '@/utils/enums';
import { useMessages } from 'next-intl';
import { CompanyMessagesListItem } from './notifications-company-list-item';
import { useRouter } from '@/i18n/routing';
import { useAppSelector } from '@/lib/hooks';
import { useState } from 'react';

export function CompanyMessagesList({
  actionType,
  companyId,
}: {
  actionType: ActionType;
  companyId: string;
}) {
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

  const messageAppearance = actionType === ActionType.REQUEST ? 'received' : 'sent';

  return (
    <QueryUniversalList<FindAction, CompanyAction>
      queryHook={useActionGetCompanyActionsQuery}
      queryParams={{
        where: {
          type: actionType,
          company: { id: companyId },
          status: selectedStatus ? selectedStatus : undefined,
        },
        relations: ['company', 'subject'],
        order: { createdAt: 'DESC' },
      }}
      paginator={true}
      rows={10}
      itemTemplate={(action: CompanyAction) => <CompanyMessagesListItem action={{ ...action }} />}
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
