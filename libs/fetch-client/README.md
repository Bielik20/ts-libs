# @ns3/fetch-client

<p align="center">
  <a href="https://www.npmjs.com/package/@ns3/fetch-client">
    <img src="https://img.shields.io/npm/v/@ns3/fetch-client.svg" alt="npm version">
  </a>
  <a href="https://bundlephobia.com/package/@ns3/fetch-client">
    <img src="https://img.shields.io/bundlephobia/minzip/@ns3/fetch-client" alt="bundlephobia">
  </a>    
  <a href="https://bundlephobia.com/package/@ns3/fetch-client">
    <img src="https://badgen.net/bundlephobia/tree-shaking/react-colorful" alt="bundlephobia">
  </a>
</p>

A light weight `FetchClient` for web and node (18+) applications.

It was inspired by [Angular's HttpClient](https://angular.io/guide/http). 
It provides more object-oriented approach focused on JSON payload with support for interceptors.

## Base usage + helper functions

```ts
import { assertOk, FetchClient, toJson } from '@ns3/fetch-client';

const client = new FetchClient();

client.get('https://google.com').then(console.log);
client.get('https://google.com').then(assertOk);
client.get('https://example-api.com').then(toJson);
```

## Example FetchInterceptor

```ts
import { FetchClient, FetchInterceptor, makeFetchHandler } from '@ns3/fetch-client';

const delayInterceptor: FetchInterceptor = async (req, next) => {
  await new Promise((res) => setTimeout(res, this.delay));

  return next(req);
};

const client = new FetchClient(makeFetchHandler([delayInterceptor]));
```

## Example usage with `@ns3/di`

```tsx
import { Container, Injectable, Klass } from '@ns3/di';
import { FetchClient, FetchInterceptor, makeFetchHandler } from '@ns3/fetch-client';

@Injectable()
export class DelayInterceptor {
  private readonly delay = 300;

  async intercept(req: Request, next: FetchHandler): Promise<Response> {
    await new Promise((res) => setTimeout(res, this.delay));

    return next(req);
  }
}

@Injectable()
export class AppFetchClient extends FetchClient {
  constructor(delayInterceptor: DelayInterceptor) {
    super(makeFetchHandler([(req, next) => delayInterceptor.intercept(req, next)]));
  }
}

const container = Container.make();
const client = container.get(FetchDiClient);
```
