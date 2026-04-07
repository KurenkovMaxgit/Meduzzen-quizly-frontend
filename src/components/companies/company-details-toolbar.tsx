'use client';

import { Button } from '@primereact/ui/button';
import { UniversalList } from '../common/list';
import { CompanyMemberListItem } from './company-members-list-item';
import { CompanyRole } from '@/utils/enums';
import { useMessages } from 'next-intl';
import { ReturnCompany } from '@/types/company/return-company';
import { cn } from '@/utils/cn';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useCompanySession } from '@/hooks/use-company-session';
import LocalizedLink from '../common/localized-link';
import { ConfirmPopup } from '@primereact/ui/confirmpopup';
import {
  useCompanyControllerDeleteOneByIdMutation,
  useCompanyControllerLeaveCompanyMutation,
} from '@/lib/quizly-api';
import { ApiResponse } from '@/interfaces/common/api-response-interface';
import { clearActiveCompany } from '@/lib/slices/company-slice';
import { useRouter } from 'next/navigation';
import { useGlobalToast } from '@/providers/toast-provider';

export function CompanyDetailsToolbar({ company }: { company: ReturnCompany }) {
  const dictionary = useMessages();
  const currentLocale = useCurrentLocale();
  const router = useRouter();
  const toast = useGlobalToast();

  const { user: currentUser } = useAppSelector((state) => state.auth);
  const { activeCompany: currentCompany } = useAppSelector((state) => state.company);
  const { enterCompany, exitCompany } = useCompanySession();

  const [leaveCompany, { isLoading: isLeaving }] = useCompanyControllerLeaveCompanyMutation();
  const [deleteCompany, { isLoading: isDeleting }] = useCompanyControllerDeleteOneByIdMutation();

  const dispatch = useAppDispatch();

  const isOwner =
    company?.members?.find((member) => member.user.id === currentUser?.id)?.role ===
    CompanyRole.OWNER;

  const handleLeaveCompany = async () => {
    try {
      const leavedCompany: ApiResponse<unknown> = await leaveCompany(company.id).unwrap();

      if (leavedCompany.data) {
        if (company.id === currentCompany?.id) {
          dispatch(clearActiveCompany());
        }

        router.push(`/${currentLocale}/`);

        toast.showToast('success', dictionary.toast.company.delete.success);
      }
    } catch (error) {
      console.error('Failed to update company:', error);
    }
  };

  const handleDeleteCompany = async () => {
    try {
      const createdCompany: ApiResponse<unknown> = await deleteCompany(company.id).unwrap();

      if (createdCompany.data) {
        dispatch(clearActiveCompany());

        router.push(`/${currentLocale}/`);

        toast.showToast('success', dictionary.toast.company.delete.success);
      }
    } catch (error) {
      console.error('Failed to update company:', error);
    }
  };

  return (
    <div
      className={cn(
        currentCompany.members.find((member) => member.user.id === mockUser.id)?.role ===
          CompanyRole.OWNER
          ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'
          : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3',
        'grid gap-2',
      )}
    >
      <UniversalList
        items={company.members!}
        itemTemplate={CompanyMemberListItem}
        dialogTitle={dictionary.companies.details.membersList.title}
        isLoading={false}
        emptyMessage={dictionary.companies.emptyMessage}
        dialog
        dialogButtonLabel={dictionary.companies.details.membersList.buttonLabel}
        dialogButtonIcon='pi pi-users'
      >
        {/* TODO: Add ListHeader with members management tools*/}
      </UniversalList>

      {/* TODO: Add quizzes template */}
      {/* <UniversalList
        items={}
        itemTemplate={}
        dialogTitle="Members"
        isLoading={false}
        emptyMessage="No companies found."
        dialog
        buttonLabel="Quizzes List"
        buttonIcon="pi pi-clipboard"
      /> */}

      {/* PLACEHOLDER */}
      <Button>
        <i className='pi pi-clipboard' />
        {dictionary.companies.details.quizzesList.title}
      </Button>
      {/* PLACEHOLDER */}

      {company.id === currentCompany?.id ? (
        <LocalizedLink href={'/'} className='block w-full'>
          <Button
            severity='danger'
            variant='outlined'
            className='w-full justify-center'
            onClick={() => exitCompany()}
          >
            <i className='pi pi-sign-out' />
            {dictionary.companies.actions.exitCompany}
          </Button>
        </LocalizedLink>
      ) : (
        <Button severity='success' variant='outlined' onClick={() => enterCompany(company)}>
          <i className='pi pi-sign-in' />
          {dictionary.companies.actions.enterCompany}
        </Button>
      )}
      {isOwner ? (
        <ConfirmPopup.Root>
          <ConfirmPopup.Trigger
            severity='danger'
            variant='outlined'
            className='w-full justify-center'
          >
            <i className='pi pi-trash' />
            {dictionary.companies.actions.deleteCompany}
          </ConfirmPopup.Trigger>

          <ConfirmPopup.Portal>
            <ConfirmPopup.Content>
              <div className='border-surface-200 dark:border-surface-700 flex items-center gap-3 border-b p-2 pb-3'>
                <i className='pi pi-exclamation-triangle mb-1' />
                <p className='m-0'>{dictionary.companies.actions.deleteCompanyConfirmation}</p>
              </div>
            </ConfirmPopup.Content>

            <ConfirmPopup.Footer>
              <ConfirmPopup.Reject severity='contrast' variant='outlined'>
                {dictionary.common.cancel}
              </ConfirmPopup.Reject>

              <ConfirmPopup.Accept severity='danger' onClick={() => handleDeleteCompany()}>
                {dictionary.common.confirm}
                {isDeleting && <i className='pi pi-spin pi-spinner ml-2' />}
              </ConfirmPopup.Accept>
            </ConfirmPopup.Footer>
          </ConfirmPopup.Portal>
        </ConfirmPopup.Root>
      ) : (
        <Button severity='danger' variant='outlined' onClick={() => handleLeaveCompany()}>
          <i className='pi pi-power-off' />
          {dictionary.companies.actions.leaveCompany}
          {isLeaving && <i className='pi pi-spin pi-spinner ml-2' />}
        </Button>
      )}
    </div>
  );
}
