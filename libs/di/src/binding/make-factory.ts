import type { Container } from '../container';
import { getParamConfigs } from '../decorators/param-configs';
import { Factory } from '../factory';
import { Scope } from '../scope';
import {
  BindingConfig,
  ClassBindingConfig,
  isClassConfig,
  isFactoryConfig,
  isValueConfig,
  ValueBindingConfig,
} from './binding-config';

export function makeFactory<T>(config: BindingConfig<T>): Factory<T> {
  if (isClassConfig(config)) {
    return makeClassFactory(config);
  } else if (isValueConfig(config)) {
    return makeValueFactory(config);
  } else if (isFactoryConfig(config)) {
    return config.useFactory;
  } else {
    throw new Error(`Incorrect BindingConfig. Either class, value or factory is required`);
  }
}

function makeClassFactory<T>(config: ClassBindingConfig<T>): Factory<T> {
  if (config.token === config.useClass) {
    const paramConfigs = getParamConfigs(config.useClass);
    return (container: Container, requesterScope: Scope) => {
      const params = paramConfigs.map((paramConfig) => {
        try {
          return container.get(paramConfig.token, requesterScope);
        } catch (e) {
          if (paramConfig.optional) {
            return undefined;
          } else {
            throw e;
          }
        }
      });

      return new config.useClass(...params);
    };
  } else {
    return (container: Container, requesterScope: Scope) =>
      container.get(config.useClass, requesterScope);
  }
}

function makeValueFactory<T>(config: ValueBindingConfig<T>): Factory<T> {
  return () => config.useValue;
}
