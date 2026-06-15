import { UpdateAnswer } from '../answer/update-answer';
import { CreateQuestion } from './create-question';

export type UpdateQuestion = Omit<CreateQuestion, 'answers'> & {
  id?: string;
  answers: UpdateAnswer[];
};
