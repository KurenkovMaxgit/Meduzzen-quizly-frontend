import { PublicReturnQuestion, PrivateReturnQuestion } from './question/return-question';

export type PublicReturnQuiz = {
  id: string;
  title?: string;
  description?: string;
  completionFrequency: number;
  questions?: PublicReturnQuestion[];
  createdAt: string;
  updatedAt: string;
};

export type PrivateReturnQuiz = {
  id: string;
  title?: string;
  description?: string;
  completionFrequency: number;
  questions?: PrivateReturnQuestion[];
  createdAt: string;
  updatedAt: string;
};
