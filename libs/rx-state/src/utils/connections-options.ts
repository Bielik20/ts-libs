import { RxSet } from '../structures/rx-set';
import { ConnectionsManagerConfig } from './connections-manager';

export type ConnectionsOptions<TKey> = Pick<
  ConnectionsManagerConfig<TKey, unknown>,
  'timeout' | 'scope' | 'strategy'
>;

export type ConnectionsHooks<TKey> =
  | { connectingSet: RxSet<TKey> }
  | Pick<ConnectionsManagerConfig<TKey, unknown>, 'connecting' | 'connected'>;

export function normalizeConnectionsHooks<TKey>(
  input: ConnectionsHooks<TKey>,
): Pick<ConnectionsManagerConfig<TKey, unknown>, 'connecting' | 'connected'> {
  if ('connectingSet' in input) {
    return {
      connecting: (key) => input.connectingSet.add(key),
      connected: (key) => input.connectingSet.delete(key),
    };
  }

  return input;
}
