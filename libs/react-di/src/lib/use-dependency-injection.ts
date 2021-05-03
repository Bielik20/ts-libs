import { Container } from '@wikia/dependency-injection';
import { flattenDeep } from 'lodash';
import { useMemo } from 'react';

export type Dependency = Parameters<Container['bind']>[0];
type Dependencies = (Dependency | Dependencies)[];

export function useDependencyInjection(dependencies: Dependencies = []): Container {
  return useMemo(() => {
    const container = new Container();
    const flattenDependencies = flattenDeep<Dependency>(dependencies);

    flattenDependencies
      .filter((dependency) => dependency)
      .forEach((dependency) => container.bind(dependency));

    return container;
  }, []);
}
