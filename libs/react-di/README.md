# @ns3/react-di

Based on [@wikia/dependency-injection](https://www.npmjs.com/package/@wikia/dependency-injection) React implementation of dependency injection. First look into documentation of [@wikia/dependency-injection](https://www.npmjs.com/package/@wikia/dependency-injection) to get a hang of using it. This library simply integrates it with React.

## Setup

Provide container in top level component:

```tsx
import { DiProvider, useDependencyInjection } from '@ns3/react-di';
import { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';

export default function MyApp({ Component, pageProps }: AppProps) {
  const container = useDependencyInjection([/* my bindings go here */]);

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
import { useDependency } from '@ns3/react-di';
import { Container } from '@wikia/dependency-injection';
import React from 'react';
import { ClassToInject } from 'somewhere';

export default function ProductDetails() {
  const injectedInstance = useDependency(ClassToInject); // inject a class
  const container = useDependency(Container); // or even entire container

  return null;
}
```
