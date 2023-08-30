import { FetchClient } from './fetch-client';

describe('FetchClient', () => {
  const mockFetch = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('baseUrl and headers', async () => {
    const client = new FetchClient({
      baseUrl: 'https://example.com',
      headers: { foo: 'bar' },
      fetch: mockFetch,
    });

    await client.get('/foo');

    expect(mockFetch).toHaveBeenCalledWith('https://example.com/foo', {
      body: undefined,
      headers: { 'Content-Type': 'application/json', foo: 'bar' },
      method: 'GET',
    });
  });

  describe('basic methods', () => {
    const client = new FetchClient({ fetch: mockFetch });

    test('get', async () => {
      await client.get('/foo');
      expect(mockFetch).toHaveBeenCalledWith('/foo', {
        body: undefined,
        headers: { 'Content-Type': 'application/json' },
        method: 'GET',
      });
    });

    test('delete', async () => {
      await client.delete('/foo');
      expect(mockFetch).toHaveBeenCalledWith('/foo', {
        body: undefined,
        headers: { 'Content-Type': 'application/json' },
        method: 'DELETE',
      });
    });

    test('patch', async () => {
      await client.patch('/foo', { name: 'Ned' });
      expect(mockFetch).toHaveBeenCalledWith('/foo', {
        body: '{"name":"Ned"}',
        headers: { 'Content-Type': 'application/json' },
        method: 'PATCH',
      });
    });

    test('post', async () => {
      await client.post('/foo', { name: 'Ned' });
      expect(mockFetch).toHaveBeenCalledWith('/foo', {
        body: '{"name":"Ned"}',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });
    });

    test('put', async () => {
      await client.put('/foo', { name: 'Ned' });
      expect(mockFetch).toHaveBeenCalledWith('/foo', {
        body: '{"name":"Ned"}',
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
      });
    });
  });
});
