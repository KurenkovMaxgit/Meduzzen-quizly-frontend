'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import { Button } from '@primereact/ui/button';
import { Checkbox, type CheckboxRootChangeEvent } from '@primereact/ui/checkbox';
import { InputText } from '@primereact/ui/inputtext';
import { Label } from '@primereact/ui/label';
import { RadioButton } from '@primereact/ui/radiobutton';
import { Select, type SelectValueChangeEvent } from '@primereact/ui/select';
import { Textarea } from '@primereact/ui/textarea';
import { useMessages } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { PrivateReturnQuiz } from '@/types/quiz/return-quiz';
import { AnswerCorrectness, QuizQuestionType } from '@/utils/enums';
import { CreateQuiz } from '@/types/quiz/create-quiz';
import { useQuizCreateMutation, useQuizUpdateOneByIdMutation } from '@/lib/api-endpoints';
import { useGlobalToast } from '@/providers/toast-provider';
import { useCompanyQuizPermissions } from '@/hooks/use-company-quiz-permissions';

type FormAnswer = { id?: string; content: string; correctness: AnswerCorrectness };
type FormQuestion = { id?: string; prompt: string; type: QuizQuestionType; answers: FormAnswer[] };
type FormData = {
  title: string;
  description: string;
  completionFrequency: string;
  questions: FormQuestion[];
};
const blankQuestion = (): FormQuestion => ({
  prompt: '',
  type: QuizQuestionType.SINGLE_CHOICE,
  answers: [
    { content: '', correctness: AnswerCorrectness.CORRECT },
    { content: '', correctness: AnswerCorrectness.INCORRECT },
  ],
});

export function QuizForm({ companyId, quiz }: { companyId: string; quiz?: PrivateReturnQuiz }) {
  const dictionary = useMessages();
  const router = useRouter();
  const toast = useGlobalToast();
  const { canManage, isLoading: isCheckingRole } = useCompanyQuizPermissions(companyId);
  const [createQuiz, createState] = useQuizCreateMutation();
  const [updateQuiz, updateState] = useQuizUpdateOneByIdMutation();
  const isSaving = createState.isLoading || updateState.isLoading;
  const [error, setError] = useState('');
  const [form, setForm] = useState<FormData>(() =>
    quiz
      ? {
          title: quiz.title ?? '',
          description: quiz.description ?? '',
          completionFrequency: String(quiz.completionFrequency),
          questions: (quiz.questions ?? []).map((question) => ({
            id: question.id,
            prompt: question.prompt,
            type: question.type,
            answers: question.answers.map((answer) => ({
              id: answer.id,
              content: answer.content,
              correctness: answer.correctness ?? AnswerCorrectness.INCORRECT,
            })),
          })),
        }
      : {
          title: '',
          description: '',
          completionFrequency: '0',
          questions: [blankQuestion(), blankQuestion()],
        },
  );

  function validate(): string | null {
    if (!form.title.trim() || form.title.length > 250) return dictionary.quizzes.validation.title;
    if (!form.description.trim() || form.description.length > 1000)
      return dictionary.quizzes.validation.description;
    if (!form.completionFrequency.trim()) return dictionary.quizzes.validation.frequency;
    const frequency = Number(form.completionFrequency);
    if (!Number.isInteger(frequency) || frequency < 0)
      return dictionary.quizzes.validation.frequency;
    if (form.questions.length < 2) return dictionary.quizzes.validation.minQuestions;
    for (const question of form.questions) {
      if (!question.prompt.trim() || question.prompt.length > 500)
        return dictionary.quizzes.validation.prompt;
      if (question.answers.length < 2) return dictionary.quizzes.validation.minAnswers;
      if (question.answers.some((answer) => !answer.content.trim() || answer.content.length > 250))
        return dictionary.quizzes.validation.answer;
      const correctCount = question.answers.filter(
        (answer) => answer.correctness === AnswerCorrectness.CORRECT,
      ).length;
      if (question.type === QuizQuestionType.SINGLE_CHOICE && correctCount !== 1)
        return dictionary.quizzes.validation.singleCorrect;
      if (question.type === QuizQuestionType.MULTIPLE_CHOICE && correctCount < 1)
        return dictionary.quizzes.validation.multipleCorrect;
    }

    return null;
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);

      return;
    }
    setError('');
    const payload: CreateQuiz = {
      title: form.title.trim(),
      description: form.description.trim(),
      completionFrequency: Number(form.completionFrequency),
      questions: form.questions.map(({ prompt, type, answers }) => ({
        prompt: prompt.trim(),
        type,
        answers: answers.map(({ content, correctness }) => ({
          content: content.trim(),
          correctness,
        })),
      })),
    };
    try {
      let quizId = quiz?.id;
      if (quiz) {
        await updateQuiz({
          companyId,
          id: quiz.id,
          ...payload,
          questions: form.questions.map((question, index) => ({
            ...payload.questions[index],
            ...(question.id ? { id: question.id } : {}),
            answers: question.answers.map((answer, answerIndex) => ({
              ...payload.questions[index].answers[answerIndex],
              ...(answer.id ? { id: answer.id } : {}),
            })),
          })),
        }).unwrap();
      } else {
        const result = await createQuiz({ companyId, ...payload }).unwrap();
        quizId = result.data?.id;
        if (!quizId) throw new Error('Quiz creation returned no record');
      }
      toast.showToast(
        'success',
        quiz ? dictionary.toast.quiz.update.success : dictionary.toast.quiz.create.success,
      );
      router.push(`/companies/${companyId}/quizzes/${quizId}/attempt`);
    } catch {
      toast.showToast(
        'error',
        quiz ? dictionary.toast.quiz.update.error : dictionary.toast.quiz.create.error,
      );
    }
  }

  const updateQuestion = (index: number, update: Partial<FormQuestion>) =>
    setForm((current) => ({
      ...current,
      questions: current.questions.map((item, i) => (i === index ? { ...item, ...update } : item)),
    }));
  const fieldClass = 'w-full';
  const labelClass = 'text-surface-700 dark:text-surface-300 font-semibold';
  const questionTypeOptions = [
    { label: dictionary.quizzes.types.single, value: QuizQuestionType.SINGLE_CHOICE },
    { label: dictionary.quizzes.types.multiple, value: QuizQuestionType.MULTIPLE_CHOICE },
  ];

  if (isCheckingRole) return <p>{dictionary.common.loading}</p>;
  if (!canManage) return <p>{dictionary.quizzes.forbidden}</p>;

  return (
    <form
      onSubmit={submit}
      className='bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 mx-auto flex w-full max-w-4xl flex-col gap-6 rounded-xl border p-6 shadow-sm'
    >
      <h1 className='m-0 text-3xl font-bold'>
        {quiz ? dictionary.quizzes.edit : dictionary.quizzes.create}
      </h1>
      <div className='flex flex-col gap-2'>
        <Label htmlFor='quiz-title' className={labelClass}>
          {dictionary.quizzes.fields.title}
        </Label>
        <InputText
          id='quiz-title'
          className={fieldClass}
          maxLength={250}
          value={form.title}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setForm({ ...form, title: e.target.value })
          }
        />
      </div>
      <div className='flex flex-col gap-2'>
        <Label htmlFor='quiz-description' className={labelClass}>
          {dictionary.quizzes.fields.description}
        </Label>
        <Textarea
          id='quiz-description'
          className={fieldClass}
          maxLength={1000}
          rows={4}
          value={form.description}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setForm({ ...form, description: e.target.value })
          }
        />
      </div>
      <div className='flex max-w-xs flex-col gap-2'>
        <Label htmlFor='quiz-frequency' className={labelClass}>
          {dictionary.quizzes.fields.frequency}
        </Label>
        <InputText
          id='quiz-frequency'
          type='number'
          min={0}
          step={1}
          className={fieldClass}
          value={form.completionFrequency}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setForm({ ...form, completionFrequency: e.target.value })
          }
        />
      </div>
      <div className='flex flex-col gap-4'>
        {form.questions.map((question, questionIndex) => (
          <fieldset
            key={question.id ?? questionIndex}
            className='bg-surface-50 dark:bg-surface-800 border-surface-200 dark:border-surface-700 flex flex-col gap-4 rounded-xl border p-4'
          >
            <legend className='px-2 font-semibold'>
              {dictionary.quizzes.question} {questionIndex + 1}
            </legend>
            <div className='flex flex-col gap-2'>
              <Label htmlFor={`quiz-question-${questionIndex}`} className={labelClass}>
                {dictionary.quizzes.fields.prompt}
              </Label>
              <Textarea
                id={`quiz-question-${questionIndex}`}
                className={fieldClass}
                maxLength={500}
                rows={3}
                value={question.prompt}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  updateQuestion(questionIndex, { prompt: e.target.value })
                }
              />
            </div>
            <div className='flex max-w-md flex-col gap-2'>
              <Label htmlFor={`quiz-question-type-${questionIndex}`} className={labelClass}>
                {dictionary.quizzes.fields.type}
              </Label>
              <Select.Root
                value={questionTypeOptions.find((option) => option.value === question.type)}
                options={questionTypeOptions}
                optionLabel='label'
                onValueChange={(event: SelectValueChangeEvent) => {
                  const selected = event.value as (typeof questionTypeOptions)[number] | null;
                  if (selected) updateQuestion(questionIndex, { type: selected.value });
                }}
              >
                <Select.Trigger id={`quiz-question-type-${questionIndex}`} className='w-full'>
                  <Select.Value placeholder={dictionary.quizzes.fields.type}>
                    {questionTypeOptions.find((option) => option.value === question.type)?.label}
                  </Select.Value>
                  <Select.Indicator>
                    <i className='pi pi-chevron-down' />
                  </Select.Indicator>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Positioner>
                    <Select.Popup>
                      <Select.List>
                        {questionTypeOptions.map((option, optionIndex) => (
                          <Select.Option key={option.value} index={optionIndex} uKey={option.value}>
                            {option.label}
                            <Select.OptionIndicator className='ml-auto'>
                              <i className='pi pi-check' />
                            </Select.OptionIndicator>
                          </Select.Option>
                        ))}
                      </Select.List>
                    </Select.Popup>
                  </Select.Positioner>
                </Select.Portal>
              </Select.Root>
            </div>
            {question.answers.map((answer, answerIndex) => (
              <div key={answer.id ?? answerIndex} className='flex items-center gap-3'>
                {question.type === QuizQuestionType.SINGLE_CHOICE ? (
                  <RadioButton.Root
                    inputId={`quiz-${questionIndex}-answer-${answerIndex}-correct`}
                    name={`correct-${questionIndex}`}
                    value={String(answerIndex)}
                    checked={answer.correctness === AnswerCorrectness.CORRECT}
                    onChange={() =>
                      updateQuestion(questionIndex, {
                        answers: question.answers.map((item, index) => ({
                          ...item,
                          correctness:
                            index === answerIndex
                              ? AnswerCorrectness.CORRECT
                              : AnswerCorrectness.INCORRECT,
                        })),
                      })
                    }
                    aria-label={`${dictionary.quizzes.fields.correct}: ${dictionary.quizzes.answer} ${answerIndex + 1}`}
                  >
                    <RadioButton.Box>
                      <RadioButton.Indicator match='checked' />
                    </RadioButton.Box>
                  </RadioButton.Root>
                ) : (
                  <Checkbox.Root
                    inputId={`quiz-${questionIndex}-answer-${answerIndex}-correct`}
                    checked={answer.correctness === AnswerCorrectness.CORRECT}
                    onCheckedChange={(event: CheckboxRootChangeEvent) =>
                      updateQuestion(questionIndex, {
                        answers: question.answers.map((item, index) =>
                          index === answerIndex
                            ? {
                                ...item,
                                correctness: event.checked
                                  ? AnswerCorrectness.CORRECT
                                  : AnswerCorrectness.INCORRECT,
                              }
                            : item,
                        ),
                      })
                    }
                    aria-label={`${dictionary.quizzes.fields.correct}: ${dictionary.quizzes.answer} ${answerIndex + 1}`}
                  >
                    <Checkbox.Box>
                      <Checkbox.Indicator match='checked'>
                        <i className='pi pi-check' />
                      </Checkbox.Indicator>
                    </Checkbox.Box>
                  </Checkbox.Root>
                )}
                <InputText
                  aria-label={`${dictionary.quizzes.answer} ${answerIndex + 1}`}
                  id={`quiz-${questionIndex}-answer-${answerIndex}`}
                  className={fieldClass}
                  maxLength={250}
                  placeholder={`${dictionary.quizzes.answer} ${answerIndex + 1}`}
                  value={answer.content}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    updateQuestion(questionIndex, {
                      answers: question.answers.map((a, i) =>
                        i === answerIndex ? { ...a, content: e.target.value } : a,
                      ),
                    })
                  }
                />
                <Button
                  type='button'
                  severity='danger'
                  variant='text'
                  disabled={question.answers.length <= 2}
                  onClick={() =>
                    updateQuestion(questionIndex, {
                      answers: question.answers.filter((_, i) => i !== answerIndex),
                    })
                  }
                  aria-label={dictionary.quizzes.removeAnswer}
                >
                  <i className='pi pi-trash' />
                </Button>
              </div>
            ))}
            <div className='flex flex-wrap gap-2'>
              <Button
                type='button'
                severity='secondary'
                variant='outlined'
                onClick={() =>
                  updateQuestion(questionIndex, {
                    answers: [
                      ...question.answers,
                      { content: '', correctness: AnswerCorrectness.INCORRECT },
                    ],
                  })
                }
              >
                <i className='pi pi-plus mr-2' />
                {dictionary.quizzes.addAnswer}
              </Button>
              <Button
                type='button'
                severity='danger'
                variant='outlined'
                disabled={form.questions.length <= 2}
                onClick={() =>
                  setForm({
                    ...form,
                    questions: form.questions.filter((_, i) => i !== questionIndex),
                  })
                }
              >
                {dictionary.quizzes.removeQuestion}
              </Button>
            </div>
          </fieldset>
        ))}
        <Button
          type='button'
          severity='secondary'
          variant='outlined'
          onClick={() => setForm({ ...form, questions: [...form.questions, blankQuestion()] })}
        >
          <i className='pi pi-plus mr-2' />
          {dictionary.quizzes.addQuestion}
        </Button>
      </div>
      {error && (
        <p role='alert' className='m-0 text-red-600'>
          {error}
        </p>
      )}
      <div className='flex gap-3'>
        <Button type='submit' disabled={isSaving}>
          {dictionary.common.save}
          {isSaving && <i className='pi pi-spin pi-spinner ml-2' />}
        </Button>
        <Button type='button' severity='secondary' variant='outlined' onClick={() => router.back()}>
          {dictionary.common.cancel}
        </Button>
      </div>
    </form>
  );
}
