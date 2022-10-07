import { upsertParamConfig } from './param-config';

export function Optional<T extends Function>(): Function {
  return function (target: T, propertyKey: string | symbol, parameterIndex: number): T {
    if (propertyKey || typeof parameterIndex !== 'number') {
      throw new Error('Cannot apply @Optional decorator to a property.');
    }

    upsertParamConfig(target, parameterIndex, { optional: true });

    return target;
  };
}
