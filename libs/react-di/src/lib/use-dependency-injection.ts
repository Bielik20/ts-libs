import { FactoryOrValue, unpackFactoryOrValue } from '@ns3/ts-utils';
import { Container } from '@wikia/dependency-injection';
import { useMemo } from 'react';

export type Dependency = Parameters<Container['bind']>[0];
type Dependencies = Dependency[];

export function useDependencyInjection(
  factory: FactoryOrValue<Dependencies> = () => [],
): Container {
  return useMemo(() => {
    const container = new Container();
    const dependencies = unpackFactoryOrValue(factory);

    dependencies
      .filter((dependency) => dependency)
      .forEach((dependency) => container.bind(dependency));

    return container;
  }, []);
}
