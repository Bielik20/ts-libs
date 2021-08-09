import { BehaviorSubject } from 'rxjs';
import { ConnectionManagerConfig } from './connection-manager';

export type ConnectionOptions = Pick<ConnectionManagerConfig<unknown>, 'timeout' | 'strategy'>;

export type ConnectionHooks =
  | { connecting$$: BehaviorSubject<boolean> }
  | Pick<ConnectionManagerConfig<unknown>, 'connecting' | 'connected'>;

export function normalizeConnectionHooks(
  input: ConnectionHooks,
): Pick<ConnectionManagerConfig<unknown>, 'connecting' | 'connected'> {
  if ('connecting$$' in input) {
    return {
      connecting: () => !input.connecting$$.value && input.connecting$$.next(true),
      connected: () => input.connecting$$.value && input.connecting$$.next(false),
    };
  }
  return input;
}
