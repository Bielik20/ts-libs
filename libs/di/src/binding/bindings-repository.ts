import { Scope } from '../scope';
import { Binding } from './binding';
import { BindingId } from './binding-config';

export class BindingsRepository {
  static make(): BindingsRepository {
    return new BindingsRepository(
      new Map<BindingId<any>, Binding<any>>(),
      new Map<BindingId<any>, Binding<any>>(),
    );
  }

  private constructor(
    private readonly global: Map<BindingId<any>, Binding<any>>,
    private readonly local: Map<BindingId<any>, Binding<any>>,
  ) {}

  clone(): BindingsRepository {
    const local = new Map<BindingId<any>, Binding<any>>();

    this.local.forEach((value, key) => {
      local.set(key, value.clone());
    });

    return new BindingsRepository(this.global, local);
  }

  get<T>(id: BindingId<T>): Binding<T> | undefined {
    const localBinding = this.local.get(id);
    if (localBinding) {
      return localBinding;
    }

    const rootBinding = this.global.get(id);
    if (rootBinding && rootBinding.config.scope === Scope.Global) {
      return rootBinding;
    }

    return undefined;
  }

  save<T>(binding: Binding<T>): void {
    if (binding.config.scope === Scope.Global) {
      this.global.set(binding.config.bind, binding);
    } else {
      this.local.set(binding.config.bind, binding);
    }
  }

  // TODO: maybe remove ???
  delete<T>(id: BindingId<T>): void {
    const deleted = this.local.delete(id);
    if (!deleted) {
      this.global.delete(id);
    }
  }

  clearLocal() {
    this.local.clear();
  }

  clearGlobal() {
    this.global.clear();
  }
}
