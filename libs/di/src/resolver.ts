import type { Container } from './container';
import { Factory } from './factory';
import { Scope } from './scope';

export abstract class Resolver<T> {
  static make<T>(scope: Scope, factory: Factory<T>): Resolver<T> {
    switch (scope) {
      case Scope.Global:
      case Scope.Local:
        return new PersistentResolver(factory);
      case Scope.Transient:
        return new TransientResolver(factory);
    }
  }

  abstract clone(): Resolver<T>;
  abstract resolve(container: Container, requesterScope: Scope): T;
}

class PersistentResolver<T> implements Resolver<T> {
  private instance?: T;

  constructor(private readonly factory: Factory<T>) {}

  clone(): Resolver<T> {
    return new PersistentResolver(this.factory);
  }

  resolve(container: Container, requesterScope: Scope): T {
    if (!this.instance) {
      this.instance = this.factory(container, requesterScope);
    }

    return this.instance;
  }
}

class TransientResolver<T> implements Resolver<T> {
  constructor(private readonly factory: Factory<T>) {}

  clone(): Resolver<T> {
    return this;
  }

  resolve(container: Container, requesterScope: Scope): T {
    return this.factory(container, requesterScope);
  }
}
