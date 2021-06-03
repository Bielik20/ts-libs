# @ns3/http-client

RxJs based injectable http-client for frontend applications.

It requires [@wikia/dependency-injection](https://www.npmjs.com/package/@wikia/dependency-injection) and should not be used without it.

It was inspired and based on [Angular's HttpClient](https://angular.io/guide/http).

It executes http calls using `rxjs/ajax` while allowing to provide interceptors.

## Example HttpInterceptor

```ts
export class DelayInterceptor implements HttpInterceptor {
  private readonly delay = 300;

  intercept<T>(req: AjaxConfig, next: HttpHandler<T>): Observable<AjaxResponse<T>> {
    return next(req).pipe(
      delay(this.delay),
      catchError((err) =>
        of(null).pipe(
          delay(this.delay),
          mergeMap(() => throwError(err)),
        ),
      ),
    );
  }
}
```

## Example usage in React with `@ns3/react-di`

```tsx
import { HttpInterceptors } from '@ns3/http-client';
import { DiProvider, useDependencyInjection } from '@ns3/react-di';
import { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import { DelayInterceptor } from 'react-demo/shared/delay.interceptor';

export default function MyApp({ Component, pageProps }: AppProps) {
  const container = useDependencyInjection([HttpInterceptors.provide(DelayInterceptor)]);

  return (
    <React.Fragment>
      <Head>
        <title>My page</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <DiProvider value={container}>
        <Component {...pageProps} />
      </DiProvider>
    </React.Fragment>
  );
}
```

Then in any component:

```tsx
import { HttpClient } from '@ns3/http-client';
import { useDependency } from '@ns3/react-di';
import React from 'react';

export default function ProductDetails() {
  const httpClient = useDependency(HttpClient);

  return null;
}
```