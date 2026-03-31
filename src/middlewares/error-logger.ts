import { isRejectedWithValue, Middleware } from '@reduxjs/toolkit';
import { toast } from '@primereact/headless/toaster';
import { RejectedAction } from '@/interfaces/common/api-exception-interface';

export const queryErrorLogger: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const rejectedAction = action as RejectedAction;
    const response = rejectedAction.payload?.data;

    const requestPath =
      rejectedAction.meta.baseQueryMeta?.request?.url ||
      rejectedAction.meta.arg?.endpointName ||
      'Unknown Path';

    const statusCode = response?.statusCode || rejectedAction.payload?.status || 'Error';
    const defaultErrorMessage = 'The server encountered an unexpected issue.';

    toast.danger({
      title: `Request Failed (${statusCode})`,
      description: `Target: ${requestPath}\nMessage: ${response?.message || defaultErrorMessage}`,
      duration: 5000,
    });
  }

  return next(action);
};
