import { CustomError } from '@ns3/ts-utils';

export class FetchError extends CustomError<'FetchError'> {
  constructor(readonly response: Response) {
    super({ name: 'FetchError', message: 'Response returned with status not ok.' });
  }
}

export type Fetch = typeof fetch;

export class FetchClient {
  constructor(readonly fetch: Fetch = fetch) {}

  get(url: string, config: RequestInit = {}) {
    return this.fetch(url, this.createRequestInit('GET', undefined, config));
  }

  delete(url: string, config: RequestInit = {}) {
    return this.fetch(url, this.createRequestInit('DELETE', undefined, config));
  }

  patch(url: string, body?: Record<string, any>, config: RequestInit = {}) {
    return this.fetch(url, this.createRequestInit('PATCH', body, config));
  }

  post(url: string, body?: Record<string, any>, config: RequestInit = {}) {
    return this.fetch(url, this.createRequestInit('POST', body, config));
  }

  put(url: string, body?: Record<string, any>, config: RequestInit = {}) {
    return this.fetch(url, this.createRequestInit('PUT', body, config));
  }

  private createRequestInit(
    method: string,
    body?: Record<string, any>,
    config: RequestInit = {},
  ): RequestInit {
    return {
      body: typeof body === 'object' ? JSON.stringify(body) : body,
      method,
      ...config,
      headers: {
        'Content-Type': 'application/json',
        ...(config.headers || {}),
      },
    };
  }
}

export async function assertOk(response: Response): Promise<void> {
  if (!response.ok) {
    throw new FetchError(response);
  }
}

export async function toJson(response: Response): Promise<any> {
  await assertOk(response);

  return response.json();
}
