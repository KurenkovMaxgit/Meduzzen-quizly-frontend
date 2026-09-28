import { QuizCompliance } from '@/components/quizzes/quiz-compliance';

export default async function QuizCompliancePage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;

  return <QuizCompliance companyId={companyId} />;
}
