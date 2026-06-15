import { FindCompany } from '../company/find-company';
import { FindQuestion } from './question/find-question';

export type FindQuiz = {
  id?: string;
  title?: string;
  description?: string;
  questions?: FindQuestion;
  company?: FindCompany;
  createdAt?: Date;
  updatedAt?: Date;
};
