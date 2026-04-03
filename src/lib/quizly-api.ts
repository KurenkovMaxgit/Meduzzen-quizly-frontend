import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { FindCompany } from '@/types/company/find-company';
import { FindAllQuery, FindOneQuery } from '@/types/common/find-queries';
import { ApiResponse, GetListResponse } from '@/interfaces/common/api-response-interface';
import { ReturnCompany } from '@/types/company/return-company';
import { ReturnUser } from '@/types/user/return-user';
import { API_BASE_URL } from '@/utils/api-constants';
import { UpdateUser } from '@/types/user/update-user';
import { CreateUser } from '@/types/user/create-user';
import { SigninPayload } from '@/types/auth/signin-payload';
import Cookies from 'js-cookie';
import { ACCESS_TOKEN_KEY } from '@/utils/cookie-constants';

export let auth0RefreshTokenFn: (() => Promise<string>) | null = null;

export const setAuth0RefreshFn = (fn: (() => Promise<string>) | null) => {
  auth0RefreshTokenFn = fn;
};

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = Cookies.get(ACCESS_TOKEN_KEY);
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    return headers;
  },
  paramsSerializer: (params) => {
    const searchParams = new URLSearchParams();

    for (const key in params) {
      const value = params[key as keyof typeof params];

      if (value !== undefined && value !== null) {
        if (typeof value === 'object') {
          searchParams.append(key, JSON.stringify(value));
        } else {
          searchParams.append(key, String(value));
        }
      }
    }

    return searchParams.toString();
  },
});

let refreshPromise: Promise<boolean> | null = null;

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  if (refreshPromise) {
    await refreshPromise;
  }

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!refreshPromise) {
      refreshPromise = (async () => {
        if (auth0RefreshTokenFn) {
          try {
            const refreshedToken = await auth0RefreshTokenFn();
            Cookies.set(ACCESS_TOKEN_KEY, refreshedToken, {
              expires: 1,
              secure: true,
              sameSite: 'strict',
            });

            return true;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) {
            Cookies.remove(ACCESS_TOKEN_KEY);

            return false;
          }
        } else {
          await baseQuery({ url: '/api/auth/refresh', method: 'POST' }, api, extraOptions);

          return true;
        }
      })();

      const success = await refreshPromise;

      refreshPromise = null;

      if (success) {
        result = await baseQuery(args, api, extraOptions);
      }
    } else {
      const success = await refreshPromise;
      if (success) {
        result = await baseQuery(args, api, extraOptions);
      }
    }
  }

  return result;
};

export const quizlyApi = createApi({
  reducerPath: 'quizlyApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (build) => ({
    appControllerHealthCheck: build.query<unknown, void>({
      query: () => ({ url: `/api/health` }),
    }),
    userControllerMe: build.query<ApiResponse<ReturnUser>, void>({
      query: () => ({ url: `/api/user/me` }),
    }),
    authControllerSignup: build.mutation<ApiResponse<ReturnUser>, CreateUser>({
      query: (queryArg) => ({
        url: `/api/auth/signup`,
        method: 'POST',
        body: queryArg,
      }),
    }),
    authControllerSignin: build.mutation<ApiResponse<ReturnUser>, SigninPayload>({
      query: (queryArg) => ({ url: `/api/auth/login`, method: 'POST', body: queryArg }),
    }),
    userControllerFindOneById: build.query<ApiResponse<ReturnUser>, FindOneQuery>({
      query: (queryArg) => ({
        url: `/api/user/${queryArg.id}`,
        params: {
          relations: queryArg.relations,
        },
      }),
    }),
    userControllerUpdateOneById: build.mutation<ApiResponse<ReturnUser>, UpdateUser>({
      query: (queryArg) => ({
        url: `/api/user`,
        method: 'PATCH',
        body: queryArg,
      }),
    }),
    companyControllerFindOneById: build.query<ApiResponse<ReturnCompany>, FindOneQuery>({
      query: (queryArg) => ({
        url: `/api/company/${queryArg.id}`,
        params: {
          relations: queryArg.relations,
        },
      }),
    }),
    companyControllerFindAll: build.query<
      GetListResponse<ReturnCompany>,
      FindAllQuery<FindCompany>
    >({
      query: (queryArg) => ({
        url: `/api/company/list`,
        params: {
          skip: queryArg.skip,
          take: queryArg.take,
          where: queryArg.where,
          search: queryArg.search,
          order: queryArg.order,
          relations: queryArg.relations,
        },
      }),
    }),
  }),
});

export const {
  useAppControllerHealthCheckQuery,
  useUserControllerMeQuery,
  // useUserControllerFindProfileQuery,
  // useUserControllerFindAllQuery,
  useUserControllerFindOneByIdQuery,
  useUserControllerUpdateOneByIdMutation,
  // useUserControllerDeleteOneByIdMutation,
  useAuthControllerSignupMutation,
  useAuthControllerSigninMutation,
  // useAuthControllerRefreshMutation,
  // useAuthControllerLogoutMutation,
  // useCompanyControllerCreateMutation,
  useCompanyControllerFindAllQuery,
  useCompanyControllerFindOneByIdQuery,
  // useCompanyControllerUpdateOneByIdMutation,
  // useCompanyControllerDeleteOneByIdMutation,
  // useCompanyControllerUpdateRolesMutation,
  // useCompanyControllerAddNewOwnerMutation,
  // useCompanyControllerLeaveCompanyMutation,
  // useCompanyControllerKickUsersMutation,
  // useActionControllerInviteUserMutation,
  // useActionControllerCancelInviteMutation,
  // useActionControllerManageInviteMutation,
  // useActionControllerRequestJoinMutation,
  // useActionControllerCancelRequestMutation,
  // useActionControllerAcceptRequestMutation,
  // useActionControllerGetUserActionsQuery,
  // useActionControllerGetCompanyActionsQuery,
  // useQuizControllerCreateMutation,
  // useQuizControllerFindAllQuery,
  // useQuizControllerFindOnePrivateByIdQuery,
  // useQuizControllerFindOnePublicByIdQuery,
  // useQuizControllerUpdateOneByIdMutation,
  // useQuizControllerDeleteOneByIdMutation,
  // useQuizControllerImportQuizzesMutation,
  // useAttemptControllerSubmitAttemptMutation,
  // useAttemptControllerFindAllQuery,
  // useAttemptControllerGetSingleAttemptQuery,
  // useAttemptControllerExportAttemptsCsvQuery,
  // useAnalyticsControllerGetPersonalRatingQuery,
  // useAnalyticsControllerGetPersonalAverageScoreQuery,
  // useAnalyticsControllerGetPersonalScoresDynamicsQuery,
  // useAnalyticsControllerGetPersonalLastCompletionsQuery,
  // useAnalyticsControllerGetCompanyScoresDynamicsQuery,
  // useAnalyticsControllerGetCompanyUserScoresDynamicsQuery,
  // useAnalyticsControllerGetCompanyUsersLastCompletionsQuery,
  // useNotificationControllerFindAllQuery,
  // useNotificationControllerGetCountQuery,
  // useNotificationControllerUpdateStatusMutation,
} = quizlyApi;
