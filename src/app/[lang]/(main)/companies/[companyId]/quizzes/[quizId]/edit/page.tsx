import { QuizEditPage } from '@/components/quizzes/quiz-edit-page';

export default async function EditQuizPage({
  params,
}: {
  params: Promise<{ companyId: string; quizId: string }>;
}) {
  const { companyId, quizId } = await params;

  return <QuizEditPage companyId={companyId} quizId={quizId} />;
}
