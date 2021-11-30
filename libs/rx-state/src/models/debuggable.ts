import { Observable } from 'rxjs';

/**
 * @deprecated NOT STABLE API, SUBJECT TO CHANGE WITHOUT MAJOR RELEASE
 */
export const DEBUGGABLE_KEY = '__@ns3/rx-state_debuggable__';

/**
 * @deprecated NOT STABLE API, SUBJECT TO CHANGE WITHOUT MAJOR RELEASE
 */
export interface Debuggable<T = unknown> {
  [DEBUGGABLE_KEY]: () => Observable<T>;
}

/**
 * @deprecated NOT STABLE API, SUBJECT TO CHANGE WITHOUT MAJOR RELEASE
 */
export function isDebuggable(input: any): input is Debuggable {
  return typeof input[DEBUGGABLE_KEY] === 'function';
}
