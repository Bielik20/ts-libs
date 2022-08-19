import type { Container } from './container';
import { Provider } from './provider';
import { Scope } from './scope';

export abstract class Resolver<T> {
  static make<T>(scope: Scope, provider: Provider<T>): Resolver<T> {
    switch (scope) {
      case Scope.Global:
      case Scope.Local:
        return new PersistentResolver(provider);
      case Scope.Transient:
        return new TransientResolver(provider);
    }
  }

  abstract clone(): Resolver<T>;
  abstract resolve(container: Container, requesterScope: Scope): T;
}

class PersistentResolver<T> implements Resolver<T> {
  private instance?: T;

  constructor(private readonly provider: Provider<T>) {}

  clone(): Resolver<T> {
    return new PersistentResolver(this.provider);
  }

  resolve(container: Container, requesterScope: Scope): T {
    if (!this.instance) {
      this.instance = this.provider(container, requesterScope);
    }

    return this.instance;
  }
}

class TransientResolver<T> implements Resolver<T> {
  constructor(private readonly provider: Provider<T>) {}

  clone(): Resolver<T> {
    return this;
  }

  resolve(container: Container, requesterScope: Scope): T {
    return this.provider(container, requesterScope);
  }
}
