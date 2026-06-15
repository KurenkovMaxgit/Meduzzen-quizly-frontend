import { PrivateReturnQuiz, PublicReturnQuiz } from '@/types/quiz/return-quiz';

export function QuizListItem(quiz: PublicReturnQuiz | PrivateReturnQuiz) {
  return (
    <div className='bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 mb-4 flex flex-col justify-between gap-4 rounded-xl border p-4 shadow-sm sm:flex-row sm:items-center'></div>
  );
}
