'use client';

import { currentCompany, mockCompanyMembers } from '@/mock/company-mock';
import { Button } from '@primereact/ui/button';
import { UniversalList } from '../common/list';
import { CompanyMemberListItem } from './company-members-list-item';
import { mockUser } from '@/mock/user-mock';
import { CompanyRole } from '@/utils/enums';
import { useMessages } from 'next-intl';
import { ReturnCompany } from '@/types/company/return-company';
import { cn } from '@/utils/cn';

export function CompanyDetailsToolbar(params: { company: ReturnCompany }) {
  const dictionary = useMessages();

  const handleExitCompany = async () => {
    //TODO: Add handling
  };

  const handleEnterCompany = async () => {
    //TODO: Add handling
  };

  const handleDeleteCompany = async () => {
    //TODO: Add handling
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
        items={mockCompanyMembers}
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

      {params.company.id === currentCompany.id ? (
        <Button severity='danger' variant='outlined' onClick={() => handleExitCompany()}>
          <i className='pi pi-sign-out' />
          {dictionary.companies.actions.exitCompany}
        </Button>
      ) : (
        <Button severity='success' variant='outlined' onClick={() => enterCompany(company)}>
          <i className='pi pi-sign-in' />
          {dictionary.companies.actions.enterCompany}
        </Button>
      )}
      {currentCompany.members.find((member) => member.user.id === mockUser.id)?.role ===
        CompanyRole.OWNER && (
        <Button severity='danger' variant='outlined' pt-root-onClick={() => handleDeleteCompany()}>
          <i className='pi pi-trash' />
          {dictionary.companies.actions.deleteCompany}
        </Button>
      )}
    </div>
  );
}
