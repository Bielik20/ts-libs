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
fetch('https://example-api.com').then(toJson());
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

### Built-in interceptors

Library offers some built-in interceptors to address common use cases.

#### Timeout

To add timeout to a fetch call you can use `timeoutInterceptor`:

```ts
import { interceptFetch, timeoutInterceptor } from '@ns3/fetch-client';

const interceptableFetch1 = interceptFetch([timeoutInterceptor()]); // default 5000ms
const interceptableFetch2 = interceptFetch([timeoutInterceptor({ timeout: 1000 })]);
```

It will return response with status `408` if timeout is reached.

#### Retry

To add retry to a fetch call you can use `retryInterceptor`:

```ts
import { interceptFetch, retryInterceptor } from '@ns3/fetch-client';

// default 2 retries (3 calls in total) with scalling duration 1500ms, exclude 4xx responses
const interceptableFetch1 = interceptFetch([retryInterceptor()]);
const interceptableFetch2 = interceptFetch([
  retryInterceptor({
    maxRetryAttempts: 3, // 4 calls in total
    scalingDuration: 1000, // retries will be delayed respectively by [1000, 2000, 3000]
    excludePredicate: (res) => response.status < 500, // wont retry 4xx responses
  }),
]);
```

## FetchClient

A light weight `FetchClient`. It was inspired by [Angular's HttpClient](https://angular.io/guide/http) and [axios](https://axios-http.com/docs/intro).
It features:

- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) and all its features.
- An object-oriented, [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) based API.
- Request transformation (`JSON.stringify` + `'Content-Type': 'application/json'` header).
- Response transformation via `toJson` utility function.
- `baseUrl` support.
- `headers` support.
- Interceptors via `interceptFetch`.

### Base usage

```ts
import { FetchClient, toJson } from '@ns3/fetch-client';

const client = new FetchClient({
  baseUrl: 'https://example-api.com',
  headers: { 'x-api-key': '123' },
});

client.get('/retrieve').then(console.log);

// Body is `JSON.stringify`
// 'Content-Type': 'application/json' header is added
client.post('/upsert', { foo: 'bar' }).then(toJson()).then(console.log);
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
import {
  Fetch,
  FetchClient,
  interceptFetch,
  RequestHandler,
  retryInterceptor,
} from '@ns3/fetch-client';

@Injectable({ toValue: fetch })
export abstract class IFetch {}
export interface IFetch extends Fetch {}

@Injectable()
export class AppFetchClient extends FetchClient {
  constructor(_fetch: IFetch) {
    super(interceptFetch([retryInterceptor()], _fetch));
  }
}

const container = Container.make();
const client = container.get(AppFetchClient);
```

This way you can easily mock `IFetch` in your tests while still maintain convenient default `Fetch` value through `IFetch` symbol.
