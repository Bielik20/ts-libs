import 'reflect-metadata';
import { Container, Factory, Injectable, Klass } from '@ns3/di';
import { Fetch, FetchClient } from './fetch-client';
import { interceptFetch, RequestHandler, RequestInterceptor } from './request-interceptor';

interface RequestClassInterceptor {
  intercept: RequestInterceptor;
}

function fetchClientFactory(
  interceptorClasses: Klass<RequestClassInterceptor>[],
  base?: Fetch,
): Factory<FetchClient> {
  return (container, requesterScope) => {
    const interceptors = interceptorClasses.map(
      (klass): RequestInterceptor =>
        (req, next) =>
          container.get(klass, requesterScope).intercept(req, next),
    );
    return new FetchClient(interceptFetch(interceptors, base));
  };
}

describe('RequestInterceptorDi', () => {
  const fetchMock = jest.fn();
  const spy = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    fetchMock.mockImplementation(async (req) => {
      spy('ajax req', req);

      return { ajax: 'ajax' };
    });
  });

  describe('Regular', () => {
    @Injectable()
    class FirstInterceptor implements RequestClassInterceptor {
      async intercept(req: Request, next: RequestHandler): Promise<Response> {
        spy('first req', req);

        req.headers.set('common', 'first');
        req.headers.set('first', 'foo');

        const result = await next(req);
        const updatedResult = { ...result, common: 'first', first: 'foo' };

        spy('first res', updatedResult);

        return updatedResult;
      }
    }

    @Injectable()
    class SecondInterceptor implements RequestClassInterceptor {
      async intercept(req: Request, next: RequestHandler): Promise<Response> {
        spy('second req', req);

        req.headers.set('common', 'second');
        req.headers.set('second', 'bar');

        const result = await next(req);
        const updatedResult = { ...result, common: 'second', second: 'bar' };

        spy('second res', updatedResult);

        return updatedResult;
      }
    }

    @Injectable({ factory: fetchClientFactory([FirstInterceptor, SecondInterceptor], fetchMock) })
    class FetchDiClient extends FetchClient {}

    const container = Container.make();
    const fetchClient = container.get(FetchDiClient);

    test('call interceptors in the right order', async () => {
      await fetchClient.get('https://example.com/');

      expect(spy.mock.calls.map((arr) => arr[0])).toEqual([
        'first req',
        'second req',
        'ajax req',
        'second res',
        'first res',
      ]);
    });

    test('modify req and res', async () => {
      const res = await fetchClient.get('https://example.com/');
      const [, req] = spy.mock.calls.find((arr) => arr[0] === 'ajax req');

      expect(req.method).toBe('GET');
      expect(req.url).toBe('https://example.com/');
      expect(req.headers.get('Content-Type')).toBe('application/json');
      expect(req.headers.get('common')).toBe('second');
      expect(req.headers.get('first')).toBe('foo');
      expect(req.headers.get('second')).toBe('bar');
      expect(res).toEqual({
        ajax: 'ajax',
        common: 'first',
        first: 'foo',
        second: 'bar',
      });
    });
  });

  describe('Circular', () => {
    class FetchDiClient extends FetchClient {}

    @Injectable()
    class InterceptorWithFetchClient implements RequestClassInterceptor {
      constructor(private client: FetchDiClient) {}

      async intercept(req: Request, next: RequestHandler): Promise<Response> {
        spy(this.client);

        const result = await next(req);

        return { ...result, withClient: 'works' } as Response;
      }
    }
    const container = Container.make();
    container.provide({
      bind: FetchDiClient,
      factory: fetchClientFactory([InterceptorWithFetchClient], fetchMock),
    });
    const fetchClient = container.get(FetchDiClient);

    it('should be able to use fetchClient', async () => {
      const res = await fetchClient.get('https://example.com/');
      const [client] = spy.mock.calls[0];

      expect(client).toBe(fetchClient);
      expect(res).toEqual({
        ajax: 'ajax',
        withClient: 'works',
      });
    });
  });
});
