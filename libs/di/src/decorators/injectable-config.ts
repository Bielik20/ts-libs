import { Class } from '../class';
import { Factory } from '../factory';
import { SafeReflect } from '../safe-reflect';
import { Scope } from '../scope';

export type InjectableConfig<T> =
  | ClassInjectableConfig<T>
  | ValueInjectableConfig<T>
  | FactoryInjectableConfig<T>;

export type ClassInjectableConfig<T> = {
  autobind?: boolean;
  scope?: Scope;
  useClass: Class<T>;
};

export type ValueInjectableConfig<T> = {
  autobind?: boolean;
  scope?: Scope;
  useValue: T;
};

export type FactoryInjectableConfig<T> = {
  autobind?: boolean;
  scope?: Scope;
  useFactory: Factory<T>;
};

const KEY = '@ns3/di:InjectableConfig';

export function getInjectableConfig<T>(target: Object): InjectableConfig<T> | undefined {
  return SafeReflect.getMetadata(KEY, target);
}

export function setInjectableConfig<T>(target: Object, value: InjectableConfig<T>): void {
  return SafeReflect.defineMetadata(KEY, value, target);
}
