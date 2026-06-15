import { AnswerCorrectness } from '@/utils/enums';

export type PublicReturnAnswer = {
  id: string;
  content: string;
  correctness: AnswerCorrectness;
  createdAt: Date;
  updatedAt: Date;
};

export type PrivateReturnAnswer = {
  id: string;
  content: string;
  correctness?: AnswerCorrectness;
  createdAt: Date;
  updatedAt: Date;
};
