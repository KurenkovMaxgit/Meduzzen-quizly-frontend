import { CreateAnswer } from './create-answer';

export type UpdateAnswer = Partial<CreateAnswer> & { id: string };
