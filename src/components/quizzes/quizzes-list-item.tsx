'use client';

import { Button } from '@primereact/ui/button';
import { Link } from '@/i18n/routing';
import { PublicReturnQuiz } from '@/types/quiz/return-quiz';
import { QUIZZES_ROUTE } from '@/utils/router-constants';
import { useMessages } from 'next-intl';

export function QuizListItem({
  quiz,
  companyId,
  canManage,
}: {
  quiz: PublicReturnQuiz;
  companyId: string;
  canManage: boolean;
}) {
  const dictionary = useMessages();

  return (
    <div className='bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 mb-4 flex w-full flex-col justify-between gap-4 rounded-xl border p-4 shadow-sm sm:flex-row sm:items-center'>
      <div className='flex min-w-0 flex-col gap-1'>
        <h2 className='text-surface-900 dark:text-surface-0 m-0 text-xl font-bold'>{quiz.title}</h2>
        <p className='text-surface-600 dark:text-surface-400 my-1 line-clamp-2'>
          {quiz.description}
        </p>
        <div className='text-surface-500 text-sm'>
          <span>
            {dictionary.quizzes.questionsCount}: {quiz.questions?.length ?? 0}
          </span>
          {',  '}
          <span>
            {dictionary.common.createdAt}: {new Date(quiz.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className='flex shrink-0 justify-end gap-3 sm:ml-auto sm:items-center'>
        <Button
          as={Link}
          href={`/companies/${companyId}/${QUIZZES_ROUTE}/${quiz.id}/attempt`}
          rounded
          variant='outlined'
          severity='contrast'
          className='shrink-0'
          title={dictionary.companies.actions.viewDetails}
        >
          <i className='pi pi-eye my-1' />
        </Button>
        {canManage && (
          <Button
            as={Link}
            href={`/companies/${companyId}/${QUIZZES_ROUTE}/${quiz.id}/edit`}
            rounded
            variant='outlined'
            severity='info'
            className='shrink-0'
            title={dictionary.common.edit}
          >
            <i className='pi pi-pencil my-1' />
          </Button>
        )}
      </div>
    </div>
  );
}
