import { Klass } from '../klass';
import { Provider } from '../provider';
import { Scope } from '../scope';

export type InjectableConfig<T> =
  | KlassInjectableConfig<T>
  | ValueInjectableConfig<T>
  | ProviderInjectableConfig<T>;

export type KlassInjectableConfig<T> = {
  autobind?: boolean;
  scope?: Scope;
  klass: Klass<T>;
};

export type ValueInjectableConfig<T> = {
  autobind?: boolean;
  scope?: Scope;
  value: T;
};

export type ProviderInjectableConfig<T> = {
  autobind?: boolean;
  scope?: Scope;
  provider: Provider<T>;
};

const KEY = '@ns3/di:InjectableConfig';

export function getInjectableConfig<T>(target: Object): InjectableConfig<T> | undefined {
  return Reflect.getMetadata(KEY, target);
}

export function setInjectableConfig<T>(target: Object, value: InjectableConfig<T>): void {
  return Reflect.defineMetadata(KEY, value, target);
}
