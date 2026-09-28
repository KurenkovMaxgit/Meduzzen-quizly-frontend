import { AnswerCorrectness } from '@/utils/enums';

export type PublicReturnAnswer = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type PrivateReturnAnswer = {
  id: string;
  content: string;
  correctness?: AnswerCorrectness;
  createdAt: string;
  updatedAt: string;
};
