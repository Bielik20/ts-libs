import { FetchClient } from './fetch-client';
import { FetchInterceptor, makeFetchHandler } from './fetch-interceptor';

describe('FetchInterceptor', () => {
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
    const firstInterceptor: FetchInterceptor = async (req, next) => {
      spy('first req', req);

      req.headers.set('common', 'first');
      req.headers.set('first', 'foo');

      const result = await next(req);
      const updatedResult = { ...result, common: 'first', first: 'foo' };

      spy('first res', updatedResult);

      return updatedResult;
    };
    const secondInterceptor: FetchInterceptor = async (req, next) => {
      spy('second req', req);

      req.headers.set('common', 'second');
      req.headers.set('second', 'bar');

      const result = await next(req);
      const updatedResult = { ...result, common: 'second', second: 'bar' };

      spy('second res', updatedResult);

      return updatedResult;
    };
    const fetchClient = new FetchClient(
      makeFetchHandler([firstInterceptor, secondInterceptor], fetchMock),
    );

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

    test('extend client', async () => {
      const extendInterceptor: FetchInterceptor = async (req, next) => {
        spy('extendInterceptor req');

        const result = await next(req);

        spy('extendInterceptor res');

        return result;
      };
      const extendedClient = new FetchClient(
        makeFetchHandler([extendInterceptor], fetchClient.handler),
      );

      await extendedClient.get('https://example.com/');

      expect(spy.mock.calls.map((arr) => arr[0])).toEqual([
        'extendInterceptor req',
        'first req',
        'second req',
        'ajax req',
        'second res',
        'first res',
        'extendInterceptor res',
      ]);
    });
  });

  describe('Circular', () => {
    const interceptorWithFetch: FetchInterceptor = async (req, next) => {
      spy(fetchClient);

      const result = await next(req);

      return { ...result, withClient: 'works' };
    };
    const fetchClient = new FetchClient(makeFetchHandler([interceptorWithFetch], fetchMock));

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
