import { BindingId } from '../binding/binding-config';

export type ParamConfigsDict = Record<number, ParamConfig<any>>;

export type ParamConfig<T> = {
  id: BindingId<T>;
};

/**
 * used to store identifiers applies with @Inject decorator
 */
const TAGGED_TYPES_KEY = '@ns3/di:ParamConfigsDict';

export function getParamConfigsDict(target: Object): ParamConfigsDict {
  return Reflect.getMetadata(TAGGED_TYPES_KEY, target);
}

export function setParamConfigsDict(target: Object, value: ParamConfigsDict): void {
  return Reflect.defineMetadata(TAGGED_TYPES_KEY, value, target);
}
