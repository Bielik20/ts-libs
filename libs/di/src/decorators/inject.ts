import { BindingToken } from '../binding/binding-config';
import { upsertParamConfig } from './param-config';

export function Inject<T extends Function>(token: BindingToken<T>): Function {
  return function (target: T, propertyKey: string | symbol, parameterIndex: number): T {
    if (propertyKey || typeof parameterIndex !== 'number') {
      throw new Error('Cannot apply @Inject decorator to a property.');
    }

    upsertParamConfig(target, parameterIndex, { token });

    return target;
  };
}
