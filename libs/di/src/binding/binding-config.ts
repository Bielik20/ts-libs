import { AbstractClass, Class, isClass } from '../class';
import { Factory } from '../factory';
import { Scope } from '../scope';

// AbstractClass doesn't seem to do anything but Function is necessary, not sure why
export type BindingId<T> = Class<T> | AbstractClass<T> | Function | symbol | string;

export type BindingConfig<T> =
  | ClassBindingConfig<T>
  | ValueBindingConfig<T>
  | FactoryBindingConfig<T>;

export type ClassBindingConfig<T> = {
  token: BindingId<T>;
  useClass: Class<T>;
  scope?: Scope;
};

export type ValueBindingConfig<T> = {
  token: BindingId<T>;
  useValue: T;
  scope?: Scope;
};

export type FactoryBindingConfig<T> = {
  token: BindingId<T>;
  useFactory: Factory<T>;
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

  return isClass(input) || type === 'symbol' || type === 'string';
}

export function isClassConfig<T>(config: BindingConfig<T>): config is ClassBindingConfig<T> {
  return 'useClass' in config;
}

export function isValueConfig<T>(config: BindingConfig<T>): config is ValueBindingConfig<T> {
  return 'useValue' in config;
}

export function isFactoryConfig<T>(config: BindingConfig<T>): config is FactoryBindingConfig<T> {
  return 'useFactory' in config;
}
