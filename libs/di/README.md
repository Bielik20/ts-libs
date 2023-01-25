# @ns3/di

<p align="center">
  <a href="https://www.npmjs.com/package/@ns3/di">
    <img src="https://img.shields.io/npm/v/@ns3/di.svg" alt="npm version">
  </a>
  <a href="https://bundlephobia.com/package/@ns3/di">
    <img src="https://img.shields.io/bundlephobia/minzip/@ns3/di" alt="bundlephobia">
  </a>    
  <a href="https://bundlephobia.com/package/@ns3/di">
    <img src="https://badgen.net/bundlephobia/tree-shaking/react-colorful" alt="bundlephobia">
  </a>
</p>

This is a powerful and lightweight (weights around 5 KB) dependency injection container for TypeScript.
It is designed to be used on both browser and node.js server.

It was inspired by:

- [InversifyJS](https://github.com/inversify/InversifyJS) - it is too big, weights almost 10 times more. I don't need all the features it offers.
- [@wikia/dependency-injection](https://github.com/Wikia/dependency-injection-js) - from the time I worked at Fandom :)



## 📦 Installation

You can get the latest release and the type definitions using your preferred package manager:

```sh
> npm install @ns3/di reflect-metadata
> yarn add @ns3/di reflect-metadata
> pnpm add @ns3/di reflect-metadata
```
> ❕**Hint!** If you want to use a more type-safe version of reflect-metadata, try [`@abraham/reflection`](https://www.npmjs.com/package/@abraham/reflection)

### Configuration

To use decorators enable compilation options in your tsconfig.json file:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

And **once** in your application import `reflect-metadata`:

```ts
import 'reflect-metadata';

// ...
```

## Usage

Please refer to e2e spec for examples of usage.

The most basic usage is:

```typescript
import 'reflect-metadata';
import { Container, Injectable } from '@ns3/di';

@Injectable()
class DependencyClass {
  name = 'implementation dependency';
}

@Injectable()
class MasterClass {
  name = 'implementation master';

  constructor(public dep: DependencyClass) {}
}

const container = Container.make();
const instance = container.get(MasterClass);
```

## A note about classes and interfaces

Typescript interfaces only exist at development time, to ensure type checking. When compiled, they do not generate runtime code.
This ensures good performance, but also means that is not possible to use interfaces as the type of a property being injected.
There is no runtime information that could allow any reflection on interface type. Take a look at https://github.com/Microsoft/TypeScript/issues/3628 for more information about this.

So:

```typescript
import 'reflect-metadata';
import { Container, Injectable } from '@ns3/di';

const container = Container.make();

interface IPersonDAO {
  get(id: string): Person;
}

abstract class PersonDAO implements IPersonDAO {
  get(id: string): Person;
}

class PersonDAOImpl implements IPersonDAO {
  get(id: string): Person {
    // get the person and return it...
  }
}

// NOT SUPPORTED
container.provide({ bind: IPersonDAO, klass: PersonDAOImpl });

// SUPPORTED
container.provide({ bind: PersonDAO, klass: PersonDAOImpl });
```


## Restrictions

- Circular injections are not supported.
- You can only inject types that are already defined into your file.
