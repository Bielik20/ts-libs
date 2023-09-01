import { RequestInterceptor } from '../request-interceptor';

type Options = Partial<typeof DEFAULT_OPTIONS>;
const DEFAULT_OPTIONS = {
  timeout: 5000 as number,
} as const;

export function timeoutInterceptor(options: Options = {}): RequestInterceptor {
  const { timeout } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  return async (_req, next) => {
    const req = new Request(_req, { signal: AbortSignal.timeout(timeout) });

    try {
      return await next(req);
    } catch (e: any) {
      if (e.name === 'TimeoutError') {
        return new Response(undefined, { status: 408, statusText: 'Request Timeout' });
      }
      throw e;
    }
  };
}
