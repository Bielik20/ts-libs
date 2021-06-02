import { FactoryOrValue, Falsy } from '@ns3/ts-utils';
import { DependencyList, useDebugValue } from 'react';
import { Observable } from 'rxjs';
import { useStreamInternal } from './use-stream-internal';

export function useStreamValue<T>(
  factory: FactoryOrValue<Falsy | Observable<T>>,
  deps?: DependencyList,
): T | undefined {
  const value = useStreamInternal(
    {
      initial: undefined,
      next: (v) => v,
      error: () => undefined,
    },
    factory,
    deps,
  );

  useDebugValue(value);

  return value;
}
