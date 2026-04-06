import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from '@/interfaces/common/slices-interface';
import { ReturnUser } from '@/types/user/return-user';
import { UserRole } from '@/utils/enums';

const initialState: AuthState = {
  user: {
    id: 'c5507034-2a91-44de-9da8-34c7d1a19eec',
    firstName: 'Quizzes',
    lastName: 'Enjoyer',
    email: 'kurenkov.maxim3000@gmail.com',
    role: UserRole.USER,
    createdAt: '2026-03-31T08:31:06.509Z',
    updatedAt: '2026-03-31T08:31:06.509Z',
  },
  isAuthenticated: true,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: ReturnUser }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
