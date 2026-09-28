'use client';

import { useMemo, useState } from 'react';
import { Button } from '@primereact/ui/button';
import { DataTable } from '@primereact/ui/datatable';
import { useMessages } from 'next-intl';
import { useAppSelector } from '@/lib/hooks';
import { CompanyRole } from '@/utils/enums';
import {
  useCompanyFindAllMembersQuery,
  useQuizFindAllQuery,
  useAttemptFindAllForCompanyQuery,
} from '@/lib/api-endpoints';
import { useRouter } from '@/i18n/routing';
import { ReturnAttempt } from '@/types/quiz/attempt';

export function QuizCompliance({ companyId }: { companyId: string }) {
  const dictionary = useMessages();
  const router = useRouter();
  const role = useAppSelector((state) => state.company.activeRole);
  const [now] = useState(() => Date.now());
  const canManage = role === CompanyRole.OWNER || role === CompanyRole.ADMIN;
  const membersQuery = useCompanyFindAllMembersQuery(
    {
      skip: 0,
      take: 100,
      where: { company: { id: companyId } },
      relations: ['user'],
    },
    { skip: !canManage },
  );
  const quizzesQuery = useQuizFindAllQuery(
    {
      where: { company: { id: companyId } },
      skip: 0,
      take: 100,
      order: { title: 'ASC' },
    },
    { skip: !canManage },
  );
  const attemptsQuery = useAttemptFindAllForCompanyQuery(companyId, { skip: !canManage });

  const rows = useMemo(() => {
    const members = membersQuery.data?.data?.items ?? [];
    const quizzes = quizzesQuery.data?.data?.items ?? [];
    const attempts = attemptsQuery.data?.data?.items ?? [];
    const latest = new Map<string, ReturnAttempt>();
    for (const attempt of attempts) {
      if (attempt.user?.id && attempt.quiz?.id) {
        const key = `${attempt.user.id}:${attempt.quiz.id}`;
        if (!latest.has(key)) latest.set(key, attempt);
      }
    }

    return members.flatMap((membership) =>
      quizzes.map((quiz) => ({
        user: membership.user,
        quiz,
        attempt: latest.get(`${membership.user.id}:${quiz.id}`),
      })),
    );
  }, [membersQuery.data, quizzesQuery.data, attemptsQuery.data]);

  if (!canManage) return <p>{dictionary.quizzes.forbidden}</p>;
  if (membersQuery.isLoading || quizzesQuery.isLoading || attemptsQuery.isLoading)
    return <p>{dictionary.common.loading}</p>;
  if (membersQuery.isError || quizzesQuery.isError || attemptsQuery.isError)
    return <p role='alert'>{dictionary.quizzes.complianceError}</p>;

  return (
    <main className='mx-auto flex w-full max-w-6xl flex-col gap-5'>
      <Button
        severity='secondary'
        variant='text'
        className='self-start'
        onClick={() => router.push(`/companies/${companyId}/quizzes`)}
      >
        <i className='pi pi-arrow-left mr-2' />
        {dictionary.common.back}
      </Button>
      <h1 className='m-0 text-3xl font-bold'>{dictionary.quizzes.compliance}</h1>
      <p className='text-surface-600 dark:text-surface-300'>
        {dictionary.quizzes.complianceDescription}
      </p>
      {(membersQuery.data?.data?.totalCount ?? 0) > 100 ||
      (quizzesQuery.data?.data?.totalCount ?? 0) > 100 ? (
        <p className='rounded-lg bg-amber-100 p-3 text-amber-900 dark:bg-amber-950 dark:text-amber-100'>
          {dictionary.quizzes.complianceLimited}
        </p>
      ) : null}
      {rows.length ? (
        <div className='bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 overflow-hidden rounded-xl border shadow-sm'>
          <DataTable.Root data={rows}>
            <DataTable.TableContainer className='overflow-x-auto'>
              <DataTable.Table style={{ minWidth: '56rem' }}>
                <DataTable.THead>
                  <DataTable.THeadRow>
                    <DataTable.THeadCell>
                      <DataTable.THeadTitle>{dictionary.quizzes.member}</DataTable.THeadTitle>
                    </DataTable.THeadCell>
                    <DataTable.THeadCell>
                      <DataTable.THeadTitle>{dictionary.quizzes.quizName}</DataTable.THeadTitle>
                    </DataTable.THeadCell>
                    <DataTable.THeadCell>
                      <DataTable.THeadTitle>
                        {dictionary.quizzes.lastCompletion}
                      </DataTable.THeadTitle>
                    </DataTable.THeadCell>
                    <DataTable.THeadCell>
                      <DataTable.THeadTitle>
                        {dictionary.quizzes.complianceStatus}
                      </DataTable.THeadTitle>
                    </DataTable.THeadCell>
                    <DataTable.THeadCell>
                      <DataTable.THeadTitle>{dictionary.quizzes.latestScore}</DataTable.THeadTitle>
                    </DataTable.THeadCell>
                  </DataTable.THeadRow>
                </DataTable.THead>
                <DataTable.TBody>
                  {({ item }) => {
                    const { user, quiz, attempt } = item as (typeof rows)[number];
                    const isOverdue =
                      !!attempt &&
                      quiz.completionFrequency > 0 &&
                      now >
                        new Date(attempt.createdAt).getTime() + quiz.completionFrequency * 86400000;
                    const isNoncompliant = !attempt || isOverdue;
                    const score = attempt
                      ? Math.round(
                          (attempt.correctAnswersCount / Math.max(attempt.totalQuestionsCount, 1)) *
                            100,
                        )
                      : null;

                    return (
                      <DataTable.Row key={`${user.id}:${quiz.id}`}>
                        <DataTable.Cell>
                          <div className='flex flex-col'>
                            <span className='font-medium'>
                              {user.firstName} {user.lastName}
                            </span>
                            <span className='text-surface-500 text-sm'>{user.email}</span>
                          </div>
                        </DataTable.Cell>
                        <DataTable.Cell>{quiz.title}</DataTable.Cell>
                        <DataTable.Cell>
                          {attempt
                            ? new Date(attempt.createdAt).toLocaleDateString()
                            : dictionary.quizzes.neverCompleted}
                        </DataTable.Cell>
                        <DataTable.Cell>
                          <span
                            className={
                              isNoncompliant
                                ? 'text-red-700 dark:text-red-400'
                                : 'text-green-700 dark:text-green-400'
                            }
                          >
                            {!attempt
                              ? dictionary.quizzes.notStarted
                              : isOverdue
                                ? dictionary.quizzes.overdue
                                : dictionary.quizzes.current}
                          </span>
                        </DataTable.Cell>
                        <DataTable.Cell>{score === null ? '-' : `${score}%`}</DataTable.Cell>
                      </DataTable.Row>
                    );
                  }}
                </DataTable.TBody>
              </DataTable.Table>
            </DataTable.TableContainer>
          </DataTable.Root>
        </div>
      ) : (
        <p>{dictionary.quizzes.complianceEmpty}</p>
      )}
    </main>
  );
}
