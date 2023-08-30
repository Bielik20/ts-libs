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

`fetch` utilities for web and node (min v18).

## Helper Functions

```ts
import { assertOk, toJson } from '@ns3/fetch-client';

// Ensures status ok and returns Promise<void>
fetch('https://google.com').then(assertOk);

// Ensures status ok and returns parsed body Promise<any>
fetch('https://example-api.com').then(toJson);
```

In case `response.ok !== true` those helpers will throw `FetchError` that you can type check against:

```ts
import { assertOk, FetchError } from '@ns3/fetch-client';

fetch('https://google.com')
  .then(assertOk)
  .catch((error) => {
    if (error instanceof FetchError) {
      console.log(error.response.status);
    }
  });
```

## Interceptors

`RequestInterceptor` is a simple function that receives:

- `req` - instance of fetch `Request`
- `next` - method to call a next interceptor or a final fetch.

and returns a fetch `Response`.

You can modify `Request` before a call to a `next` function.

You can modify `Response` after a call to a `next` function.

You can use interceptors by creating a new instance of `fetch` function using `interceptFetch` function.
It takes an array of interceptors as a first argument and optionally base `fetch` function as a second.
It returns modified, interceptable `fetch` function.

```ts
import { interceptFetch, RequestInterceptor } from '@ns3/fetch-client';

const firstInterceptor: RequestInterceptor = async (req, next) => {
  console.log('first req');
  const result = await next(req);
  console.log('first res');
  return result;
};

const interceptableFetch = interceptFetch([firstInterceptor]);
```

### Example

Here is a practical example of `RequestInterceptor` used for providing authorization header:

```ts
import { interceptFetch, RequestInterceptor } from '@ns3/fetch-client';

const authInterceptor: RequestInterceptor = async (req, next) => {
  // modify request by adding auth header
  const token = 'auth token from somewhere';
  req.headers.set('authorization', `Bearer ${token}`);

  const res = await next(req);

  // check response and decide what to do
  if (res.status === 401) {
    // maybe I should refresh token and try again
  } else {
    return res;
  }
};

const interceptableFetch = interceptFetch([authInterceptor]);

interceptableFetch('https://my-site-that-requires-auth.com').then(console.log);
```

### Call Order

Having interceptors:

```ts
import { interceptFetch } from '@ns3/fetch-client';
import { firstInterceptor, secondInterceptor } from './somewhere';

const interceptableFetch = interceptFetch([firstInterceptor, secondInterceptor]);
```

The call order would be:

- `first req`
- `second req`
- `actual fetch`
- `second res`
- `first res`

### Extend

It is possible to extend existing interceptable fetch:

```ts
import { interceptFetch } from '@ns3/fetch-client';
import { extendInterceptor, firstInterceptor, secondInterceptor } from './somewhere';

const interceptableFetch = interceptFetch([firstInterceptor, secondInterceptor]);
const extendedFetch = interceptFetch([extendInterceptor], interceptableFetch);
```

The call order of `extendedFetch` would be:

- `extendInterceptor req`
- `first req`
- `second req`
- `actual fetch`
- `second res`
- `first res`
- `extendInterceptor res`

## FetchClient

A light weight `FetchClient`. It was inspired by [Angular's HttpClient](https://angular.io/guide/http) and [axios](https://axios-http.com/docs/intro).
It features:

- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) and all its features.
- An object-oriented, [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) based API.
- Request transformation (`JSON.stringify` + `'Content-Type': 'application/json'` header).
- Response transformation via `toJson` utility function.
- Interceptors via `interceptFetch`.

### Base usage

```ts
import { FetchClient, toJson } from '@ns3/fetch-client';

const client = new FetchClient();

client.get('https://example-api.com').then(console.log);

// Body is `JSON.stringify`
// 'Content-Type': 'application/json' header is added
client.post('https://example-api.com', { foo: 'bar' }).then(toJson).then(console.log);
// Response is transformed using toJson function
```

### Interceptors

`FetchClient` is made to work with `RequestInterceptor`s.
Constructor receives a `fetch` function as an optional first argument.
You can use `interceptFetch` to provide it a `fetch` instance interceptable with `RequestInterceptor`s.

```ts
import { FetchClient, interceptFetch } from '@ns3/fetch-client';
import { firstInterceptor, secondInterceptor } from './somewhere';

const client = new FetchClient({ fetch: interceptFetch([firstInterceptor, secondInterceptor]) });
```

### With `@ns3/di`

For those using [@ns3/di](https://www.npmjs.com/package/@ns3/di) this is an example of simple integration with dependency injection system:

```tsx
import { Container, Injectable } from '@ns3/di';
import { FetchClient, interceptFetch, RequestHandler } from '@ns3/fetch-client';

@Injectable()
export class DelayInterceptor {
  private readonly delay = 300;

  async intercept(req: Request, next: RequestHandler): Promise<Response> {
    await new Promise((res) => setTimeout(res, this.delay));

    return next(req);
  }
}

@Injectable()
export class FetchDiClient extends FetchClient {
  constructor(delayInterceptor: DelayInterceptor) {
    super(interceptFetch([(req, next) => delayInterceptor.intercept(req, next)]));
  }
}

const container = Container.make();
const client = container.get(FetchDiClient);
```
