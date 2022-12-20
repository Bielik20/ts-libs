import { Factory } from '../factory';
import { isKlass, Klass } from '../klass';
import { Scope } from '../scope';

export type BindingId<T> = Klass<T> | Function | symbol | string;

export type BindingConfig<T> =
  | KlassBindingConfig<T>
  | ValueBindingConfig<T>
  | FactoryBindingConfig<T>;

export type KlassBindingConfig<T> = {
  bind: BindingId<T>;
  klass: Klass<T>;
  scope?: Scope;
};

export type ValueBindingConfig<T> = {
  bind: BindingId<T>;
  value: T;
  scope?: Scope;
};

export type FactoryBindingConfig<T> = {
  bind: BindingId<T>;
  factory: Factory<T>;
  scope?: Scope;
};

export function assertBindingId<T = any>(input: any): asserts input is BindingId<T> {
  if (!isBindingId(input)) {
    throw new TypeError(
      'Invalid type requested to IoC container. TypeKey must be Class, symbol or string.',
    );
  }
}

export function isBindingId<T = any>(input: any): input is BindingId<T> {
  const type = typeof input;

  return isKlass(input) || type === 'symbol' || type === 'string';
}

export function isKlassConfig<T>(config: BindingConfig<T>): config is KlassBindingConfig<T> {
  return 'klass' in config;
}

export function isValueConfig<T>(config: BindingConfig<T>): config is ValueBindingConfig<T> {
  return 'value' in config;
}

export function isFactoryConfig<T>(config: BindingConfig<T>): config is FactoryBindingConfig<T> {
  return 'factory' in config;
}
