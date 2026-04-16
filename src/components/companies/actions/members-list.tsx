'use client';

import { useState } from 'react';
import { Button } from '@primereact/ui/button';
import { useCompanyFindAllMembersQuery } from '@/lib/api-endpoints';
import { useMessages } from 'next-intl';
import { CompanyUser } from '@/entities/company-user.entity';
import { QueryUniversalList } from '@/components/common/universal-list/list-query';
import { MemberListItem } from './members-list-item';
import { ListHeader } from '@/components/common/universal-list/list-header';
import { useDebounce } from '@/hooks/use-debounce';
import { BulkKickMembersButton } from './members-bulk-kick-button';
import { BulkChangeMembersRoleButton } from './members-bulk-change-role-button';
import { FindCompanyMembers } from '@/types/company/find-company-members';
import { CompanyRole } from '@/utils/enums';
import { AddUserDialog } from './members-add-user-dialog';

export function MembersList({ companyId }: { companyId: string }) {
  const dictionary = useMessages();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [searchMembersValue, setMembersSearchValue] = useState<string>('');
  const debouncedMembersSearch = useDebounce(searchMembersValue, 500);

  const [selectedRole, setSelectedRole] = useState<CompanyRole | null>(null);

  const roleFilterOptions = [
    { label: dictionary.common.companyRoles.owner, value: CompanyRole.OWNER },
    { label: dictionary.common.companyRoles.admin, value: CompanyRole.ADMIN },
    { label: dictionary.common.companyRoles.member, value: CompanyRole.MEMBER },
  ];

  const handleToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id],
    );
  };

  return (
    <div className='mx-auto max-w-5xl'>
      <QueryUniversalList<FindCompanyMembers, CompanyUser>
        queryHook={useCompanyFindAllMembersQuery}
        queryParams={{
          where: { company: { id: companyId }, role: selectedRole ? selectedRole : undefined },
          search: debouncedMembersSearch,
          relations: ['user'],
        }}
        itemTemplate={(member: CompanyUser) => (
          <MemberListItem
            companyId={companyId}
            companyUser={{ ...member }}
            isSelected={selectedIds.includes(member.user.id)}
            onToggleSelection={handleToggle}
          />
        )}
        emptyMessage={dictionary.memberships.membersList.emptyMessage}
        paginator={true}
        rows={10}
      >
        <ListHeader<CompanyRole>
          title={dictionary.memberships.membersList.title}
          searchbar
          searchValue={searchMembersValue}
          setSearchValue={setMembersSearchValue}
          buttonLabel={dictionary.memberships.usersList.title}
          onButtonClick={() => setIsCreateDialogOpen(true)}
          filterOptions={roleFilterOptions}
          filterValue={selectedRole}
          onFilterChange={setSelectedRole}
          filterPlaceholder={dictionary.common.filter.byRole}
        />
        {selectedIds.length > 0 && (
          <div className='bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 sticky top-4 z-20 mb-6 grid min-h-18 grid-cols-1 gap-4 rounded-xl border p-4 sm:grid-cols-[auto_1fr] sm:px-4 sm:py-2'>
            <div className='flex items-center gap-4'>
              <Button
                variant='text'
                severity='secondary'
                rounded
                onClick={() => setSelectedIds([])}
                className='h-10 w-10 shrink-0 p-0'
              >
                <i className='pi pi-times' />
              </Button>
              <span className='text-lg font-bold whitespace-nowrap'>
                {selectedIds.length} {dictionary.memberships.actions.selected}
              </span>
            </div>

            <div className='grid w-full grid-cols-4 items-center gap-3 sm:flex sm:w-auto sm:justify-end'>
              <div className='col-span-3 flex justify-center sm:w-auto'>
                <BulkChangeMembersRoleButton
                  companyId={companyId}
                  memberIds={selectedIds}
                  onSuccess={() => setSelectedIds([])}
                />
              </div>

              <div className='col-span-1 flex justify-center sm:w-auto'>
                <BulkKickMembersButton
                  companyId={companyId}
                  memberIds={selectedIds}
                  onSuccess={() => setSelectedIds([])}
                />
              </div>
            </div>
          </div>
        )}
      </QueryUniversalList>

      {isCreateDialogOpen && (
        <AddUserDialog isOpen={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)} />
      )}
    </div>
  );
}
