import { Klass, Provider } from '@ns3/di';
import { FetchClient, FetchHandler, FetchInterceptor, makeFetchHandler } from '@ns3/http-client';

export interface FetchClassInterceptor {
  intercept: FetchInterceptor;
}

export function fetchClientProvider(
  interceptorClasses: Klass<FetchClassInterceptor>[],
  base?: FetchHandler,
): Provider<FetchClient> {
  return (container, requesterScope) => {
    const interceptors = interceptorClasses.map(
      (klass) => (req, next) => container.get(klass, requesterScope).intercept(req, next),
    );
    return new FetchClient(makeFetchHandler(interceptors, base));
  };
}
