import { Klass } from '../klass';
import { SafeReflect } from '../safe-reflect';

export type ParamTypes = Klass<any>[];

/**
 * used to access design time types
 */
const DESIGN_PARAM_TYPES_KEY = 'design:paramtypes';

export function getDesignParamTypes(target: Object): ParamTypes | undefined {
  return SafeReflect.getMetadata(DESIGN_PARAM_TYPES_KEY, target);
}

/**
 * used to store types to be injected
 */
const PARAM_TYPES_KEY = '@ns3/di:ParamTypes';

export function hasParamTypes(target: Object): boolean {
  return SafeReflect.hasOwnMetadata(PARAM_TYPES_KEY, target);
}

export function getParamTypes(target: Object): ParamTypes | undefined {
  return SafeReflect.getMetadata(PARAM_TYPES_KEY, target);
}

export function setParamTypes(target: Object, value: ParamTypes): void {
  return SafeReflect.defineMetadata(PARAM_TYPES_KEY, value, target);
}
