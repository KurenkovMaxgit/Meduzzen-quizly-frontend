export interface HttpExceptionResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  details?: unknown;
}

export class HttpError extends Error {
  data: HttpExceptionResponse;

  constructor(args: { message?: string; data: HttpExceptionResponse }) {
    super(args.message || `[API] Request failed with status ${args.data.statusCode}`);
    this.name = 'HttpError';
    this.data = args.data;
  }
}

export interface RejectedMeta {
  baseQueryMeta?: {
    request?: {
      url: string;
      method: string;
    };
  };
  arg?: {
    endpointName: string;
  };
}

export interface RejectedAction {
  payload: {
    status: number | string;
    data: HttpExceptionResponse;
  };
  meta: RejectedMeta;
}
