import { Fetch } from '../fetch-client';
import { interceptFetch } from '../request-interceptor';
import { retryInterceptor } from './retry';

describe('retryInterceptor', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
  });

  describe('retries', () => {
    test('default settings', async () => {
      const mockFetch = jest.fn(
        async () => new Response(undefined, { status: 500, statusText: 'Internal Server Error' }),
      );
      const client = interceptFetch([retryInterceptor()], mockFetch as Fetch);
      const resPromise = client('https://foo.bar');
      await awaitRetries(2);
      const res = await resPromise;
      expect(res.status).toBe(500);
      expect(mockFetch).toBeCalledTimes(3);
      expect(setTimeout).toBeCalledTimes(2);
      expect(setTimeout).toHaveBeenNthCalledWith(1, expect.any(Function), 1500);
      expect(setTimeout).toHaveBeenNthCalledWith(2, expect.any(Function), 3000);
    });

    test('custom settings', async () => {
      const mockFetch = jest.fn(
        async () => new Response(undefined, { status: 500, statusText: 'Internal Server Error' }),
      );
      const client = interceptFetch(
        [retryInterceptor({ maxRetryAttempts: 5, scalingDuration: 1000 })],
        mockFetch as Fetch,
      );
      const resPromise = client('https://foo.bar');
      await awaitRetries(5);
      const res = await resPromise;
      expect(res.status).toBe(500);
      expect(mockFetch).toBeCalledTimes(6);
      expect(setTimeout).toBeCalledTimes(5);
      for (let i = 1; i <= 5; i++) {
        expect(setTimeout).toHaveBeenNthCalledWith(i, expect.any(Function), i * 1000);
      }
    });
  });

  describe('excludePredicate', () => {
    test('default settings', async () => {
      const mockFetch = jest.fn(
        async () => new Response(undefined, { status: 400, statusText: 'Bad Request' }),
      );
      const client = interceptFetch([retryInterceptor()], mockFetch as Fetch);
      const res = await client('https://foo.bar');
      expect(res.status).toBe(400);
      expect(mockFetch).toBeCalledTimes(1);
      expect(setTimeout).toBeCalledTimes(0);
    });

    test('custom settings', async () => {
      const mockFetch = jest.fn(
        async () => new Response(undefined, { status: 400, statusText: 'Bad Request' }),
      );
      const client = interceptFetch(
        [retryInterceptor({ excludePredicate: () => false })],
        mockFetch as Fetch,
      );
      const resPromise = client('https://foo.bar');
      await awaitRetries(2);
      const res = await resPromise;
      expect(res.status).toBe(400);
      expect(mockFetch).toBeCalledTimes(3);
      expect(setTimeout).toBeCalledTimes(2);
      expect(setTimeout).toHaveBeenNthCalledWith(1, expect.any(Function), 1500);
      expect(setTimeout).toHaveBeenNthCalledWith(2, expect.any(Function), 3000);
    });
  });

  async function awaitRetries(count: number) {
    for (const _ of Array(count)) {
      await new Promise<void>((res) => res());
      await new Promise<void>((res) => res());
      jest.runAllTimers();
    }
  }
});
