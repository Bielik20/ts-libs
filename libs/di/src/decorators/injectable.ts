import { Klass } from '../klass';
import { InjectableConfig, setInjectableConfig } from './injectable-config';
import { getDesignParamTypes, hasParamTypes, setParamTypes } from './param-types';

export function Injectable<R>(config: Partial<InjectableConfig<R>> = {}) {
  return function <T extends Klass<R>>(target: T): T {
    if (hasParamTypes(target)) {
      throw new Error('Cannot apply @Injectable decorator multiple times.');
    }

    const types = getDesignParamTypes(target) || [];

    setParamTypes(target, types);
    setInjectableConfig<R>(target, normalise(config, target));

    return target;
  };
}

function normalise<T>(config: Partial<InjectableConfig<T>>, target: Klass<T>): InjectableConfig<T> {
  if ('klass' in config || 'value' in config || 'factory' in config) {
    return config as InjectableConfig<T>;
  }

  return {
    ...config,
    klass: target,
  };
}
