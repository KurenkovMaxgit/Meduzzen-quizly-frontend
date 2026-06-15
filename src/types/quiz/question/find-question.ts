import { QuizQuestionType } from '@/utils/enums';
import { FindAnswer } from '../answer/find-answer';

export type FindQuestion = {
  id?: string;
  prompt?: string;
  type?: QuizQuestionType;
  answers?: FindAnswer;
  createdAt?: Date;
  updatedAt?: Date;
};
