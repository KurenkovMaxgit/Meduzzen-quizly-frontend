'use client';

import { ListHeader } from '@/components/common/universal-list/list-header';
import { QueryUniversalList } from '@/components/common/universal-list/list-query';
import { CompanyAction } from '@/entities/action.entity';
import { useActionGetCompanyActionsQuery } from '@/lib/api-endpoints';
import { FindAction } from '@/types/actions/find-action.dto';
import { ActionStatus, ActionType } from '@/utils/enums';
import { useMessages } from 'next-intl';
import { CompanyMessagesListItem } from './notifications-company-list-item';
import { usePathname, useRouter } from '@/i18n/routing';
import { useAppSelector } from '@/lib/hooks';
import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { NOTIFICATION_STATUS_FILTER_OPTIONS } from '@/utils/filter-options';

export function CompanyMessagesList({
  actionType,
  companyId,
}: {
  actionType: ActionType;
  companyId: string;
}) {
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
        onFilterChange={handleStatusChange}
        filterPlaceholder={dictionary.common.filter.byStatus}
      />
    </QueryUniversalList>
  );
}
