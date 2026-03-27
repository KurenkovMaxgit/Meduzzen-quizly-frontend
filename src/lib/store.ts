import { configureStore } from '@reduxjs/toolkit';
import { quizlyApi } from '@/lib/quizlyApi';
import { authSlice } from './slices/auth-slice';
import { companySlice } from './slices/company-slice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      [quizlyApi.reducerPath]: quizlyApi.reducer,
      [authSlice.reducerPath]: authSlice.reducer,
      [companySlice.reducerPath]: companySlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(quizlyApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
