import { getParamConfigsDict, ParamConfig } from './param-config';
import { getParamTypes } from './param-types';

export type ParamConfigs = ParamConfig<any>[];

export function getParamConfigs(target: Object): ParamConfigs {
  const paramTypes = getParamTypes(target) || [];
  const paramConfigsDict = getParamConfigsDict(target) || {};

  return paramTypes.map((type, index) => paramConfigsDict[index] || { id: type });
}
