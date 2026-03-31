import { User } from './user.entity';
import { Quiz } from './quiz.entity';
import { Company } from './company.entity';
import { BaseEntity } from './base.entity';
import { QuestionAttemptSnapshot } from './question-attempt-snapshot.interface';

export interface QuizAttempt extends BaseEntity {
  user: User;

  company: Company;

  quiz: Quiz | null;

  quizTitleSnapshot: string;

  correctAnswersCount: number;

  totalQuestionsCount: number;

  userAnswers: QuestionAttemptSnapshot[];
}
