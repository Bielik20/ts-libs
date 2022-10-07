import type { Container } from '../container';
import { getParamConfigs } from '../decorators/param-configs';
import { Provider } from '../provider';
import { Scope } from '../scope';
import {
  BindingConfig,
  isKlassConfig,
  isProviderConfig,
  isValueConfig,
  KlassBindingConfig,
  ValueBindingConfig,
} from './binding-config';

export function makeProvider<T>(config: BindingConfig<T>): Provider<T> {
  if (isKlassConfig(config)) {
    return makeKlassProvider(config);
  } else if (isValueConfig(config)) {
    return makeValueProvider(config);
  } else if (isProviderConfig(config)) {
    return config.provider;
  } else {
    throw new Error(`Incorrect BindingConfig. Either klass, value or provider is required`);
  }
}

function makeKlassProvider<T>(config: KlassBindingConfig<T>): Provider<T> {
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

function makeValueProvider<T>(config: ValueBindingConfig<T>): Provider<T> {
  return () => config.value;
}
