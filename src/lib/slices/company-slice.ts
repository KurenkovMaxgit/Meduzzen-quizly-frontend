import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CompanyUser } from '@/lib/generatedApi';

interface CompanyState {
  activeCompanyId: string | null;
  activeRole: CompanyUser['role'] | null;
}

const initialState: CompanyState = {
  activeCompanyId: null,
  activeRole: null,
};

export const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setActiveCompany: (
      state,
      action: PayloadAction<{ companyId: string; role: CompanyUser['role'] }>,
    ) => {
      state.activeCompanyId = action.payload.companyId;
      state.activeRole = action.payload.role;
    },
    clearActiveCompany: (state) => {
      state.activeCompanyId = null;
      state.activeRole = null;
    },
  },
});

export const { setActiveCompany, clearActiveCompany } = companySlice.actions;
export default companySlice.reducer;
