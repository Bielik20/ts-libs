import { BindingId } from '../binding/binding-config';

export type ParamConfigsDict = Record<number, ParamConfig<any>>;

export type ParamConfig<T> = {
  id?: BindingId<T>;
  optional?: boolean;
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

export function upsertParamConfig<T>(
  target: Object,
  parameterIndex: number,
  value: ParamConfig<T>,
): void {
  const dict = getParamConfigsDict(target) || {};
  const record = dict[parameterIndex] || {};

  dict[parameterIndex] = { ...record, ...value };
  setParamConfigsDict(target, dict);
}
