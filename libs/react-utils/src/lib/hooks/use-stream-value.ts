import { FactoryOrValue, Falsy } from '@ns3/ts-utils';
import { DependencyList, useDebugValue } from 'react';
import { Observable } from 'rxjs';
import { useStream } from './use-stream';

export function useStreamValue<T>(
  factory: FactoryOrValue<Falsy | Observable<T>>,
  deps?: DependencyList,
): T | undefined {
  const result = useStream(factory, deps);
  const value = result.status === 'success' ? result.value : undefined;

  useDebugValue(value);

  return value;
}
