'use client';

import { useQuizFindOnePrivateByIdQuery } from '@/lib/api-endpoints';
import { QuizForm } from './quiz-form';
import { useMessages } from 'next-intl';
import { useCompanyQuizPermissions } from '@/hooks/use-company-quiz-permissions';

export function QuizEditPage({ companyId, quizId }: { companyId: string; quizId: string }) {
  const dictionary = useMessages();
  const { canManage, isLoading: isCheckingRole } = useCompanyQuizPermissions(companyId);
  const { data, isLoading, isError } = useQuizFindOnePrivateByIdQuery(
    {
      id: quizId,
      companyId,
      relations: ['questions', 'questions.answers'],
    },
    { skip: !canManage },
  );
  if (isCheckingRole) return <p>{dictionary.common.loading}</p>;
  if (!canManage) return <p>{dictionary.quizzes.forbidden}</p>;
  if (isLoading) return <p>{dictionary.common.loading}</p>;
  if (isError || !data?.data) return <p>{dictionary.quizzes.notFound}</p>;

  return <QuizForm companyId={companyId} quiz={data.data} />;
}
