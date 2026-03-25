import { CompanyRole, CompanyStatus } from '@/utils/enums';
import { mockUser } from './user-mock';

export const mockCompany = {
  id: '8624f649-8ab0-4627-b168-1f8f961d4e62',
  name: 'Hubabuba Corpdfhnsd dah aerh aetha',
  description: 'We make hubabuba',
  status: CompanyStatus.VISIBLE,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockCompanyUser = {
  role: CompanyRole.MEMBER,
  company: mockCompany,
  user: mockUser,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockCompanyOwner = {
  role: CompanyRole.OWNER,
  company: mockCompany,
  user: mockUser,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockCompanyMembers = [
  mockCompanyOwner,
  mockCompanyUser,
  mockCompanyUser,
  mockCompanyUser,
  mockCompanyUser,
  mockCompanyUser,
  mockCompanyUser,
  mockCompanyUser,
];

export const mockCompanyWithMembers = {
  id: '8624f649-8ab0-4627-b168-1f8f961d4e62',
  name: 'Hubabuba Corp WUYGQ;EKRJH/Lwkrgva;b iwe cg; RJIG',
  description: 'We make hubabuba',
  status: CompanyStatus.VISIBLE,
  members: [mockCompanyOwner, mockCompanyUser, mockCompanyUser],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const currentCompany = mockCompanyWithMembers;

export const mockCompanyList = [
  mockCompany,
  mockCompany,
  mockCompany,
  mockCompany,
  mockCompany,
  mockCompany,
  mockCompany,
  mockCompany,
];
