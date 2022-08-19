import { Klass } from '../klass';

export type ParamTypes = Klass<any>[];

/**
 * used to access design time types
 */
const DESIGN_PARAM_TYPES_KEY = 'design:paramtypes';

export function getDesignParamTypes(target: Object): ParamTypes {
  return Reflect.getMetadata(DESIGN_PARAM_TYPES_KEY, target);
}

/**
 * used to store types to be injected
 */
const PARAM_TYPES_KEY = '@ns3/di:ParamTypes';

export function hasParamTypes(target: Object): boolean {
  return Reflect.hasOwnMetadata(PARAM_TYPES_KEY, target);
}

export function getParamTypes(target: Object): ParamTypes {
  return Reflect.getMetadata(PARAM_TYPES_KEY, target);
}

export function setParamTypes(target: Object, value: ParamTypes): void {
  return Reflect.defineMetadata(PARAM_TYPES_KEY, value, target);
}
