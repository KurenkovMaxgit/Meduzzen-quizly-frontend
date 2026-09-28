import { QuizAttemptPage } from '@/components/quizzes/quiz-attempt-page';

export default async function QuizAttemptPageRoute({
  params,
}: {
  params: Promise<{ companyId: string; quizId: string }>;
}) {
  const { companyId, quizId } = await params;

  return <QuizAttemptPage companyId={companyId} quizId={quizId} />;
}
