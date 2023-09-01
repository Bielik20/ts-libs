import { Fetch } from '../fetch-client';
import { interceptFetch } from '../request-interceptor';
import { timeoutInterceptor } from './timeout';

describe('timeoutInterceptor', () => {
  test('return 408 when timeout', async () => {
    const client = interceptFetch([timeoutInterceptor({ timeout: 1 })]);
    const res = await client('https://httpbin.org/delay/2');
    expect(res.status).toBe(408);
  });

  test('maintain response when not timeout', async () => {
    const mockFetch = jest.fn(
      async () => new Response(undefined, { status: 200, statusText: 'Ok' }),
    );
    const client = interceptFetch([timeoutInterceptor()], mockFetch as Fetch);
    const res = await client('https://foo.bar');
    expect(res.status).toBe(200);
  });

  test('maintain request', async () => {
    const mockFetch = jest.fn(
      async () => new Response(undefined, { status: 200, statusText: 'Ok' }),
    );
    const client = interceptFetch([timeoutInterceptor()], mockFetch as Fetch);
    await client('https://foo.bar', { method: 'POST', body: 'foo', headers: { foo: 'bar' } });
    expect(mockFetch).toBeCalledTimes(1);
    // @ts-ignore
    const request = mockFetch.mock.calls[0][0] as Request;
    expect(request.url).toBe('https://foo.bar/');
    expect(request.method).toBe('POST');
    expect(request.headers.get('foo')).toBe('bar');
    const tmp = await request.body!.getReader().read();
    const body = Buffer.from(tmp.value!).toString();
    expect(body).toBe('foo');
  });
});
