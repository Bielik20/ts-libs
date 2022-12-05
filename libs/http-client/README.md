# @ns3/http-client

<p align="center">
  <a href="https://www.npmjs.com/package/@ns3/http-client">
    <img src="https://img.shields.io/npm/v/@ns3/http-client.svg" alt="npm version">
  </a>
  <a href="https://bundlephobia.com/package/@ns3/http-client">
    <img src="https://img.shields.io/bundlephobia/minzip/@ns3/http-client" alt="bundlephobia">
  </a>    
  <a href="https://bundlephobia.com/package/@ns3/http-client">
    <img src="https://badgen.net/bundlephobia/tree-shaking/react-colorful" alt="bundlephobia">
  </a>
</p>

Fetch based injectable http-client for web and node (18+) applications.

It was inspired and based on [Angular's HttpClient](https://angular.io/guide/http).

It executes http calls using `fetch` while allowing to provide interceptors.

## Base usage + helper functions

```ts
import { assertOk, FetchClient, toJson } from '@ns3/http-client';

const client = new FetchClient();

client.get('https://google.com').then(console.log);
client.get('https://google.com').then(assertOk);
client.get('https://example-api.com').then(toJson);
```

## Example FetchInterceptor

```ts
import { FetchClient, FetchInterceptor, makeFetchHandler } from '@ns3/http-client';

const delayInterceptor: FetchInterceptor = async (req, next) => {
  await new Promise((res) => setTimeout(res, this.delay));

  return next(req);
};

const client = new FetchClient(makeFetchHandler([delayInterceptor]));
```

## Example usage with `@ns3/di`

```tsx
import { Container, Injectable, Klass, Provider } from '@ns3/di';
import { FetchClient, FetchInterceptor, makeFetchHandler } from '@ns3/http-client';

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
