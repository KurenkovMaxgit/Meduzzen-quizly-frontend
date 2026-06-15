import { QuizQuestionType } from '@/utils/enums';
import { PublicReturnAnswer, PrivateReturnAnswer } from '../answer/return-answer';

export type PublicReturnQuestion = {
  id: string;
  prompt: string;
  type: QuizQuestionType;
  answers: PublicReturnAnswer[];
  createdAt: Date;
  updatedAt: Date;
};

export type PrivateReturnQuestion = {
  id: string;
  prompt: string;
  type: QuizQuestionType;
  answers: PrivateReturnAnswer[];
  createdAt: Date;
  updatedAt: Date;
};
