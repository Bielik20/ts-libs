import { Observable } from 'rxjs';

export const DEBUGGABLE_KEY = '__@ns3/rx-state_debuggable__';

export interface Debuggable<T = unknown> {
  [DEBUGGABLE_KEY]: () => Observable<T>;
}

export function isDebuggable(input: any): input is Debuggable {
  return typeof input[DEBUGGABLE_KEY] === 'function';
}
