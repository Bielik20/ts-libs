# @ns3/react-di

<p align="center">
  <a href="https://www.npmjs.com/package/@ns3/react-di">
    <img src="https://img.shields.io/npm/v/@ns3/react-di.svg" alt="npm version">
  </a>
  <a href="https://bundlephobia.com/package/@ns3/react-di">
    <img src="https://img.shields.io/bundlephobia/minzip/@ns3/react-di" alt="bundlephobia">
  </a>    
  <a href="https://bundlephobia.com/package/@ns3/react-di">
    <img src="https://badgen.net/bundlephobia/tree-shaking/react-colorful" alt="bundlephobia">
  </a>
</p>

Based on [@ns3/di](https://www.npmjs.com/package/@ns3/di) React implementation of dependency injection. First look into documentation of [@ns3/di](https://www.npmjs.com/package/@ns3/di) to get a hang of using it. This library simply integrates it with React.

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
import { Container } from '@ns3/di';
import React from 'react';
import { ClassToInject } from 'somewhere';

export default function ProductDetails() {
  const injectedInstance = useDependency(ClassToInject); // inject a class
  const container = useDependency(Container); // or even entire container

  return null;
}
```
