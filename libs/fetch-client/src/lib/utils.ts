import { CustomError } from '@ns3/ts-utils';

export class FetchError extends CustomError<'FetchError'> {
  constructor(
    readonly response: Response,
    private readonly body = '',
  ) {
    super({ name: 'FetchError', message: 'Response returned with status not ok.' });
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack,
      response: {
        url: this.response.url,
        status: this.response.status,
        statusText: this.response.statusText,
        type: this.response.type,
        body: this.body,
      },
    };
  }
}

export async function assertOk(response: Response): Promise<void> {
  if (!response.ok) {
    throw new FetchError(
      response,
      await response
        .clone()
        .text()
        .catch(() => ''),
    );
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
