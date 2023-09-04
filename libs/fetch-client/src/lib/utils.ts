import { CustomError } from '@ns3/ts-utils';

export class FetchError extends CustomError<'FetchError'> {
  constructor(readonly response: Response) {
    super({ name: 'FetchError', message: 'Response returned with status not ok.' });
  }
}

export async function assertOk(response: Response): Promise<void> {
  if (!response.ok) {
    throw new FetchError(response);
  }
}

export function toJson<T = any>(): (response: Response) => Promise<T> {
  return async (response) => {
    await assertOk(response);

    return response.json();
  };
}

export function combineUrls(baseURL: string, relativeURL: string): string {
  return baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '');
}
