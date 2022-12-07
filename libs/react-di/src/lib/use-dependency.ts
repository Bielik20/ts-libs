import { BindingId } from '@ns3/di';
import { useContext } from 'react';
import { DiContext } from './di-context';

export function useDependency<T>(type: BindingId<T>): T {
  const container = useContext(DiContext);

  return container.get(type);
}
