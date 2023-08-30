import { combineUrls } from './utils';

export type Fetch = typeof fetch;

type Options = {
  fetch?: Fetch;
  baseUrl?: string;
  headers?: HeadersInit;
};

export class FetchClient {
  private readonly createUrl: (url: string) => string;
  private readonly headers: HeadersInit;
  readonly fetch: Fetch;

  constructor(options: Options = {}) {
    this.fetch = options.fetch || fetch;
    this.headers = options.headers || {};
    if (options.baseUrl) {
      this.createUrl = (url) => combineUrls(options.baseUrl!, url);
    } else {
      this.createUrl = (url) => url;
    }
  }

  get(url: string, config: RequestInit = {}) {
    return this.fetch(this.createUrl(url), this.createRequestInit('GET', undefined, config));
  }

  delete(url: string, config: RequestInit = {}) {
    return this.fetch(this.createUrl(url), this.createRequestInit('DELETE', undefined, config));
  }

  patch(url: string, body?: Record<string, any>, config: RequestInit = {}) {
    return this.fetch(this.createUrl(url), this.createRequestInit('PATCH', body, config));
  }

  post(url: string, body?: Record<string, any>, config: RequestInit = {}) {
    return this.fetch(this.createUrl(url), this.createRequestInit('POST', body, config));
  }

  put(url: string, body?: Record<string, any>, config: RequestInit = {}) {
    return this.fetch(this.createUrl(url), this.createRequestInit('PUT', body, config));
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
        ...this.headers,
        ...(config.headers || {}),
      },
    };
  }
}
