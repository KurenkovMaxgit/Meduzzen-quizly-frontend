export interface HttpExceptionResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  details?: unknown;
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
