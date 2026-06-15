import { CreateQuiz } from './create-quiz';
import { UpdateQuestion } from './question/update-question';

export type UpdateQuiz = Omit<CreateQuiz, 'questions'> & {
  id: string;
  questions: UpdateQuestion[];
};
