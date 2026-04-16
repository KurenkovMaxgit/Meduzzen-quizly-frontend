import { QuizzesList } from '@/components/quizzes/quizzes-list';

export default async function QuizzesPage({ params }: { params: Promise<{ companyId: string }> }) {
  const resolvedParams = await params;

  return (
    <div className='mx-auto max-w-5xl'>
      <QuizzesList companyId={resolvedParams.companyId} />
    </div>
  );
}
