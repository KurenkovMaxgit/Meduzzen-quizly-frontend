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
import { ACCESS_TOKEN_KEY, ACCESS_TOKEN_OPTIONS } from '@/utils/cookie-constants';
import { UpdateCompany } from '@/types/company/update-company';
import { CreateCompany } from '@/types/company/create-company';
import { CompanyUser } from '@/entities/company-user.entity';
import { FindCompanyMembers } from '@/types/company/find-company-members';
import { ActionDecision, CompanyRole } from '@/utils/enums';
import { FindUser } from '@/types/user/find-user';
import { CompanyAction } from '@/entities/action.entity';
import { FindAction } from '@/types/actions/find-action.dto';
import { PrivateReturnQuiz, PublicReturnQuiz } from '@/types/quiz/return-quiz';
import { CreateQuiz } from '@/types/quiz/create-quiz';
import { FindQuiz } from '@/types/quiz/find-quiz';
import { UpdateQuiz } from '@/types/quiz/update-quiz';
import { CreateAttempt, FindAttempt, ReturnAttempt } from '@/types/quiz/attempt';
import {
  Notification,
  NotificationCount,
  UpdateNotificationStatus,
} from '@/types/notification/notification';
import { NotificationStatus } from '@/utils/enums';

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
        if (Array.isArray(value)) {
          value.forEach((item) => {
            searchParams.append(key, String(item));
          });
        } else if (typeof value === 'object') {
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

export async function refreshAccessToken(): Promise<string | null> {
  if (auth0RefreshTokenFn) {
    const refreshedToken = await auth0RefreshTokenFn();
    Cookies.set(ACCESS_TOKEN_KEY, refreshedToken, {
      expires: 1,
      secure: true,
      sameSite: 'strict',
    });

    return refreshedToken;
  }

  const result = await baseQuery({ url: '/api/auth/refresh', method: 'POST' }, {} as never, {});
  if (result.error) throw new Error('Failed to refresh access token');
  const token =
    (result.data as { data?: { accessToken?: string }; accessToken?: string } | undefined)?.data
      ?.accessToken ?? (result.data as { accessToken?: string } | undefined)?.accessToken;
  if (token) Cookies.set(ACCESS_TOKEN_KEY, token, ACCESS_TOKEN_OPTIONS);

  return token ?? Cookies.get(ACCESS_TOKEN_KEY) ?? null;
}

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
            await refreshAccessToken();

            return true;
          } catch {
            Cookies.remove(ACCESS_TOKEN_KEY);

            return false;
          }
        } else {
          try {
            return Boolean(await refreshAccessToken());
          } catch {
            return false;
          }
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
  tagTypes: ['CompanyMembers', 'CompanyActions', 'Quizzes', 'Notifications', 'NotificationCount'],
  endpoints: (build) => ({
    appHealthCheck: build.query<unknown, void>({
      query: () => ({ url: `/api/health` }),
    }),
    userMe: build.query<ApiResponse<ReturnUser>, void>({
      query: () => ({ url: `/api/user/me` }),
    }),
    authSignup: build.mutation<ApiResponse<ReturnUser>, CreateUser>({
      query: (queryArg) => ({
        url: `/api/auth/signup`,
        method: 'POST',
        body: queryArg,
      }),
    }),
    authSignin: build.mutation<ApiResponse<ReturnUser>, SigninPayload>({
      query: (queryArg) => ({ url: `/api/auth/login`, method: 'POST', body: queryArg }),
    }),
    authLogout: build.mutation<unknown, void>({
      query: () => ({ url: `/api/auth/logout`, method: 'POST' }),
    }),
    userFindOneById: build.query<ApiResponse<ReturnUser>, FindOneQuery>({
      query: (queryArg) => ({
        url: `/api/user/${queryArg.id}`,
        params: {
          relations: queryArg.relations,
        },
      }),
    }),
    userFindAll: build.query<GetListResponse<ReturnUser>, FindAllQuery<FindUser>>({
      query: (queryArg) => ({
        url: `/api/user/list`,
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
    userUpdateOneById: build.mutation<ApiResponse<ReturnUser>, UpdateUser>({
      query: (queryArg) => ({
        url: `/api/user`,
        method: 'PATCH',
        body: queryArg,
      }),
    }),
    userDeleteOneById: build.mutation<ApiResponse<unknown>, void>({
      query: () => ({ url: `/api/user`, method: 'DELETE' }),
    }),
    companyCreate: build.mutation<ApiResponse<ReturnCompany>, CreateCompany>({
      query: (queryArg) => ({
        url: `/api/company`,
        method: 'POST',
        body: queryArg,
      }),
    }),
    companyFindOneById: build.query<ApiResponse<ReturnCompany>, FindOneQuery>({
      query: (queryArg) => ({
        url: `/api/company/${queryArg.id}`,
        params: {
          relations: queryArg.relations,
        },
      }),
    }),
    companyFindAll: build.query<GetListResponse<ReturnCompany>, FindAllQuery<FindCompany>>({
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
    companyFindAllMembers: build.query<
      GetListResponse<CompanyUser>,
      FindAllQuery<FindCompanyMembers>
    >({
      query: (queryArg) => ({
        url: `/api/company/${queryArg.where!.company!.id}/members/list`,
        params: {
          skip: queryArg.skip,
          take: queryArg.take,
          where: queryArg.where,
          search: queryArg.search,
          order: queryArg.order,
          relations: queryArg.relations,
        },
      }),
      providesTags: ['CompanyMembers'],
    }),
    companyUpdateOneById: build.mutation<ApiResponse<ReturnCompany>, UpdateCompany>({
      query: ({ id, ...body }) => ({
        url: `/api/company/${id}`,
        method: 'PATCH',
        body: body,
      }),
    }),
    companyDeleteOneById: build.mutation<ApiResponse<unknown>, string>({
      query: (id) => ({
        url: `/api/company/${id}`,
        method: 'DELETE',
      }),
    }),
    companyUpdateRoles: build.mutation<
      ApiResponse<unknown>,
      {
        companyId: string;
        userIds: string[];
        newRole: CompanyRole;
      }
    >({
      query: (queryArg) => ({
        url: `/api/company/${queryArg.companyId}/users/${queryArg.newRole}`,
        body: { userIds: queryArg.userIds },
        method: 'PATCH',
      }),
      invalidatesTags: ['CompanyMembers'],
    }),
    companyAddNewOwner: build.mutation<ApiResponse<unknown>, { companyId: string; userId: string }>(
      {
        query: (queryArg) => ({
          url: `/api/company/${queryArg.companyId}/add/owner/${queryArg.userId}`,
          method: 'PATCH',
        }),
        invalidatesTags: ['CompanyMembers'],
      },
    ),
    companyLeave: build.mutation<ApiResponse<unknown>, string>({
      query: (companyId) => ({
        url: `/api/company/leave/${companyId}`,
        method: 'DELETE',
      }),
    }),
    companyKickUsers: build.mutation<
      ApiResponse<unknown>,
      { companyId: string; userIds: string[] }
    >({
      query: (queryArg) => ({
        url: `/api/company/${queryArg.companyId}/users`,
        body: { userIds: queryArg.userIds },
        method: 'DELETE',
      }),
      invalidatesTags: ['CompanyMembers'],
    }),
    actionInviteUser: build.mutation<ApiResponse<unknown>, { subject: string; companyId: string }>({
      query: (queryArg) => ({
        url: `/api/action/invite/${queryArg.subject}/to/${queryArg.companyId}`,
        method: 'POST',
      }),
    }),
    actionCancelInvite: build.mutation<ApiResponse<unknown>, string>({
      query: (inviteId) => ({
        url: `/api/action/invite/${inviteId}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: ['CompanyActions'],
    }),
    actionManageInvite: build.mutation<
      ApiResponse<unknown>,
      { inviteId: string; action: ActionDecision }
    >({
      query: (queryArg) => ({
        url: `/api/action/invite/${queryArg.inviteId}/${queryArg.action}`,
        method: 'POST',
      }),
      invalidatesTags: ['CompanyActions'],
    }),
    actionRequestJoin: build.mutation<ApiResponse<unknown>, { companyId: string }>({
      query: (queryArg) => ({
        url: `/api/action/request/${queryArg.companyId}`,
        method: 'POST',
      }),
    }),
    actionCancelRequest: build.mutation<ApiResponse<unknown>, string>({
      query: (requestId) => ({
        url: `/api/action/request/${requestId}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: ['CompanyActions'],
    }),
    actionManageRequest: build.mutation<
      ApiResponse<unknown>,
      { requestId: string; action: ActionDecision }
    >({
      query: (queryArg) => ({
        url: `/api/action/request/${queryArg.requestId}/${queryArg.action}`,
        method: 'POST',
      }),
      invalidatesTags: ['CompanyActions'],
    }),
    actionGetUserActions: build.query<GetListResponse<CompanyAction>, FindAllQuery<FindAction>>({
      query: (queryArg) => ({
        url: `/api/action/list/${queryArg.where!.type}`,
        params: {
          skip: queryArg.skip,
          take: queryArg.take,
          where: queryArg.where,
          search: queryArg.search,
          order: queryArg.order,
          relations: queryArg.relations,
        },
      }),
      providesTags: ['CompanyActions'],
    }),
    actionGetCompanyActions: build.query<GetListResponse<CompanyAction>, FindAllQuery<FindAction>>({
      query: (queryArg) => ({
        url: `/api/action/list/${queryArg.where!.company!.id}/${queryArg.where!.type}`,
        params: {
          skip: queryArg.skip,
          take: queryArg.take,
          where: queryArg.where,
          search: queryArg.search,
          order: queryArg.order,
          relations: queryArg.relations,
        },
      }),
      providesTags: ['CompanyActions'],
    }),
    quizCreate: build.mutation<ApiResponse<PrivateReturnQuiz>, { companyId: string } & CreateQuiz>({
      query: ({ companyId, ...body }) => ({
        url: `/api/quiz/company/${companyId}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { companyId }) => [{ type: 'Quizzes', id: companyId }],
    }),
    quizFindAll: build.query<GetListResponse<PublicReturnQuiz>, FindAllQuery<FindQuiz>>({
      query: (queryArg) => ({
        url: `/api/quiz/company/${queryArg.where!.company!.id}/list`,
        params: {
          skip: queryArg.skip,
          take: queryArg.take,
          where: queryArg.where,
          search: queryArg.search,
          order: queryArg.order,
          relations: queryArg.relations,
        },
      }),
      providesTags: (_result, _error, queryArg) =>
        queryArg.where?.company?.id
          ? [{ type: 'Quizzes', id: queryArg.where.company.id }]
          : ['Quizzes'],
    }),
    quizFindOnePrivateById: build.query<
      ApiResponse<PrivateReturnQuiz>,
      { companyId: string } & FindOneQuery
    >({
      query: (queryArg) => ({
        url: `/api/quiz/${queryArg.id}/company/${queryArg.companyId}/private`,
        params: {
          relations: queryArg.relations,
        },
      }),
      providesTags: (_result, _error, { companyId }) => [{ type: 'Quizzes', id: companyId }],
    }),
    quizFindOnePublicById: build.query<
      ApiResponse<PublicReturnQuiz>,
      { companyId: string } & FindOneQuery
    >({
      query: (queryArg) => ({
        url: `/api/quiz/${queryArg.id}/company/${queryArg.companyId}/public`,
        params: {
          relations: queryArg.relations,
        },
      }),
      providesTags: (_result, _error, { companyId }) => [{ type: 'Quizzes', id: companyId }],
    }),
    quizUpdateOneById: build.mutation<
      ApiResponse<PrivateReturnQuiz>,
      { companyId: string } & UpdateQuiz
    >({
      query: ({ id, companyId, ...body }) => ({
        url: `/api/quiz/${id}/company/${companyId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { companyId }) => [{ type: 'Quizzes', id: companyId }],
    }),
    quizDeleteOneById: build.mutation<ApiResponse<unknown>, { id: string; companyId: string }>({
      query: (queryArg) => ({
        url: `/api/quiz/${queryArg.id}/company/${queryArg.companyId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { companyId }) => [{ type: 'Quizzes', id: companyId }],
    }),
    attemptSubmit: build.mutation<
      ReturnAttempt,
      { companyId: string; quizId: string } & CreateAttempt
    >({
      query: ({ companyId, quizId, ...body }) => ({
        url: `/api/attempt/company/${companyId}/quiz/${quizId}`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiResponse<ReturnAttempt> | ReturnAttempt) =>
        'data' in response && response.data ? response.data : (response as ReturnAttempt),
    }),
    attemptFindAll: build.query<
      GetListResponse<ReturnAttempt>,
      { companyId: string } & FindAllQuery<FindAttempt>
    >({
      query: (queryArg) => ({
        url: `/api/attempt/company/${queryArg.companyId}/list`,
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
    attemptFindAllForCompany: build.query<GetListResponse<ReturnAttempt>, string>({
      async queryFn(companyId, _api, _extraOptions, baseQuery) {
        const items: ReturnAttempt[] = [];
        let skip = 0;
        let response: GetListResponse<ReturnAttempt> | undefined;
        do {
          const result = await baseQuery({
            url: `/api/attempt/company/${companyId}/list`,
            params: { skip, take: 100, relations: ['user', 'quiz'], order: { createdAt: 'DESC' } },
          });
          if (result.error) return { error: result.error };
          response = result.data as GetListResponse<ReturnAttempt>;
          if (!response.data) return { data: response };
          items.push(...response.data.items);
          skip += response.data.items.length;
        } while (items.length < response.data!.totalCount && response.data!.items.length > 0);

        return {
          data: {
            ...response!,
            data: { items, totalCount: response!.data?.totalCount ?? items.length },
          },
        };
      },
    }),
    notificationFindAll: build.query<
      GetListResponse<Notification>,
      FindAllQuery<Record<string, unknown>>
    >({
      query: (queryArg) => ({
        url: '/api/notification/list',
        params: {
          skip: queryArg.skip,
          take: queryArg.take,
          where: queryArg.where,
          search: queryArg.search,
          order: queryArg.order,
          relations: queryArg.relations,
        },
      }),
      providesTags: ['Notifications'],
    }),
    notificationGetCount: build.query<ApiResponse<NotificationCount>, NotificationStatus | void>({
      query: (status) => ({
        url: '/api/notification/count',
        params: status ? { status } : {},
      }),
      providesTags: ['NotificationCount'],
    }),
    notificationUpdateStatus: build.mutation<
      ApiResponse<{ updatedCount: number }>,
      UpdateNotificationStatus
    >({
      query: ({ status, notificationIds }) => ({
        url: `/api/notification/status/${status}`,
        method: 'PATCH',
        body: { notificationIds },
      }),
      invalidatesTags: ['Notifications', 'NotificationCount'],
    }),
  }),
  refetchOnReconnect: true,
});

export const {
  useAppHealthCheckQuery,
  useUserMeQuery,
  useUserFindOneByIdQuery,
  useUserFindAllQuery,
  useUserUpdateOneByIdMutation,
  useUserDeleteOneByIdMutation,
  useAuthSignupMutation,
  useAuthSigninMutation,
  useAuthLogoutMutation,
  useCompanyCreateMutation,
  useCompanyFindAllQuery,
  useCompanyFindAllMembersQuery,
  useCompanyFindOneByIdQuery,
  useCompanyUpdateOneByIdMutation,
  useCompanyDeleteOneByIdMutation,
  useCompanyUpdateRolesMutation,
  useCompanyAddNewOwnerMutation,
  useCompanyLeaveMutation,
  useCompanyKickUsersMutation,
  useActionInviteUserMutation,
  useActionCancelInviteMutation,
  useActionManageInviteMutation,
  useActionRequestJoinMutation,
  useActionCancelRequestMutation,
  useActionManageRequestMutation,
  useActionGetUserActionsQuery,
  useActionGetCompanyActionsQuery,
  useQuizCreateMutation,
  useQuizFindAllQuery,
  useQuizFindOnePrivateByIdQuery,
  useQuizFindOnePublicByIdQuery,
  useQuizUpdateOneByIdMutation,
  useQuizDeleteOneByIdMutation,
  useAttemptSubmitMutation,
  useAttemptFindAllQuery,
  useAttemptFindAllForCompanyQuery,
  useNotificationFindAllQuery,
  useNotificationGetCountQuery,
  useNotificationUpdateStatusMutation,
  // useQuizImportQuizzesMutation,
  // useAttemptSubmitAttemptMutation,
  // useAttemptFindAllQuery,
  // useAttemptGetSingleAttemptQuery,
  // useAttemptExportAttemptsCsvQuery,
  // useAnalyticsGetPersonalRatingQuery,
  // useAnalyticsGetPersonalAverageScoreQuery,
  // useAnalyticsGetPersonalScoresDynamicsQuery,
  // useAnalyticsGetPersonalLastCompletionsQuery,
  // useAnalyticsGetCompanyScoresDynamicsQuery,
  // useAnalyticsGetCompanyUserScoresDynamicsQuery,
  // useAnalyticsGetCompanyUsersLastCompletionsQuery,
} = quizlyApi;
