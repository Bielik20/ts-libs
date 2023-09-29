import { Scope } from '../scope';
import { Binding } from './binding';
import { BindingToken } from './binding-config';

export class BindingsRepository {
  static make(): BindingsRepository {
    return new BindingsRepository(
      new Map<BindingToken<any>, Binding<any>>(),
      new Map<BindingToken<any>, Binding<any>>(),
    );
  }

  private constructor(
    private readonly global: Map<BindingToken<any>, Binding<any>>,
    private readonly local: Map<BindingToken<any>, Binding<any>>,
  ) {}

  clone(): BindingsRepository {
    const local = new Map<BindingToken<any>, Binding<any>>();

    this.local.forEach((value, key) => {
      local.set(key, value.clone());
    });

    return new BindingsRepository(this.global, local);
  }

  get<T>(token: BindingToken<T>): Binding<T> | undefined {
    const localBinding = this.local.get(token);
    if (localBinding) {
      return localBinding;
    }

    const rootBinding = this.global.get(token);
    if (rootBinding && rootBinding.config.scope === Scope.Global) {
      return rootBinding;
    }

    return undefined;
  }

  save<T>(binding: Binding<T>): void {
    if (binding.config.scope === Scope.Global) {
      this.global.set(binding.config.token, binding);
    } else {
      this.local.set(binding.config.token, binding);
    }
  }

  deleteLocal<T>(token: BindingToken<T>): void {
    this.local.delete(token);
  }

  deleteGlobal<T>(token: BindingToken<T>): void {
    this.global.delete(token);
  }

  clearLocal() {
    this.local.clear();
  }

  clearGlobal() {
    this.global.clear();
  }
}
