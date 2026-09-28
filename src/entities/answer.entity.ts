import { AnswerCorrectness } from '@/utils/enums';
import { BaseEntity } from './base.entity';
import { QuizQuestion } from './question.entity';

export interface QuestionAnswer extends BaseEntity {
  content: string;

  correctness: AnswerCorrectness;

  question: QuizQuestion;
}
