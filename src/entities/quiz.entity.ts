import { BaseEntity } from './base.entity';
import { QuizQuestion } from './question.entity';
import { Company } from './company.entity';

export interface Quiz extends BaseEntity {
  title: string;

  description: string;

  completionFrequency: number;

  company: Company;

  questions: QuizQuestion[];
}
