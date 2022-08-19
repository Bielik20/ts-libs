import { BindingId } from '../binding/binding-config';
import { getParamConfigsDict, setParamConfigsDict } from './param-config';

export function Inject<T extends Function>(identifier: BindingId<T>): Function {
  return function (target: T, propertyKey: string | symbol, parameterIndex: number): T {
    if (propertyKey || typeof parameterIndex !== 'number') {
      throw new Error('Cannot apply @Inject decorator to a property.');
    }

    const types = getParamConfigsDict(target) || {};

    if (types[parameterIndex]) {
      throw new Error('Cannot apply @Inject decorator multiple times on the same parameter.');
    }

    types[parameterIndex] = { id: identifier };
    setParamConfigsDict(target, types);

    return target;
  };
}
