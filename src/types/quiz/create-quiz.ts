import { CreateQuestion } from './question/create-question';

export type CreateQuiz = {
  title: string;
  description: string;
  completionFrequency: number;
  questions: CreateQuestion[];
};
