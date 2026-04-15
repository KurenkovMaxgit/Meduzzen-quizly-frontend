export type FindAllQuery<T> = {
  skip?: number;
  take?: number;
  where?: T;
  search?: string;
  order?: { [field in keyof T]?: 'ASC' | 'DESC' };
  relations?: string[];
};

export type FindOneQuery = {
  id: string;
  relations?: string[];
};
