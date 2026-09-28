import { ReturnUser } from '@/types/user/return-user';

export type CreateAttempt = { userAnswers: Record<string, string[]> };

export type QuestionAttemptSnapshot = {
  questionId: string;
  prompt: string;
  userAnswers: { answerId: string; content: string; isCorrect: boolean }[];
  wasQuestionAnsweredCorrectly: number;
};

export type ReturnAttempt = {
  id: string;
  user?: ReturnUser;
  quiz?: { id: string; title?: string };
  quizTitle: string;
  correctAnswersCount: number;
  totalQuestionsCount: number;
  userAnswers: QuestionAttemptSnapshot[];
  createdAt: string;
};

export type FindAttempt = {
  id?: string;
  user?: { id?: string };
  quiz?: { id?: string };
  quizTitleSnapshot?: string;
  totalQuestionsCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
};
