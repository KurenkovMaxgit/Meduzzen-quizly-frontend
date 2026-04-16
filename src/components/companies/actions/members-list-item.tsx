'use client';

import { CompanyRole } from '@/utils/enums';
import { Tag } from '@primereact/ui/tag';
import { Checkbox } from '@primereact/ui/checkbox';
import { Button } from '@primereact/ui/button';
import { useMessages } from 'next-intl';
import { CompanyUser } from '@/entities/company-user.entity';
import { useAppSelector } from '@/lib/hooks';
import { cn } from '@/utils/cn';
import { Link } from '@/i18n/routing';
import { PROFILE_ROUTE } from '@/utils/router-constants';
import { GrantOwnerRoleButton } from './members-grant-owner-button';
import { COMPANY_ROLE_TAG_PROPS } from '@/utils/tag-props-constants';

export function MemberListItem({
  companyId,
  companyUser,
  isSelected,
  onToggleSelection,
}: {
  companyId: string;
  companyUser: CompanyUser;
  isSelected: boolean;
  onToggleSelection: (userId: string) => void;
}) {
  const dictionary = useMessages();
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const { activeRole: currentRole } = useAppSelector((state) => state.company);

  const canManage = currentRole === CompanyRole.OWNER || currentRole === CompanyRole.ADMIN;
  const isCurrentUser = currentUser?.id === companyUser.user.id;

  return (
    <div
      onClick={() => canManage && !isCurrentUser && onToggleSelection(companyUser.user.id)}
      className={cn(
        'bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 mb-4 flex w-full flex-col justify-between gap-4 rounded-xl border p-4 shadow-sm transition-colors sm:flex-row sm:items-center',
        isSelected
          ? 'bg-primary-50/50 border-primary-200 dark:bg-primary-900/20 dark:border-primary-800'
          : 'hover:bg-surface-50 dark:hover:bg-surface-800',
        canManage && 'cursor-pointer',
      )}
    >
      <div className='flex min-w-0 items-center gap-4'>
        {canManage && !isCurrentUser && (
          <div onClick={(e) => e.stopPropagation()} className='flex shrink-0 items-center'>
            <Checkbox.Root
              checked={isSelected}
              onChange={() => onToggleSelection(companyUser.user.id)}
            >
              <Checkbox.Box>
                <Checkbox.Indicator match='checked' />
              </Checkbox.Box>
            </Checkbox.Root>
          </div>
        )}

        <div className='flex min-w-0 flex-col gap-1'>
          <div className='flex items-center gap-3'>
            <span className='text-surface-900 dark:text-surface-0 truncate text-xl font-bold'>
              {companyUser.user.firstName} {companyUser.user.lastName}
            </span>
            <Tag {...COMPANY_ROLE_TAG_PROPS[companyUser.role].props} className='shrink-0'>
              {dictionary.common.companyRoles[companyUser.role]}
            </Tag>
          </div>
          <span className='text-surface-600 dark:text-surface-400 truncate text-sm'>
            {companyUser.user.email}
          </span>
        </div>
      </div>

      <div
        className='flex shrink-0 justify-end gap-4 sm:ml-auto sm:items-center'
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        {!isSelected &&
          (isCurrentUser ? (
            <Tag {...COMPANY_ROLE_TAG_PROPS[companyUser.role].props} className='shrink-0 uppercase'>
              {dictionary.memberships.membersList.you}
            </Tag>
          ) : (
            <>
              {canManage && (
                <GrantOwnerRoleButton memberId={companyUser.user.id} companyId={companyId} />
              )}

              <Link href={`${PROFILE_ROUTE}/${companyUser.user.id}`}>
                <Button
                  rounded
                  variant='outlined'
                  severity='contrast'
                  className='shrink-0'
                  title={dictionary.companies.userActions.viewProfile}
                >
                  <i className='pi pi-eye my-1' />
                </Button>
              </Link>
            </>
          ))}
      </div>
    </div>
  );
}
