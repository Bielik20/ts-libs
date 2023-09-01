import { RequestInterceptor } from '../request-interceptor';

type Options = Partial<typeof DEFAULT_OPTIONS>;
const DEFAULT_OPTIONS = {
  maxRetryAttempts: 2 as number,
  scalingDuration: 1500 as number,
  excludePredicate: (response: Response) => response.status < 500,
} as const;

export function retryInterceptor(options: Options = {}): RequestInterceptor {
  const { maxRetryAttempts, scalingDuration, excludePredicate } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  return async (req, next) => {
    let retryAttempt = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const response = await next(req.clone());
      if (response.ok) {
        return response;
      }

      if (retryAttempt >= maxRetryAttempts || excludePredicate(response)) {
        return response;
      }

      retryAttempt++;
      console.log(`Retry ${retryAttempt}: running in ${retryAttempt * scalingDuration}ms`);
      await new Promise((resolve) => setTimeout(resolve, retryAttempt * scalingDuration));
    }
  };
}
