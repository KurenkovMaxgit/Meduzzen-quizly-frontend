import { useMessages } from 'next-intl';
import { QueryUniversalList } from '../common/universal-list/list-query';
import { useDebounce } from '@/hooks/use-debounce';
import { useState } from 'react';
import { useQuizFindAllQuery } from '@/lib/api-endpoints';
import { FindQuiz } from '@/types/quiz/find-quiz';
import { PublicReturnQuiz } from '@/types/quiz/return-quiz';
import { QuizListItem } from './quizzes-list-item';

export function QuizzesList({ companyId }: { companyId: string }) {
  const dictionary = useMessages();

  const [searchValue, setSearchValue] = useState<string>('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);

  const debouncedSearch = useDebounce(searchValue, 500);

  return null;
  // <QueryUniversalList<FindQuiz, PublicReturnQuiz>
  //   queryHook={useQuizFindAllQuery}
  //   queryParams={{ search: searchValue }}
  //   paginator={true}
  //   rows={10}
  //   itemTemplate={(quiz: PublicReturnQuiz) => <QuizListItem {...quiz} />}
  //   emptyMessage={dictionary.quizzes.emptyMessage}
  // ></QueryUniversalList>
}
