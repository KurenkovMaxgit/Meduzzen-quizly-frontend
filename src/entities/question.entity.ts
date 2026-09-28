import { BaseEntity } from './base.entity';
import { QuestionAnswer } from './answer.entity';
import { Quiz } from './quiz.entity';
import { QuizQuestionType } from '@/utils/enums';

export interface QuizQuestion extends BaseEntity {
  prompt: string;

  type: QuizQuestionType;

  quiz: Quiz;

  answers: QuestionAnswer[];
}
