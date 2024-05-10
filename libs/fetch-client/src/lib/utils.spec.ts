import { assertOk } from './utils';

describe('FetchError', () => {
  test('should work with JSON.stringify', async () => {
    expect.assertions(1);
    const mockFetch = jest.fn(
      async () => new Response(undefined, { status: 500, statusText: 'Internal Server Error' }),
    );
    try {
      await mockFetch().then(assertOk);
    } catch (e) {
      expect(JSON.parse(JSON.stringify(e))).toEqual({
        message: 'Response returned with status not ok.',
        name: 'FetchError',
        response: {
          body: '',
          status: 500,
          statusText: 'Internal Server Error',
          type: 'default',
          url: '',
        },
        stack: expect.stringContaining('FetchError: Response returned with status not ok.'),
      });
    }
  });
});
