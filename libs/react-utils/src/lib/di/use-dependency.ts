import { BindingToken } from '@ns3/di';
import { useContext } from 'react';
import { DiContext } from './di-context';

export function useDependency<T>(token: BindingToken<T>): T {
  const container = useContext(DiContext);

  return container.get(token);
}
