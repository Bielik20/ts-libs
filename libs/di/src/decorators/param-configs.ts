import { getParamConfigsDict, ParamConfig } from './param-config';
import { getParamTypes } from './param-types';

export type ParamConfigs = Required<ParamConfig<any>>[];

export function getParamConfigs(target: Object): ParamConfigs {
  const paramTypes = getParamTypes(target) || [];
  const paramConfigsDict = getParamConfigsDict(target) || {};

  return paramTypes.map((type, index) => ({
    id: paramConfigsDict[index]?.id || type,
    optional: paramConfigsDict[index]?.optional === true,
  }));
}
