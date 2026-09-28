import { Company } from '@/entities/company.entity';
import { CompanyUser } from '@/entities/company-user.entity';
import { ReturnUser } from '@/types/user/return-user';

export interface AuthState {
  user: ReturnUser | null;
  isAuthenticated: boolean;
}

export interface CompanyState {
  activeCompany: Company | null;
  activeRole: CompanyUser['role'] | null;
}
