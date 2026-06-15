/* eslint-disable padding-line-between-statements */
import { GetListResponse } from '@/interfaces/common/api-response-interface';
import { quizlyApi as api } from './api-endpoints';
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    userControllerFindProfile: build.query<
      UserControllerFindProfileApiResponse,
      UserControllerFindProfileApiArg
    >({
      query: () => ({ url: `/api/user/me` }),
    }),
    userControllerFindAll: build.query<
      UserControllerFindAllApiResponse,
      UserControllerFindAllApiArg
    >({
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
    userControllerFindOneById: build.query<
      UserControllerFindOneByIdApiResponse,
      UserControllerFindOneByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/api/user/${queryArg.id}`,
        params: {
          relations: queryArg.relations,
        },
      }),
    }),
    userControllerUpdateOneById: build.mutation<
      UserControllerUpdateOneByIdApiResponse,
      UserControllerUpdateOneByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/api/user`,
        method: 'PATCH',
        body: queryArg.updateUserDto,
      }),
    }),
    userControllerDeleteOneById: build.mutation<
      UserControllerDeleteOneByIdApiResponse,
      UserControllerDeleteOneByIdApiArg
    >({
      query: () => ({ url: `/api/user`, method: 'DELETE' }),
    }),
    authControllerSignup: build.mutation<
      AuthControllerSignupApiResponse,
      AuthControllerSignupApiArg
    >({
      query: (queryArg) => ({
        url: `/api/auth/signup`,
        method: 'POST',
        body: queryArg.createUserDto,
      }),
    }),
    authControllerLogin: build.mutation<AuthControllerLoginApiResponse, AuthControllerLoginApiArg>({
      query: () => ({ url: `/api/auth/login`, method: 'POST' }),
    }),
    authControllerRefresh: build.mutation<
      AuthControllerRefreshApiResponse,
      AuthControllerRefreshApiArg
    >({
      query: () => ({ url: `/api/auth/refresh`, method: 'POST' }),
    }),
    authControllerLogout: build.mutation<
      AuthControllerLogoutApiResponse,
      AuthControllerLogoutApiArg
    >({
      query: () => ({ url: `/api/auth/logout`, method: 'POST' }),
    }),
    companyControllerCreate: build.mutation<
      CompanyControllerCreateApiResponse,
      CompanyControllerCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/company`,
        method: 'POST',
        body: queryArg.createCompanyDto,
      }),
    }),

    companyControllerUpdateOneById: build.mutation<
      CompanyControllerUpdateOneByIdApiResponse,
      CompanyControllerUpdateOneByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/api/company/${queryArg.companyId}`,
        method: 'PATCH',
        body: queryArg.updateCompanyDto,
      }),
    }),
    companyControllerDeleteOneById: build.mutation<
      CompanyControllerDeleteOneByIdApiResponse,
      CompanyControllerDeleteOneByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/api/company/${queryArg.companyId}`,
        method: 'DELETE',
      }),
    }),
    companyControllerUpdateRoles: build.mutation<
      CompanyControllerUpdateRolesApiResponse,
      CompanyControllerUpdateRolesApiArg
    >({
      query: (queryArg) => ({
        url: `/api/company/${queryArg.companyId}/users/${queryArg.newRole}`,
        method: 'PATCH',
      }),
    }),
    companyControllerAddNewOwner: build.mutation<
      CompanyControllerAddNewOwnerApiResponse,
      CompanyControllerAddNewOwnerApiArg
    >({
      query: (queryArg) => ({
        url: `/api/company/${queryArg.companyId}/add/owner/${queryArg.userId}`,
        method: 'PATCH',
      }),
    }),
    companyControllerLeaveCompany: build.mutation<
      CompanyControllerLeaveCompanyApiResponse,
      CompanyControllerLeaveCompanyApiArg
    >({
      query: (queryArg) => ({
        url: `/api/company/leave/${queryArg.companyId}`,
        method: 'DELETE',
      }),
    }),
    companyControllerKickUsers: build.mutation<
      CompanyControllerKickUsersApiResponse,
      CompanyControllerKickUsersApiArg
    >({
      query: (queryArg) => ({
        url: `/api/company/${queryArg.companyId}/users`,
        method: 'DELETE',
      }),
    }),
    actionControllerInviteUser: build.mutation<
      ActionControllerInviteUserApiResponse,
      ActionControllerInviteUserApiArg
    >({
      query: (queryArg) => ({
        url: `/api/action/invite/${queryArg.subject}/to/${queryArg.companyId}`,
        method: 'POST',
      }),
    }),
    actionControllerCancelInvite: build.mutation<
      ActionControllerCancelInviteApiResponse,
      ActionControllerCancelInviteApiArg
    >({
      query: (queryArg) => ({
        url: `/api/action/invite/${queryArg.id}/cancel`,
        method: 'POST',
      }),
    }),
    actionControllerManageInvite: build.mutation<
      ActionControllerManageInviteApiResponse,
      ActionControllerManageInviteApiArg
    >({
      query: (queryArg) => ({
        url: `/api/action/invite/${queryArg.id}/${queryArg.action}`,
        method: 'POST',
      }),
    }),
    actionControllerRequestJoin: build.mutation<
      ActionControllerRequestJoinApiResponse,
      ActionControllerRequestJoinApiArg
    >({
      query: (queryArg) => ({
        url: `/api/action/request/${queryArg.companyId}`,
        method: 'POST',
      }),
    }),
    actionControllerCancelRequest: build.mutation<
      ActionControllerCancelRequestApiResponse,
      ActionControllerCancelRequestApiArg
    >({
      query: (queryArg) => ({
        url: `/api/action/request/${queryArg.id}/cancel`,
        method: 'POST',
      }),
    }),
    actionControllerAcceptRequest: build.mutation<
      ActionControllerAcceptRequestApiResponse,
      ActionControllerAcceptRequestApiArg
    >({
      query: (queryArg) => ({
        url: `/api/action/request/${queryArg.id}/${queryArg.action}`,
        method: 'POST',
      }),
    }),
    actionControllerGetUserActions: build.query<
      ActionControllerGetUserActionsApiResponse,
      ActionControllerGetUserActionsApiArg
    >({
      query: (queryArg) => ({
        url: `/api/action/list/${queryArg.actionType}`,
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
    actionControllerGetCompanyActions: build.query<
      ActionControllerGetCompanyActionsApiResponse,
      ActionControllerGetCompanyActionsApiArg
    >({
      query: (queryArg) => ({
        url: `/api/action/list/${queryArg.companyId}/${queryArg.actionType}`,
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
    quizControllerCreate: build.mutation<
      QuizControllerCreateApiResponse,
      QuizControllerCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/quiz/company/${queryArg.companyId}`,
        method: 'POST',
        body: queryArg.createQuizDto,
      }),
    }),
    quizControllerFindAll: build.query<
      QuizControllerFindAllApiResponse,
      QuizControllerFindAllApiArg
    >({
      query: (queryArg) => ({
        url: `/api/quiz/company/${queryArg.companyId}/list`,
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
    quizControllerFindOnePrivateById: build.query<
      QuizControllerFindOnePrivateByIdApiResponse,
      QuizControllerFindOnePrivateByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/api/quiz/${queryArg.id}/company/${queryArg.companyId}/private`,
        params: {
          relations: queryArg.relations,
        },
      }),
    }),
    quizControllerFindOnePublicById: build.query<
      QuizControllerFindOnePublicByIdApiResponse,
      QuizControllerFindOnePublicByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/api/quiz/${queryArg.id}/company/${queryArg.companyId}/public`,
        params: {
          relations: queryArg.relations,
        },
      }),
    }),
    quizControllerUpdateOneById: build.mutation<
      QuizControllerUpdateOneByIdApiResponse,
      QuizControllerUpdateOneByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/api/quiz/${queryArg.id}/company/${queryArg.companyId}`,
        method: 'PUT',
        body: queryArg.updateQuizDto,
      }),
    }),
    quizControllerDeleteOneById: build.mutation<
      QuizControllerDeleteOneByIdApiResponse,
      QuizControllerDeleteOneByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/api/quiz/${queryArg.id}/company/${queryArg.companyId}`,
        method: 'DELETE',
      }),
    }),
    quizControllerImportQuizzes: build.mutation<
      QuizControllerImportQuizzesApiResponse,
      QuizControllerImportQuizzesApiArg
    >({
      query: (queryArg) => ({
        url: `/api/quiz/company/${queryArg.companyId}/import`,
        method: 'POST',
      }),
    }),
    attemptControllerSubmitAttempt: build.mutation<
      AttemptControllerSubmitAttemptApiResponse,
      AttemptControllerSubmitAttemptApiArg
    >({
      query: (queryArg) => ({
        url: `/api/attempt/company/${queryArg.companyId}/quiz/${queryArg.quizId}`,
        method: 'POST',
        body: queryArg.createAttemptDto,
      }),
    }),
    attemptControllerFindAll: build.query<
      AttemptControllerFindAllApiResponse,
      AttemptControllerFindAllApiArg
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
    attemptControllerGetSingleAttempt: build.query<
      AttemptControllerGetSingleAttemptApiResponse,
      AttemptControllerGetSingleAttemptApiArg
    >({
      query: (queryArg) => ({
        url: `/api/attempt/${queryArg.attemptId}/company/${queryArg.companyId}`,
      }),
    }),
    attemptControllerExportAttemptsCsv: build.query<
      AttemptControllerExportAttemptsCsvApiResponse,
      AttemptControllerExportAttemptsCsvApiArg
    >({
      query: (queryArg) => ({
        url: `/api/attempt/company/${queryArg.companyId}/quiz/${queryArg.quizId}/export`,
      }),
    }),
    analyticsControllerGetPersonalRating: build.query<
      AnalyticsControllerGetPersonalRatingApiResponse,
      AnalyticsControllerGetPersonalRatingApiArg
    >({
      query: () => ({ url: `/api/analytics/personal/rating` }),
    }),
    analyticsControllerGetPersonalAverageScore: build.query<
      AnalyticsControllerGetPersonalAverageScoreApiResponse,
      AnalyticsControllerGetPersonalAverageScoreApiArg
    >({
      query: () => ({ url: `/api/analytics/personal/average-score` }),
    }),
    analyticsControllerGetPersonalScoresDynamics: build.query<
      AnalyticsControllerGetPersonalScoresDynamicsApiResponse,
      AnalyticsControllerGetPersonalScoresDynamicsApiArg
    >({
      query: () => ({ url: `/api/analytics/personal/scores-dynamics` }),
    }),
    analyticsControllerGetPersonalLastCompletions: build.query<
      AnalyticsControllerGetPersonalLastCompletionsApiResponse,
      AnalyticsControllerGetPersonalLastCompletionsApiArg
    >({
      query: () => ({ url: `/api/analytics/personal/last-completions` }),
    }),
    analyticsControllerGetCompanyScoresDynamics: build.query<
      AnalyticsControllerGetCompanyScoresDynamicsApiResponse,
      AnalyticsControllerGetCompanyScoresDynamicsApiArg
    >({
      query: (queryArg) => ({
        url: `/api/analytics/company/${queryArg.companyId}/scores-dynamics`,
      }),
    }),
    analyticsControllerGetCompanyUserScoresDynamics: build.query<
      AnalyticsControllerGetCompanyUserScoresDynamicsApiResponse,
      AnalyticsControllerGetCompanyUserScoresDynamicsApiArg
    >({
      query: (queryArg) => ({
        url: `/api/analytics/company/${queryArg.companyId}/user/${queryArg.userId}/scores-dynamics`,
      }),
    }),
    analyticsControllerGetCompanyUsersLastCompletions: build.query<
      AnalyticsControllerGetCompanyUsersLastCompletionsApiResponse,
      AnalyticsControllerGetCompanyUsersLastCompletionsApiArg
    >({
      query: (queryArg) => ({
        url: `/api/analytics/company/${queryArg.companyId}/users-last-completions`,
      }),
    }),
    notificationControllerFindAll: build.query<
      NotificationControllerFindAllApiResponse,
      NotificationControllerFindAllApiArg
    >({
      query: (queryArg) => ({
        url: `/api/notification/list`,
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
    notificationControllerGetCount: build.query<
      NotificationControllerGetCountApiResponse,
      NotificationControllerGetCountApiArg
    >({
      query: (queryArg) => ({
        url: `/api/notification/count`,
        params: {
          status: queryArg.status,
        },
      }),
    }),
    notificationControllerUpdateStatus: build.mutation<
      NotificationControllerUpdateStatusApiResponse,
      NotificationControllerUpdateStatusApiArg
    >({
      query: (queryArg) => ({
        url: `/api/notification/status/${queryArg.status}`,
        method: 'PATCH',
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as quizlyApi };
export type AppControllerHealthCheckApiResponse = unknown;
export type AppControllerHealthCheckApiArg = void;
export type UserControllerFindProfileApiResponse = /** status 200  */ ReturnUserDto;
export type UserControllerFindProfileApiArg = void;
export type UserControllerFindAllApiResponse = unknown;
export type UserControllerFindAllApiArg = {
  skip?: number;
  take?: number;
  where?: object;
  search?: string;
  order?: object;
  relations?: string[];
};
export type UserControllerFindOneByIdApiResponse = unknown;
export type UserControllerFindOneByIdApiArg = {
  id: string;
  relations?: string[];
};
export type UserControllerUpdateOneByIdApiResponse = unknown;
export type UserControllerUpdateOneByIdApiArg = {
  updateUserDto: UpdateUserDto;
};
export type UserControllerDeleteOneByIdApiResponse = unknown;
export type UserControllerDeleteOneByIdApiArg = void;
export type AuthControllerSignupApiResponse = unknown;
export type AuthControllerSignupApiArg = {
  createUserDto: CreateUserDto;
};
export type AuthControllerLoginApiResponse = unknown;
export type AuthControllerLoginApiArg = void;
export type AuthControllerRefreshApiResponse = /** status 201  */ string;
export type AuthControllerRefreshApiArg = void;
export type AuthControllerLogoutApiResponse = unknown;
export type AuthControllerLogoutApiArg = void;
export type CompanyControllerCreateApiResponse = unknown;
export type CompanyControllerCreateApiArg = {
  createCompanyDto: CreateCompanyDto;
};
export type CompanyControllerFindAllApiResponse = GetListResponse<Company>;
export type CompanyControllerFindAllApiArg = {
  skip?: number;
  take?: number;
  where?: object;
  search?: string;
  order?: object;
  relations?: string[];
};
export type CompanyControllerFindOneByIdApiResponse = unknown;
export type CompanyControllerFindOneByIdApiArg = {
  companyId: string;
  relations?: string[];
};
export type CompanyControllerUpdateOneByIdApiResponse = unknown;
export type CompanyControllerUpdateOneByIdApiArg = {
  companyId: string;
  updateCompanyDto: UpdateCompanyDto;
};
export type CompanyControllerDeleteOneByIdApiResponse = unknown;
export type CompanyControllerDeleteOneByIdApiArg = {
  companyId: string;
};
export type CompanyControllerUpdateRolesApiResponse = unknown;
export type CompanyControllerUpdateRolesApiArg = {
  companyId: string;
  newRole: string;
};
export type CompanyControllerAddNewOwnerApiResponse = unknown;
export type CompanyControllerAddNewOwnerApiArg = {
  companyId: string;
  userId: string;
};
export type CompanyControllerLeaveCompanyApiResponse = unknown;
export type CompanyControllerLeaveCompanyApiArg = {
  companyId: string;
};
export type CompanyControllerKickUsersApiResponse = unknown;
export type CompanyControllerKickUsersApiArg = {
  companyId: string;
};
export type ActionControllerInviteUserApiResponse = unknown;
export type ActionControllerInviteUserApiArg = {
  companyId: string;
  subject: string;
};
export type ActionControllerCancelInviteApiResponse = unknown;
export type ActionControllerCancelInviteApiArg = {
  id: string;
};
export type ActionControllerManageInviteApiResponse = unknown;
export type ActionControllerManageInviteApiArg = {
  id: string;
  action: string;
};
export type ActionControllerRequestJoinApiResponse = unknown;
export type ActionControllerRequestJoinApiArg = {
  companyId: string;
};
export type ActionControllerCancelRequestApiResponse = unknown;
export type ActionControllerCancelRequestApiArg = {
  id: string;
};
export type ActionControllerAcceptRequestApiResponse = unknown;
export type ActionControllerAcceptRequestApiArg = {
  id: string;
  action: string;
};
export type ActionControllerGetUserActionsApiResponse = unknown;
export type ActionControllerGetUserActionsApiArg = {
  actionType: string;
  skip?: number;
  take?: number;
  where?: object;
  search?: string;
  order?: object;
  relations?: string[];
};
export type ActionControllerGetCompanyActionsApiResponse = unknown;
export type ActionControllerGetCompanyActionsApiArg = {
  companyId: string;
  actionType: string;
  skip?: number;
  take?: number;
  where?: object;
  search?: string;
  order?: object;
  relations?: string[];
};
export type QuizControllerCreateApiResponse = unknown;
export type QuizControllerCreateApiArg = {
  companyId: string;
  createQuizDto: CreateQuizDto;
};
export type QuizControllerFindAllApiResponse = unknown;
export type QuizControllerFindAllApiArg = {
  companyId: string;
  skip?: number;
  take?: number;
  where?: object;
  search?: string;
  order?: object;
  relations?: string[];
};
export type QuizControllerFindOnePrivateByIdApiResponse = unknown;
export type QuizControllerFindOnePrivateByIdApiArg = {
  id: string;
  companyId: string;
  relations?: string[];
};
export type QuizControllerFindOnePublicByIdApiResponse = unknown;
export type QuizControllerFindOnePublicByIdApiArg = {
  id: string;
  companyId: string;
  relations?: string[];
};
export type QuizControllerUpdateOneByIdApiResponse = unknown;
export type QuizControllerUpdateOneByIdApiArg = {
  id: string;
  companyId: string;
  updateQuizDto: UpdateQuizDto;
};
export type QuizControllerDeleteOneByIdApiResponse = unknown;
export type QuizControllerDeleteOneByIdApiArg = {
  id: string;
  companyId: string;
};
export type QuizControllerImportQuizzesApiResponse = unknown;
export type QuizControllerImportQuizzesApiArg = {
  companyId: string;
};
export type AttemptControllerSubmitAttemptApiResponse = unknown;
export type AttemptControllerSubmitAttemptApiArg = {
  companyId: string;
  quizId: string;
  createAttemptDto: CreateAttemptDto;
};
export type AttemptControllerFindAllApiResponse = unknown;
export type AttemptControllerFindAllApiArg = {
  companyId: string;
  skip?: number;
  take?: number;
  where?: object;
  search?: string;
  order?: object;
  relations?: string[];
};
export type AttemptControllerGetSingleAttemptApiResponse = unknown;
export type AttemptControllerGetSingleAttemptApiArg = {
  attemptId: string;
  companyId: string;
};
export type AttemptControllerExportAttemptsCsvApiResponse = unknown;
export type AttemptControllerExportAttemptsCsvApiArg = {
  companyId: string;
  quizId: string;
};
export type AnalyticsControllerGetPersonalRatingApiResponse = unknown;
export type AnalyticsControllerGetPersonalRatingApiArg = void;
export type AnalyticsControllerGetPersonalAverageScoreApiResponse = unknown;
export type AnalyticsControllerGetPersonalAverageScoreApiArg = void;
export type AnalyticsControllerGetPersonalScoresDynamicsApiResponse = unknown;
export type AnalyticsControllerGetPersonalScoresDynamicsApiArg = void;
export type AnalyticsControllerGetPersonalLastCompletionsApiResponse = unknown;
export type AnalyticsControllerGetPersonalLastCompletionsApiArg = void;
export type AnalyticsControllerGetCompanyScoresDynamicsApiResponse = unknown;
export type AnalyticsControllerGetCompanyScoresDynamicsApiArg = {
  companyId: string;
};
export type AnalyticsControllerGetCompanyUserScoresDynamicsApiResponse = unknown;
export type AnalyticsControllerGetCompanyUserScoresDynamicsApiArg = {
  companyId: string;
  userId: string;
};
export type AnalyticsControllerGetCompanyUsersLastCompletionsApiResponse = unknown;
export type AnalyticsControllerGetCompanyUsersLastCompletionsApiArg = {
  companyId: string;
};
export type NotificationControllerFindAllApiResponse = unknown;
export type NotificationControllerFindAllApiArg = {
  skip?: number;
  take?: number;
  where?: object;
  search?: string;
  order?: object;
  relations?: string[];
};
export type NotificationControllerGetCountApiResponse = unknown;
export type NotificationControllerGetCountApiArg = {
  status: string;
};
export type NotificationControllerUpdateStatusApiResponse = unknown;
export type NotificationControllerUpdateStatusApiArg = {
  status: string;
};
export type QuestionAnswer = {
  content: string;
  correctness: 'correct' | 'incorrect';
  question: QuizQuestion;
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};
export type QuizQuestion = {
  prompt: string;
  type: 'single_choice' | 'multiple_choice';
  quiz: Quiz;
  answers: QuestionAnswer[];
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};
export type Quiz = {
  title: string;
  description: string;
  completionFrequency: number;
  company: Company;
  questions: QuizQuestion[];
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};
export type Company = {
  name: string;
  description: string;
  status: 'visible' | 'hidden';
  members?: CompanyUser[];
  actions?: Action[];
  quizzes?: Quiz[];
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};
export type Action = {
  createdBy?: User;
  subject: User;
  company: Company;
  status: 'pending' | 'accepted' | 'declined';
  type: 'request' | 'invite';
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};
export type QuizAttempt = {
  user: User;
  company: Company;
  quiz: Quiz | null;
  quizTitleSnapshot: string;
  correctAnswersCount: number;
  totalQuestionsCount: number;
  userAnswers: object[];
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};
export type User = {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash?: string | null;
  role: 'user' | 'super_admin';
  refreshTokenHash?: string | null;
  memberships?: CompanyUser[];
  sentActions?: Action[];
  receivedActions?: Action[];
  attempts?: QuizAttempt[];
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};
export type CompanyUser = {
  role: 'owner' | 'admin' | 'member';
  user: User;
  company: Company;
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};
export type ReturnUserDto = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'super_admin';
  memberships?: CompanyUser[];
  createdAt: string;
  updatedAt: string;
};
export type UpdateUserDto = object;
export type CreateUserDto = {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
};
export type CreateCompanyDto = {
  name: string;
  description: string;
  status?: 'visible' | 'hidden';
};
export type UpdateCompanyDto = object;
export type CreateAnswerDto = {
  content: string;
  correctness: 'correct' | 'incorrect';
};
export type CreateQuestionDto = {
  prompt: string;
  type: 'single_choice' | 'multiple_choice';
  answers: CreateAnswerDto[];
};
export type CreateQuizDto = {
  title: string;
  description: string;
  completionFrequency: number;
  questions: CreateQuestionDto[];
};
export type UpdateAnswerDto = {
  content: string;
  correctness: 'correct' | 'incorrect';
  id?: string;
};
export type UpdateQuestionDto = {
  id?: string;
  answers: UpdateAnswerDto[];
};
export type UpdateQuizDto = {
  questions: UpdateQuestionDto[];
};
export type CreateAttemptDto = {
  /** Map of question IDs to an array of selected answer IDs */
  userAnswers: object;
};
export const {
  useAppControllerHealthCheckQuery,
  useUserFindProfileQuery,
  useUserFindAllQuery,
  useUserFindOneByIdQuery,
  useUserUpdateOneByIdMutation,
  useUserDeleteOneByIdMutation,
  useAuthSignupMutation,
  useAuthLoginMutation,
  useAuthRefreshMutation,
  useAuthLogoutMutation,
  useCompanyCreateMutation,
  useCompanyFindAllQuery,
  useCompanyFindOneByIdQuery,
  useCompanyUpdateOneByIdMutation,
  useCompanyDeleteOneByIdMutation,
  useCompanyUpdateRolesMutation,
  useCompanyAddNewOwnerMutation,
  useCompanyLeaveCompanyMutation,
  useCompanyKickUsersMutation,
  useActionControllerInviteUserMutation,
  useActionControllerCancelInviteMutation,
  useActionControllerManageInviteMutation,
  useActionControllerRequestJoinMutation,
  useActionControllerCancelRequestMutation,
  useActionControllerAcceptRequestMutation,
  useActionControllerGetUserActionsQuery,
  useActionControllerGetCompanyActionsQuery,
  useQuizControllerCreateMutation,
  useQuizControllerFindAllQuery,
  useQuizControllerFindOnePrivateByIdQuery,
  useQuizControllerFindOnePublicByIdQuery,
  useQuizControllerUpdateOneByIdMutation,
  useQuizControllerDeleteOneByIdMutation,
  useQuizControllerImportQuizzesMutation,
  useAttemptControllerSubmitAttemptMutation,
  useAttemptControllerFindAllQuery,
  useAttemptControllerGetSingleAttemptQuery,
  useAttemptControllerExportAttemptsCsvQuery,
  useAnalyticsControllerGetPersonalRatingQuery,
  useAnalyticsControllerGetPersonalAverageScoreQuery,
  useAnalyticsControllerGetPersonalScoresDynamicsQuery,
  useAnalyticsControllerGetPersonalLastCompletionsQuery,
  useAnalyticsControllerGetCompanyScoresDynamicsQuery,
  useAnalyticsControllerGetCompanyUserScoresDynamicsQuery,
  useAnalyticsControllerGetCompanyUsersLastCompletionsQuery,
  useNotificationControllerFindAllQuery,
  useNotificationControllerGetCountQuery,
  useNotificationControllerUpdateStatusMutation,
} = injectedRtkApi;
