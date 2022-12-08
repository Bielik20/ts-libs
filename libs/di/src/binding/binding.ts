import type { Container } from '../container';
import { Resolver } from '../resolver';
import { Scope } from '../scope';
import { BindingConfig } from './binding-config';
import { makeFactory } from './make-factory';

export class Binding<T> {
  static make<T>(config: Required<BindingConfig<T>>): Binding<T> {
    const factory = makeFactory(config);

    return new Binding<T>(config, Resolver.make(config.scope, factory));
  }

  private constructor(
    readonly config: Required<BindingConfig<T>>,
    private readonly resolver: Resolver<T>,
  ) {}

  clone(): Binding<T> {
    return new Binding<T>(this.config, this.resolver.clone());
  }

  getInstance(container: Container, requesterScope: Scope): T {
    return this.resolver.resolve(container, requesterScope);
  }
}
