import { CustomError } from '@ns3/ts-utils';

export class FetchError extends CustomError<'FetchError'> {
  constructor(readonly response: Response) {
    super({ name: 'FetchError', message: 'Response returned with status not ok.' });
  }
}

export type FetchHandler = (req: Request) => Promise<Response>;

export class FetchClient {
  constructor(readonly handler: FetchHandler = fetch) {}

  get(url: string, config: RequestInit = {}) {
    return this.handler(this.createRequest(url, 'GET', undefined, config));
  }

  delete(url: string, config: RequestInit = {}) {
    return this.handler(this.createRequest(url, 'DELETE', undefined, config));
  }

  patch(url: string, body?: Record<string, any>, config: RequestInit = {}) {
    return this.handler(this.createRequest(url, 'PATCH', body, config));
  }

  post(url: string, body?: Record<string, any>, config: RequestInit = {}) {
    return this.handler(this.createRequest(url, 'POST', body, config));
  }

  put(url: string, body?: Record<string, any>, config: RequestInit = {}) {
    return this.handler(this.createRequest(url, 'PUT', body, config));
  }

  private createRequest(
    url: string,
    method: string,
    body?: Record<string, any>,
    config: RequestInit = {},
  ): Request {
    return new Request(url, {
      body: typeof body === 'object' ? JSON.stringify(body) : body,
      method,
      ...config,
      headers: {
        'Content-Type': 'application/json',
        ...(config.headers || {}),
      },
    });
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
