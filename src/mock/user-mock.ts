import { UserRole } from '@/utils/enums';

export const mockUser = {
  id: 'f77314d7-8429-49f8-a719-b0cdd54bade4',
  email: 'example@test.com',
  firstName: 'John',
  lastName: 'Doe',
  role: UserRole.USER,
  memberships: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
