'use client';

import { useState } from 'react';
import { Button } from '@primereact/ui/button';
import { Checkbox, type CheckboxRootChangeEvent } from '@primereact/ui/checkbox';
import { ProgressBar } from '@primereact/ui/progressbar';
import { RadioButton } from '@primereact/ui/radiobutton';
import { useMessages } from 'next-intl';
import { PublicReturnQuiz } from '@/types/quiz/return-quiz';
import { ReturnAttempt } from '@/types/quiz/attempt';
import { QuizQuestionType } from '@/utils/enums';
import { useAttemptSubmitMutation } from '@/lib/api-endpoints';
import { useGlobalToast } from '@/providers/toast-provider';

export function QuizAttempt({ quiz, companyId }: { quiz: PublicReturnQuiz; companyId: string }) {
  const dictionary = useMessages();
  const toast = useGlobalToast();
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [attempt, setAttempt] = useState<ReturnAttempt>();
  const [submitAttempt, { isLoading }] = useAttemptSubmitMutation();
  const score = attempt
    ? Math.round((attempt.correctAnswersCount / Math.max(attempt.totalQuestionsCount, 1)) * 100)
    : 0;

  async function submit() {
    let gradedAttempt: ReturnAttempt;
    try {
      gradedAttempt = await submitAttempt({
        companyId,
        quizId: quiz.id,
        userAnswers: answers,
      }).unwrap();
      if (!gradedAttempt.id || !Array.isArray(gradedAttempt.userAnswers)) {
        throw new Error('The successful response did not include the graded attempt.');
      }
    } catch {
      toast.showToast('error', dictionary.toast.attempt.error);

      return;
    }

    setAttempt(gradedAttempt);
    setAnswers({});
    toast.showToast('success', dictionary.toast.attempt.success);
  }

  function updateSelection(
    questionId: string,
    answerId: string,
    checked: boolean,
    single: boolean,
  ) {
    setAnswers((current) => {
      const currentAnswers = current[questionId] ?? [];
      const updated = single
        ? checked
          ? [answerId]
          : []
        : checked
          ? [...currentAnswers, answerId]
          : currentAnswers.filter((id) => id !== answerId);

      return { ...current, [questionId]: updated };
    });
  }

  return (
    <section className='bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 rounded-xl border p-4 shadow-sm'>
      <h2 className='mt-0 mb-4'>{dictionary.quizzes.takeQuiz}</h2>
      {attempt ? (
        <div role='status'>
          <p className='text-xl font-semibold'>
            {dictionary.quizzes.score}: {score}%
          </p>
          <div className='py-3'>
            <ProgressBar.Root value={score} aria-label={dictionary.quizzes.score}>
              <ProgressBar.Track className='bg-surface-300 dark:bg-surface-600 h-5 overflow-hidden rounded-full p-0.5'>
                <ProgressBar.Indicator className='rounded-full bg-emerald-600 text-xs font-semibold text-white dark:bg-emerald-500'>
                  <ProgressBar.Label>
                    <ProgressBar.Value />
                  </ProgressBar.Label>
                </ProgressBar.Indicator>
              </ProgressBar.Track>
            </ProgressBar.Root>
          </div>
          <p>
            {dictionary.quizzes.points}: {attempt.correctAnswersCount} /{' '}
            {attempt.totalQuestionsCount}
          </p>
          <div className='flex flex-col gap-3'>
            {attempt.userAnswers.map((result) => (
              <article
                key={result.questionId}
                className='border-surface-200 dark:border-surface-700 rounded-lg border p-3'
              >
                <p className='mt-0 font-medium'>{result.prompt}</p>
                <p className='mb-0'>
                  {dictionary.quizzes.questionScore}:{' '}
                  {Math.round(result.wasQuestionAnsweredCorrectly * 100)}%
                </p>
                {result.userAnswers.map((answer) => (
                  <p
                    key={answer.answerId}
                    className={
                      answer.isCorrect
                        ? 'mb-0 text-green-700 dark:text-green-400'
                        : 'mb-0 text-red-700 dark:text-red-400'
                    }
                  >
                    <i className={`pi ${answer.isCorrect ? 'pi-check' : 'pi-times'} mr-2`} />
                    {answer.content}
                  </p>
                ))}
              </article>
            ))}
          </div>
          <Button className='mt-4' onClick={() => setAttempt(undefined)}>
            {dictionary.quizzes.tryAgain}
          </Button>
        </div>
      ) : (
        <>
          <div className='mb-4 flex flex-col gap-4'>
            {(quiz.questions ?? []).map((question, index) => (
              <fieldset
                key={question.id}
                className='border-surface-200 dark:border-surface-700 flex flex-col gap-2 rounded-xl border p-3'
              >
                <legend className='px-2 font-medium'>
                  {index + 1}. {question.prompt}
                </legend>
                {question.answers.map((answer) => {
                  const selected = (answers[question.id] ?? []).includes(answer.id);
                  const inputId = `${question.id}-${answer.id}`;
                  const single = question.type === QuizQuestionType.SINGLE_CHOICE;

                  return (
                    <label
                      key={answer.id}
                      htmlFor={inputId}
                      className='has-checked:bg-primary-50 dark:has-checked:bg-primary-900/20 hover:bg-surface-100 dark:hover:bg-surface-800 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors'
                    >
                      {single ? (
                        <RadioButton.Root
                          inputId={inputId}
                          name={question.id}
                          value={answer.id}
                          checked={selected}
                          onChange={() => updateSelection(question.id, answer.id, true, true)}
                        >
                          <RadioButton.Box>
                            <RadioButton.Indicator match='checked' />
                          </RadioButton.Box>
                        </RadioButton.Root>
                      ) : (
                        <Checkbox.Root
                          inputId={inputId}
                          checked={selected}
                          onCheckedChange={(event: CheckboxRootChangeEvent) =>
                            updateSelection(question.id, answer.id, Boolean(event.checked), false)
                          }
                        >
                          <Checkbox.Box>
                            <Checkbox.Indicator match='checked'>
                              <i className='pi pi-check' />
                            </Checkbox.Indicator>
                          </Checkbox.Box>
                        </Checkbox.Root>
                      )}
                      {answer.content}
                    </label>
                  );
                })}
              </fieldset>
            ))}
          </div>
          <Button onClick={submit} disabled={isLoading || !quiz.questions?.length}>
            {dictionary.quizzes.submitAttempt}
            {isLoading && <i className='pi pi-spin pi-spinner ml-2' />}
          </Button>
        </>
      )}
    </section>
  );
}
