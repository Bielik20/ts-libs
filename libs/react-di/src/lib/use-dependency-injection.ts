import { BindingConfig, Container } from '@ns3/di';
import { FactoryOrValue, unpackFactoryOrValue } from '@ns3/ts-utils';
import { useMemo } from 'react';

export function useDependencyInjection(
  factory: FactoryOrValue<BindingConfig<any>[]> = () => [],
): Container {
  return useMemo(() => {
    const container = Container.make();
    const dependencies = unpackFactoryOrValue(factory);

    dependencies.filter((config) => config).forEach((config) => container.set(config));

    return container;
  }, []);
}
