import { PublicReturnQuestion, PrivateReturnQuestion } from './question/return-question';

export type PublicReturnQuiz = {
  id: string;
  title?: string;
  description?: string;
  questions?: PublicReturnQuestion[];
  createdAt: Date;
  updatedAt: Date;
};

export type PrivateReturnQuiz = {
  id: string;
  title?: string;
  description?: string;
  questions?: PrivateReturnQuestion[];
  createdAt: Date;
  updatedAt: Date;
};
