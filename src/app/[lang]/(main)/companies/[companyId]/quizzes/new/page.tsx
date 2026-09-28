import { QuizForm } from '@/components/quizzes/quiz-form';

export default async function CreateQuizPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;

  return <QuizForm companyId={companyId} />;
}
