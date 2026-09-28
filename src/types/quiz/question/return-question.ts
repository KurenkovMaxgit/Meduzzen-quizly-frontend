import { QuizQuestionType } from '@/utils/enums';
import { PublicReturnAnswer, PrivateReturnAnswer } from '../answer/return-answer';

export type PublicReturnQuestion = {
  id: string;
  prompt: string;
  type: QuizQuestionType;
  answers: PublicReturnAnswer[];
  createdAt: string;
  updatedAt: string;
};

export type PrivateReturnQuestion = {
  id: string;
  prompt: string;
  type: QuizQuestionType;
  answers: PrivateReturnAnswer[];
  createdAt: string;
  updatedAt: string;
};
