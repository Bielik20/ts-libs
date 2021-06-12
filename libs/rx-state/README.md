# @ns3/rx-state

Reactive State is a platform agnostic solution for state management built as an extension on [RxJs](https://rxjs.dev/). The goal of this solution is to provide standard data structures but with reactive capabilities, as well as configurable way to cache data with minimal effort.

Watch this video the get an idea what Reactive State is about:

[![Reactive State](https://img.youtube.com/vi/ey2G5vQiuGI/0.jpg)](https://www.youtube.com/watch?v=ey2G5vQiuGI-Y "Reactive State")

## Data Structures

### BehaviorSubject

The smallest unit and a building block of RxState is [BehaviorSubject](https://www.learnrxjs.io/learn-rxjs/subjects/behaviorsubject) from [RxJs](https://rxjs.dev/) itself.

It serves as your reactive variable, so you can store and update simple values.

```ts
import { BehaviorSubject } from 'rxjs';

const currentQuery$ = new BehaviorSubject({ skip: 0, limit: 10 }); // define your data

currentQuery$.subscribe(console.log); // react to your data

currentQuery$.next({ skip: 10, limit: 20 }); // update your data
```

### ConnectSubject

Extension of [BehaviorSubject](#BehaviorSubject) with connect capabilities.

```ts
import { ConnectSubject } from '@ns3/rx-state';
import { BehaviorSubject } from 'rxjs';
import { ajax } from 'rxjs/ajax';

const authenticatedUserFetching$ = new BehaviorSubject(false);
const authenticatedUser$ = new ConnectSubject({
  connecting$: authenticatedUserFetching$, // optional
  timeout: 5 * 60 * 1000, // 5 minutes
  strategy: 'lazy',
});

authenticatedUser$.connect$(() => ajax('http://link-to-my-endpoint')).subscribe(console.log);
```

`authenticatedUser$.connect$` - will return state data and use provided function to retrieve data if none is present or is outdated.

`authenticatedUserFetching$` - will keep information if `connect$` method is at the moment using provided function to retrieve data.

> To learn more about `connect$` capabilities read [Connect](#Connect).

### RxSet

Reactive Set is a data structure that resembles [regular JS Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) but with reactive capabilities.

```ts
import { RxSet } from '@ns3/rx-state';

const fetching = new RxSet<string>();

fetching.has$('id-of-my-entity').subscribe(console.log); // listen to given entity fetching
fetching.keys$().subscribe(console.log) // listen to keys of all fetching entities

fetching.add('id-of-my-entity'); // mark entity as being fetched
fetching.delete('id-of-my-entity'); // mark entity as not being fetched
```

### RxMap

Reactive Map is a data structure that resembles [regular JS Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) but with reactive capabilities.

```ts
import { RxMap } from '@ns3/rx-state';

interface Product {
  id: string;
  price: number;
}

const products = new RxMap<string, Product>();

products.get$('id-of-my-entity').subscribe(console.log); // listen to a product with given key
products.values$().subscribe(console.log) // listen to all products in collection

products.set('id-of-my-entity', { id: 'id-of-my-entity', price 999 }); // set product
products.delete('id-of-my-entity'); // delete product
```

### RxConnectMap

Extension of [RxMap](#RxMap) with connect capabilities.

```ts
import { RxConnectMap, RxSet } from '@ns3/rx-state';

interface Product {
  id: string;
  price: number;
}

const fetching = new RxSet<string>();
const products = new RxConnectMap<string, Product>(
  connectingSet: fetching, // optional
  timeout: 5 * 60 * 1000, // 5 minutes
  scope: 'single',
  strategy: 'lazy',
);

products.connect$(
  'id-of-my-entity',
  () => ajax('http://link-to-my-endpoint/id-of-my-entity'
)).subscribe(console.log);
```

`products.connect$` - will return state data for given key and use provided function to retrieve data if none is present or is outdated.

`fetching` - will keep information if `connect$` method is at the moment using provided function to retrieve data for given key.

> To learn more about `connect$` capabilities read [Connect](#Connect).

### RxArrays

Reactive Arrays is a data structure for keeping arrays of data.
It is meant to be used alongside [RxMap](#RxMap).
[RxMap](#RxMap) keeps information about entities, RxArrays keeps information which items and in what order are stored.

```ts
import { RxArrays, RxMap } from '@ns3/rx-state';

interface Product {
  id: string;
  price: number;
}

const products = new RxMap<string, Product>();
const paginated = new RxArrays({
  itemsMap: products,
  itemKey: (value) => value.id,
});

const itemsToSet: Product[] = [
  { id: 'a', price: 10 },
  { id: 'b', price: 20 },
]

paginated.set('page-1', itemsToSet);

products.get$('a').subscribe(console.log);
paginated.get$('page11').subscribe(console.log);
```

In the constructor you provide:

* `itemsMap` which is a correlated [RxMap](#RxMap)
* `itemKey` which is a function to retrieve a key of a given value to set in [RxMap](#RxMap)
  * In our example `paginated` will set `{ id: 'a', price: 10 }` on `products` [RxMap](#RxMap) with key 'a', because `itemKey: (value) => value.id`

`products.get$('a')` - will return item with id 'a'.

`paginated.get$('page-1')` - will return `itemsToSet`.

Any change to items in `products` `RxMap` or `paginated` `RxArrays` will be reflected in both collections.

### RxConnectArrays

Extension of [RxArrays](#RxArrays) with connect capabilities.

```ts
import { RxConnectArrays, RxMap. RxSet } from '@ns3/rx-state';

interface Product {
  id: string;
  price: number;
}

const fetching = new RxSet<string>();
const products = new RxMap<string, Product>();
const paginated = new RxConnectArrays({
  itemsMap: products,
  itemKey: (value) => value.id,
  connectingSet: fetching, // optional
  timeout: 5 * 60 * 1000, // 5 minutes
  scope: 'all',
  strategy: 'eager',
});

paginated.connect$(
  'page-1',
  () => ajax('http://link-to-my-endpoint/page-1'
)).subscribe(console.log);
```

`products.connect$` - will return state data for given key and use provided function to retrieve data if none is present or is outdated.

`fetching` - will keep information if `connect$` method is at the moment using provided function to retrieve data for given key.

> To learn more about `connect$` capabilities read [Connect](#Connect).

### RxArray and RxConnectArray

These data structures are the same as [RxArrays](#RxArrays) and [RxConnectArrays](#RxConnectArrays) respectively, but do not support multiple keys.

Methods like `get$`, `set`, `connect$` are missing the first argument (key).

## Connect

### Connect Options

For connect options we distinguish **multiple** and **single** connections.

* We use **multiple** for data structures keeping more than one entity using keys.
* We use **single** for data structures keeping only one value.

The base `connect$` options consist of:

```ts
interface Options {
  timeout?: number;
  strategy: 'eager' | 'lazy';
  scope: 'single' | 'all'; // only in multiple connections
}
```

* `timeout` - For how long (in milliseconds) data should be considered valid. After this time calling `connect$` method will cause *ConnectionManager* to use provided function to retrieve data. Before that it serves data from cache (state).
  * Defaults to never, meaning that data will always remain valid. Note that technically I am setting timeout to "week" (604800000), which should be more than enough. If, for some reason, you need more than week you need to set it manually.
  * Setting `0` will make data always invalid.
* `strategy` - Invalidation strategy, meaning how eagerly *ConnectionManager* invalidates data.
  * `eager` - Calling `connect$` method on invalid data will cause *ConnectionManager* to NOT return any data and wait for the provided function to retrieve data.
  * `lazy` - Calling `connect$` method on invalid data will cause *ConnectionManager* to return outdated data immediately and use provided function to retrieve data in the background.
* `scope` - Describes if invalidation should affect only specific target or entire collection. This only applies to **multiple** connections.
  * `single` - Only element with a given key is considered invalid. This makes sense when elements are not correlated, like individual items etc.
  * `all` - If at least one element is invalid we invalidate all of them. This makes sense when elements are correlated like pages in pagination.

It is common for connect-able structures to also accept one additional **optional** input.

For **single** connection it is `connecting$` ([BehaviorSubject](#BehaviorSubject)) that keeps info if function provided to retrieve data is currently executing.

For **multiple** connections it is `connectingSet` ([RxSet](#RxSet)) that does the same but for multiple connections.

### `connect$` method

`connect$` method will accept:

* `key` and `function to retrieve data` for **multiple** connections.
* `function to retrieve data` for **single** connection.

The `function to retrieve data` that we provide will be called if there is no data or data is outdated.

It is NOT limited to http calls. It can be http call, socket connection, or reading from file system.
To only requirement is that it is a function that returns `Observable` with given type of data.

## Example

This is only a simple example. This is not the only nor the best way to use those reactive data structures.
This is meant to give you an easy place to get started.

Create one of your stores:

```ts
export class ProductsStore {
  public readonly deleting = new RxSet<string>();
  public readonly updating = new RxSet<string>();
  public readonly fetching = new RxSet<string>();
  public readonly entities = new RxConnectMap<string, Product>({
    connectingSet: this.fetching,
    timeout: 5 * 60 * 1000, // 5 minutes
    scope: 'single',
    strategy: 'lazy',
  });

  // service for making http calls
  constructor(private readonly service: ProductsService) {}

  connect$(id: string): Observable<Product> {
    return this.entities.connect$(id, () => this.service.get(id)).pipe(omitUndefined());
  }

  patch(id: string, value: Partial<Product>): Observable<Product> {
    this.updating.add(id);

    return this.service.patch(id, value).pipe(
      tap({
        next: (product) => {
          this.updating.delete(id);
          this.entities.set(product.id, product);
        },
        error: () => {
          this.updating.delete(id);
        },
      }),
    );
  }

  delete(id: string): Observable<void> {
    this.deleting.add(id);

    return this.service.delete(id).pipe(
      tap({
        next: () => {
          this.entities.delete(id);
          this.deleting.delete(id);
          this.queried.invalidateAll();
        },
        error: () => {
          this.deleting.delete(id);
        },
      }),
    );
  }
}
```

### Usage in React

Export your `ProductsStore` in a way that is most comfortable.

You can create instance and export it, or use dependency injection system to abstract creation process. It is your choice.

> To use RxJs in React I recommend using `useStream` and `useStreamValue` hooks from [@ns3/react-utils](https://www.npmjs.com/package/@ns3/react-utils).

In your component:

```tsx
import { useStream } from '@ns3/react-utils';
import { useProductQuery, ProductCont, ErrorComp, LoaderComp } from './somewhere';

export default function ProductDetails() {
  const { id } = useProductQuery();
  const result = useStream(() => productsStore.connect$(id), [id]);

  if (result.status === 'error') {
    return <ErrorComp error={result.error} />;
  }

  if (result.status === 'pending') {
    return <LoaderComp />;
  }

  return <ProductCont product={result.value} />;
}
```

That is it. When `useProductQuery` emits new `id` `connect$` method will be called again and data will change.
If you alter product in anyway it will be reflected here as well.

#### Word about `useStream` and `useStreamValue`

* `useStream` is meant to be used with pending streams. Ones that not necessarily return data right away.
  * `connect$` may take some time to retrieve data. This will result in `result.status === 'pending'`.
  * `connect$` may also fail. This will result in `result.status === 'error'`.

* `useStreamValue` is meant to be used with observables that always return data and do not throw.
Fortunately, excluding `connect$` method, all structures that we discussed here will always immediately emit some data.
Note that if, for example, [RxMap](#RxMap) does not have real value for a given key it will emit `undefined`, but emit it will!
If you use `useStreamValue` for pending or erroring streams it will return just `undefined` in that case of pending or error.
