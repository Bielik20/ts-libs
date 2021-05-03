import { useContext } from 'react';
import { DiContext } from './di-context';
import { DiKey } from './models';

export function useDependency<T>(type: DiKey<T>): T {
  const container = useContext(DiContext);

  return container.get(type);
}
