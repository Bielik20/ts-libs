# @ns3/rx-actions

<p align="center">
  <a href="https://www.npmjs.com/package/@ns3/rx-actions">
    <img src="https://img.shields.io/npm/v/@ns3/rx-actions.svg" alt="npm version">
  </a>
  <a href="https://bundlephobia.com/package/@ns3/rx-actions">
    <img src="https://img.shields.io/bundlephobia/minzip/@ns3/rx-actions" alt="bundlephobia">
  </a>    
  <a href="https://bundlephobia.com/package/@ns3/rx-actions">
    <img src="https://badgen.net/bundlephobia/tree-shaking/react-colorful" alt="bundlephobia">
  </a>
</p>

Reactive Actions is a platform agnostic solution that aims to provide similar functionality as redux actions and middleware.

## Core Concepts

### Action

Action is a function/method that besides ability to execute lets you listen to `invoked$`, `succeeded$`, `failed$` and `completed$` hooks.

You can define you action like:

```ts
import { Action, action } from '@ns3/rx-actions';
import { Query, Product } from './my-types';

export const getProducts = action((query: Query) => {
  // some logic to fetch products
  return products;
});
```

Type of `getProducts` is `Action<Query, Product[]>`. It is inferred from argument and return types.

You invoke that function as any other, but it always returns Observable and does not execute before `subscribe`.
This is because your passed function is wrapped inside `rxjs` `defer` function.

```ts
import { getProducts } from './get-products';

getProducts({ limit: 10, skip: 0 }).subscribe((products) => {
  console.log(products);
});
```

You can listen to action hooks, like that:

```ts
import { getProducts } from './get-products';

getProducts.invoked$.subscribe(({ id, input }) => {
  console.log(id, input);
});

getProducts.succeeded$.subscribe(({ id, input, output }) => {
  console.log(id, input, output);
});

getProducts.failed$.subscribe(({ id, input, error }) => {
  console.log(id, input, error);
});

getProducts.completed$.subscribe(({ id, input }) => {
  console.log(id, input);
});
```

In this example:

- `input` - is a query we passed when invoking function.
- `output` - is a products array that we received on success.
- `error` - is possible error that may have occurred.
- `id` - is invocation identifier.
  There may be many calls to `getProducts` and if you want to correlate invocation with other hook it is here to help you.

Now, manually subscribing to those hooks can be cumbersome. This is where `reaction`s come into play.

### Reaction

Reaction loosely resemble redux middleware like [@ngrx/effects](https://ngrx.io/guide/effects) or [redux-observable](https://redux-observable.js.org/).

To create `reaction`:

```ts
import { reaction } from '@ns3/rx-actions';
import { getProducts } from './get-products';
import { tracker } from './tracker';

trackGetProducts = reaction(() =>
  getProducts.invoked$.pipe(
    mergeMap(({ input }) =>
      tracker.track(input).pipe(
        tap(() => console.log('I have just tracked getProducts.invoked$')),
        catchError(() => EMPTY),
      ),
    ),
  ),
);
```

To execute reaction you can:

- subscribe manually (not recommended)
- use `ReactionsRunner` (recommended)

```ts
import { ReactionsRunner } from '@ns3/rx-actions';
import { trackGetProducts } from './track-get-products';

runner = new ReactionsRunner();

runner.start(trackGetProducts);
```

Runner will keep subscription reference of given `reaction` and allows you to stop it at any given time.

```ts
runner.stop(trackGetProducts);
```
