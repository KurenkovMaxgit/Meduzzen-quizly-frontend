'use client';

import { currentCompany, mockCompanyMembers, mockCompanyWithMembers } from '@/mock/company-mock';
import { Button } from '@primereact/ui/button';
import UniversalList from '../common/list';
import { CompanyMemberListItem } from './company-members-list-item';
import { mockUser } from '@/mock/user-mock';
import { CompanyRole } from '@/utils/enums';

export default function CompanyDetailsToolbar(params: { company: typeof mockCompanyWithMembers }) {
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
      className={`${currentCompany.members.find((member) => member.user.id === mockUser.id)?.role === CompanyRole.OWNER ? 'grid-cols-4' : 'grid-cols-3'} grid gap-2`}
    >
      <UniversalList
        items={mockCompanyMembers}
        itemTemplate={CompanyMemberListItem}
        dialogTitle="Members"
        isLoading={false}
        emptyMessage="No companies found."
        dialog
        buttonLabel="Members List"
        buttonIcon="pi pi-users"
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
        <i className="pi pi-clipboard" />
        Quizzes List
      </Button>
      {/* PLACEHOLDER */}

      {params.company.id === currentCompany.id ? (
        <Button severity="danger" variant="outlined" onClick={() => handleExitCompany()}>
          <i className="pi pi-sign-out" />
          Exit Company
        </Button>
      ) : (
        <Button severity="success" onClick={() => handleEnterCompany()}>
          <i className="pi pi-sign-in" />
          Enter Company
        </Button>
      )}
      {currentCompany.members.find((member) => member.user.id === mockUser.id)?.role ===
      CompanyRole.OWNER ? (
        <Button severity="danger" variant="outlined" pt-root-onClick={() => handleDeleteCompany()}>
          <i className="pi pi-trash" />
          Delete Company
        </Button>
      ) : null}
    </div>
  );
}
