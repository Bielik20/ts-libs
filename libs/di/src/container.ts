import { Binding } from './binding/binding';
import { BindingConfig, BindingToken } from './binding/binding-config';
import { BindingsRepository } from './binding/bindings-repository';
import { isClass } from './class';
import { getInjectableConfig, InjectableConfig } from './decorators/injectable-config';
import { assertScopeBoundary, Scope } from './scope';

export interface ContainerOptions {
  /**
   * Defines whether classes should be bound autobind by default.
   * @default true
   */
  readonly autobind?: boolean;

  /**
   * Defines default scope for a binding.
   * @default Request
   */
  readonly scope?: Scope;
}

export class Container {
  static make(options: ContainerOptions = {}) {
    return new Container(
      {
        autobind: true,
        scope: Scope.Local,
        ...options,
      },
      BindingsRepository.make(),
    );
  }

  private constructor(
    private readonly options: Required<ContainerOptions>,
    private readonly repository: BindingsRepository,
  ) {
    this.provide({ token: Container, useValue: this, scope: Scope.Local });
  }

  clone(): Container {
    return new Container(this.options, this.repository.clone());
  }

  get<T>(bindingToken: BindingToken<T>, requesterScope: Scope = Scope.Transient): T {
    const binding = this.ensureBinding(bindingToken);

    assertScopeBoundary(binding.config.scope, requesterScope);

    return binding.getInstance(this, binding.config.scope);
  }

  provide<T>(config: BindingConfig<T>): void {
    const binding = Binding.make({ scope: this.options.scope, ...config });

    this.repository.save(binding);
  }

  unprovide<T>(
    bindingToken: BindingToken<T>,
    input: { local?: boolean; global?: boolean } = { local: true, global: true },
  ): void {
    input.global && this.repository.deleteGlobal(bindingToken);
    input.local && this.repository.deleteLocal(bindingToken);
  }

  clear(input: { local?: boolean; global?: boolean } = { local: true, global: true }) {
    input.global && this.repository.clearGlobal();
    input.local && this.repository.clearLocal();
  }

  private ensureBinding<T>(bindingToken: BindingToken<T>): Binding<T> {
    return this.repository.get(bindingToken) ?? this.makeBinding(bindingToken);
  }

  private makeBinding<T>(bindingToken: BindingToken<T>): Binding<T> {
    const config = this.ensureConfig(bindingToken);
    const newBinding = Binding.make({
      token: bindingToken,
      ...config,
    });

    this.repository.save(newBinding);

    return newBinding;
  }

  private ensureConfig<T>(bindingToken: BindingToken<T>): Required<InjectableConfig<T>> {
    const configFlaky = isClass(bindingToken) ? getInjectableConfig<T>(bindingToken) : undefined;
    if (!configFlaky) {
      throw new Error(`${bindingToken.toString()} is not bound to anything.`);
    }

    const config: Required<InjectableConfig<T>> = {
      ...this.options,
      ...configFlaky,
    };

    if (!config.autobind) {
      throw new Error(`${bindingToken.toString()} is not bound to anything.`);
    }

    return config;
  }
}
