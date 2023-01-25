import { Factory, Klass } from '@ns3/di';
import { Fetch, FetchClient, interceptFetch, RequestInterceptor } from '@ns3/fetch-client';

export interface RequestClassInterceptor {
  intercept: RequestInterceptor;
}

export function fetchClientFactory(
  interceptorClasses: Klass<RequestClassInterceptor>[],
  base?: Fetch,
): Factory<FetchClient> {
  return (container, requesterScope) => {
    const interceptors = interceptorClasses.map(
      (klass) => (req, next) => container.get(klass, requesterScope).intercept(req, next),
    );
    return new FetchClient(interceptFetch(interceptors, base));
  };
}
