import { Binding } from './binding/binding';
import { BindingConfig, BindingId } from './binding/binding-config';
import { BindingsRepository } from './binding/bindings-repository';
import { getInjectableConfig, InjectableConfig } from './decorators/injectable-config';
import { isKlass } from './klass';
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
    this.bind({ bind: Container, value: this, scope: Scope.Local });
  }

  clone(): Container {
    return new Container(this.options, this.repository.clone());
  }

  bind<T>(config: BindingConfig<T>): void {
    const binding = Binding.make({ scope: this.options.scope, ...config });

    this.repository.save(binding);
  }

  unbind<T>(bindingId: BindingId<T>): void {
    this.repository.delete(bindingId);
  }

  get<T>(bindingId: BindingId<T>, requesterScope: Scope = Scope.Transient): T {
    const binding = this.ensureBinding(bindingId);

    assertScopeBoundary(binding.config.scope, requesterScope);

    return binding.getInstance(this, binding.config.scope);
  }

  clearLocal() {
    this.repository.clearLocal();
  }

  clearGlobal() {
    this.repository.clearGlobal();
  }

  private ensureBinding<T>(bindingId: BindingId<T>): Binding<T> {
    return this.repository.get(bindingId) ?? this.makeBinding(bindingId);
  }

  private makeBinding<T>(bindingId: BindingId<T>): Binding<T> {
    const config = this.ensureConfig(bindingId);
    const newBinding = Binding.make({
      bind: bindingId,
      ...config,
    });

    this.repository.save(newBinding);

    return newBinding;
  }

  private ensureConfig<T>(bindingId: BindingId<T>): Required<InjectableConfig<T>> {
    const configFlaky = isKlass(bindingId) ? getInjectableConfig<T>(bindingId) : undefined;
    if (!configFlaky) {
      throw new Error(`${bindingId.toString()} is not bound to anything.`);
    }

    const config: Required<InjectableConfig<T>> = {
      ...this.options,
      ...configFlaky,
    };

    if (!config.autobind) {
      throw new Error(`${bindingId.toString()} is not bound to anything.`);
    }

    return config;
  }
}
