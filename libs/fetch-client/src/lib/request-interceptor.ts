import { Fetch } from './fetch-client';

export type RequestHandler = (req: Request) => Promise<Response>;
export type RequestInterceptor = (req: Request, next: RequestHandler) => Promise<Response>;

export function interceptFetch(interceptors: RequestInterceptor[], base: Fetch = fetch): Fetch {
  const handler = interceptors.reduceRight<RequestHandler>(
    (next, interceptor) => (req) => interceptor(req, next),
    base,
  );

  return (input, init) => handler(new Request(input, init));
}
