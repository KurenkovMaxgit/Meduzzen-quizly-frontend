'use client';

import { useState } from 'react';
import { useMessages } from 'next-intl';
import { Button } from '@primereact/ui/button';
import { QueryUniversalList } from '@/components/common/universal-list/list-query';
import { ListHeader } from '@/components/common/universal-list/list-header';
import { useDebounce } from '@/hooks/use-debounce';
import { useQuizFindAllQuery } from '@/lib/api-endpoints';
import { PublicReturnQuiz } from '@/types/quiz/return-quiz';
import { FindQuiz } from '@/types/quiz/find-quiz';
import { Link } from '@/i18n/routing';
import { QUIZZES_ROUTE } from '@/utils/router-constants';
import { useCompanyQuizPermissions } from '@/hooks/use-company-quiz-permissions';
import { QuizListItem } from './quizzes-list-item';

export function QuizzesList({ companyId }: { companyId: string }) {
  const dictionary = useMessages();
  const { canManage, company } = useCompanyQuizPermissions(companyId);
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebounce(searchValue, 500);

  const companyName = company?.name;

  return (
    <section className='mx-auto w-full max-w-5xl'>
      <QueryUniversalList<FindQuiz, PublicReturnQuiz>
        key={debouncedSearch}
        queryHook={useQuizFindAllQuery}
        queryParams={{
          where: { company: { id: companyId } },
          search: debouncedSearch,
          order: { title: 'ASC' },
          relations: ['questions'],
        }}
        paginator
        rows={10}
        itemTemplate={(quiz) => (
          <QuizListItem quiz={quiz} companyId={companyId} canManage={canManage} />
        )}
        emptyMessage={dictionary.quizzes.emptyMessage}
      >
        <div className='mb-6 flex items-center justify-between gap-3'>
          <ListHeader
            title={dictionary.quizzes.title + ' "' + companyName + '"'}
            searchbar
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
          {canManage && (
            <div className='flex shrink-0 gap-2'>
              <Button
                as={Link}
                href={`/companies/${companyId}/compliance`}
                severity='secondary'
                variant='outlined'
              >
                <i className='pi pi-chart-bar sm:mr-2' />
                <span className='hidden sm:inline'>{dictionary.quizzes.compliance}</span>
              </Button>
              <Button as={Link} href={`/companies/${companyId}/${QUIZZES_ROUTE}/new`}>
                <i className='pi pi-plus sm:mr-2' />
                <span className='hidden sm:inline'>{dictionary.quizzes.create}</span>
              </Button>
            </div>
          )}
        </div>
      </QueryUniversalList>
    </section>
  );
}
