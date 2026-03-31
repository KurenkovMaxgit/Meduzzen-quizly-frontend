import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  AppControllerHealthCheckApiResponse,
  AppControllerHealthCheckApiArg,
} from './generatedApi';
import { FindCompany } from '@/types/company/find-company';
import { FindAllQuery, FindOneQuery } from '@/types/common/find-queries';
import { ApiResponse, GetListResponse } from '@/interfaces/common/api-response-interface';
import { ReturnCompany } from '@/types/company/return-company';
import { ReturnUser } from '@/types/user/return-user';

export const quizlyApi = createApi({
  reducerPath: 'quizlyApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
    credentials: 'include',
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
  }),
  endpoints: (build) => ({
    appControllerHealthCheck: build.query<
      AppControllerHealthCheckApiResponse,
      AppControllerHealthCheckApiArg
    >({
      query: () => ({ url: `/api/health` }),
    }),
    userControllerMe: build.query<ApiResponse<ReturnUser>, void>({
      query: () => ({ url: `/api/user/me` }),
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
  // useUserControllerFindOneByIdQuery,
  // useUserControllerUpdateOneByIdMutation,
  // useUserControllerDeleteOneByIdMutation,
  // useAuthControllerSignupMutation,
  // useAuthControllerLoginMutation,
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
