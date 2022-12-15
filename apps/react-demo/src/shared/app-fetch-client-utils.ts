import { Factory, Klass } from '@ns3/di';
import { FetchClient, FetchHandler, FetchInterceptor, makeFetchHandler } from '@ns3/fetch-client';

export interface FetchClassInterceptor {
  intercept: FetchInterceptor;
}

export function fetchClientFactory(
  interceptorClasses: Klass<FetchClassInterceptor>[],
  base?: FetchHandler,
): Factory<FetchClient> {
  return (container, requesterScope) => {
    const interceptors = interceptorClasses.map(
      (klass) => (req, next) => container.get(klass, requesterScope).intercept(req, next),
    );
    return new FetchClient(makeFetchHandler(interceptors, base));
  };
}
