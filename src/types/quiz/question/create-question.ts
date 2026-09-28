import { QuizQuestionType } from '@/utils/enums';
import { CreateAnswer } from '../answer/create-answer';

export type CreateQuestion = {
  prompt: string;
  type: QuizQuestionType;
  answers: CreateAnswer[];
};
