import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Company } from '@/entities/company.entity';
import { CompanyState } from '@/interfaces/common/slices-interface';
import { CompanyUser } from '@/entities/company-user.entity';

const initialState: CompanyState = {
  activeCompany: null,
  activeRole: null,
};

export const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setActiveCompany: (
      state,
      action: PayloadAction<{ company: Company; role: CompanyUser['role'] }>,
    ) => {
      state.activeCompany = action.payload.company;
      state.activeRole = action.payload.role;
    },
    clearActiveCompany: (state) => {
      state.activeCompany = null;
      state.activeRole = null;
    },
  },
});

export const { setActiveCompany, clearActiveCompany } = companySlice.actions;
export default companySlice.reducer;
