import type { Container } from '../container';
import { getParamConfigs } from '../decorators/param-configs';
import { Factory } from '../factory';
import { Scope } from '../scope';
import {
  BindingConfig,
  isFactoryConfig,
  isKlassConfig,
  isValueConfig,
  KlassBindingConfig,
  ValueBindingConfig,
} from './binding-config';

export function makeFactory<T>(config: BindingConfig<T>): Factory<T> {
  if (isKlassConfig(config)) {
    return makeKlassFactory(config);
  } else if (isValueConfig(config)) {
    return makeValueFactory(config);
  } else if (isFactoryConfig(config)) {
    return config.factory;
  } else {
    throw new Error(`Incorrect BindingConfig. Either klass, value or factory is required`);
  }
}

function makeKlassFactory<T>(config: KlassBindingConfig<T>): Factory<T> {
  if (config.bind === config.klass) {
    const paramConfigs = getParamConfigs(config.klass);
    return (container: Container, requesterScope: Scope) => {
      const params = paramConfigs.map((paramConfig) => {
        try {
          return container.get(paramConfig.id, requesterScope);
        } catch (e) {
          if (paramConfig.optional) {
            return undefined;
          } else {
            throw e;
          }
        }
      });

      return new config.klass(...params);
    };
  } else {
    return (container: Container, requesterScope: Scope) =>
      container.get(config.klass, requesterScope);
  }
}

function makeValueFactory<T>(config: ValueBindingConfig<T>): Factory<T> {
  return () => config.value;
}
