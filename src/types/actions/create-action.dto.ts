import { ActionType } from '../../utils/enums';

export type CreateAction = {
  subject: string;

  type: ActionType;
};
