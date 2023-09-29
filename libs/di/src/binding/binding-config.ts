import { AbstractClass, Class, isClass } from '../class';
import { Factory } from '../factory';
import { Scope } from '../scope';

// AbstractClass doesn't seem to do anything but Function is necessary, not sure why
export type BindingToken<T> = Class<T> | AbstractClass<T> | Function | symbol | string;

export type BindingConfig<T> =
  | ClassBindingConfig<T>
  | ValueBindingConfig<T>
  | FactoryBindingConfig<T>;

export type ClassBindingConfig<T> = {
  token: BindingToken<T>;
  useClass: Class<T>;
  scope?: Scope;
};

export type ValueBindingConfig<T> = {
  token: BindingToken<T>;
  useValue: T;
  scope?: Scope;
};

export type FactoryBindingConfig<T> = {
  token: BindingToken<T>;
  useFactory: Factory<T>;
  scope?: Scope;
};

export function assertBindingToken<T = any>(input: any): asserts input is BindingToken<T> {
  if (!isBindingToken(input)) {
    throw new TypeError(
      'Invalid type requested to IoC container. TypeKey must be Class, symbol or string.',
    );
  }
}

export function isBindingToken<T = any>(input: any): input is BindingToken<T> {
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

export function binding<T>(config: BindingConfig<T>): BindingConfig<T> {
  return config;
}
