'use client';

import { useState } from 'react';
import { useMessages } from 'next-intl';
import { Button } from '@primereact/ui/button';
import { Popover, PopoverRootOpenChangeEvent } from '@primereact/ui/popover';
import { Link, useRouter } from '@/i18n/routing';
import {
  useQuizDeleteOneByIdMutation,
  useQuizFindOnePrivateByIdQuery,
  useQuizFindOnePublicByIdQuery,
} from '@/lib/api-endpoints';
import { useCompanyQuizPermissions } from '@/hooks/use-company-quiz-permissions';
import { useGlobalToast } from '@/providers/toast-provider';
import { QUIZZES_ROUTE } from '@/utils/router-constants';
import { PrivateReturnQuiz, PublicReturnQuiz } from '@/types/quiz/return-quiz';
import { QuizAttempt } from './quiz-attempt';

export function QuizAttemptPage({ companyId, quizId }: { companyId: string; quizId: string }) {
  const dictionary = useMessages();
  const router = useRouter();
  const toast = useGlobalToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteQuiz, { isLoading: isDeleting }] = useQuizDeleteOneByIdMutation();
  const { canManage, isLoading: isCheckingRole } = useCompanyQuizPermissions(companyId);
  const privateQuery = useQuizFindOnePrivateByIdQuery(
    { id: quizId, companyId, relations: ['questions', 'questions.answers'] },
    { skip: !canManage },
  );
  const publicQuery = useQuizFindOnePublicByIdQuery(
    { id: quizId, companyId, relations: ['questions', 'questions.answers'] },
    { skip: canManage },
  );
  const query = canManage ? privateQuery : publicQuery;
  const quiz = query.data?.data as PrivateReturnQuiz | PublicReturnQuiz | undefined;

  async function handleDelete() {
    try {
      await deleteQuiz({ id: quizId, companyId }).unwrap();
      toast.showToast('success', dictionary.toast.quiz.delete.success);
      router.push(`/companies/${companyId}/${QUIZZES_ROUTE}`);
    } catch {
      toast.showToast('error', dictionary.toast.quiz.delete.error);
    }
  }

  if (isCheckingRole || query.isLoading)
    return <p className='mx-auto max-w-4xl'>{dictionary.common.loading}</p>;
  if (query.isError || !quiz)
    return <p className='mx-auto max-w-4xl'>{dictionary.quizzes.notFound}</p>;

  return (
    <main className='mx-auto flex w-full max-w-4xl flex-col gap-6'>
      <Link href={`/companies/${companyId}/${QUIZZES_ROUTE}`} className='self-start'>
        <i className='pi pi-arrow-left mr-2' />
        {dictionary.common.back}
      </Link>
      <header className='bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 flex flex-wrap items-start justify-between gap-4 rounded-xl border p-4 shadow-sm'>
        <div className='min-w-0'>
          <h1 className='m-0 text-2xl font-bold'>{quiz.title}</h1>
          {quiz.description && (
            <p className='text-surface-600 dark:text-surface-300 mb-0'>{quiz.description}</p>
          )}
          <p className='text-surface-500 mb-0 text-sm'>
            {dictionary.quizzes.fields.frequency}: {quiz.completionFrequency}
          </p>
        </div>
        {canManage && (
          <div className='flex shrink-0 flex-wrap gap-2'>
            <Button
              as={Link}
              href={`/companies/${companyId}/${QUIZZES_ROUTE}/${quizId}/edit`}
              severity='secondary'
              variant='outlined'
              disabled={isDeleting}
            >
              <i className='pi pi-pencil mr-2' />
              {dictionary.common.edit}
            </Button>
            <Popover.Root
              open={confirmOpen}
              onOpenChange={(event: PopoverRootOpenChangeEvent) =>
                setConfirmOpen(Boolean(event.value))
              }
            >
              <Popover.Trigger
                as={Button}
                severity='danger'
                variant='outlined'
                disabled={isDeleting}
              >
                <i className='pi pi-trash mr-2' />
                {dictionary.common.delete}
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Positioner>
                  <Popover.Popup>
                    <Popover.Content>
                      <p className='m-2'>{dictionary.quizzes.deleteConfirmation}</p>
                    </Popover.Content>
                    <Popover.Footer>
                      <div className='flex justify-end gap-2 p-2'>
                        <Button
                          size='small'
                          severity='secondary'
                          variant='outlined'
                          disabled={isDeleting}
                          onClick={() => setConfirmOpen(false)}
                        >
                          {dictionary.common.cancel}
                        </Button>
                        <Button
                          size='small'
                          severity='danger'
                          disabled={isDeleting}
                          onClick={handleDelete}
                        >
                          {dictionary.common.confirm}
                          {isDeleting && <i className='pi pi-spin pi-spinner ml-2' />}
                        </Button>
                      </div>
                    </Popover.Footer>
                  </Popover.Popup>
                </Popover.Positioner>
              </Popover.Portal>
            </Popover.Root>
          </div>
        )}
      </header>
      <QuizAttempt quiz={quiz as PublicReturnQuiz} companyId={companyId} />
    </main>
  );
}
