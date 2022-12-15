import { FetchHandler } from './fetch-client';

export type FetchInterceptor = (req: Request, next: FetchHandler) => Promise<Response>;

export function makeFetchHandler(
  interceptors: FetchInterceptor[],
  base: FetchHandler = fetch,
): FetchHandler {
  return interceptors.reduceRight<FetchHandler>(
    (next, interceptor) => (req) => interceptor(req, next),
    base,
  );
}
