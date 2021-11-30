import { DEBUGGABLE_KEY, isDebuggable } from '@ns3/rx-state';
import { BehaviorSubject, map, merge, Observable } from 'rxjs';
import { getConnection } from './get-connection';
import { StateFragment } from './state-fragment';

export function RxDevtools() {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function <T extends { new (...args: any[]): {} }>(target: T): T {
    return class extends target {
      constructor(...args: any[]) {
        super(...args);

        const connection = getConnection();

        if (!connection) {
          return;
        }

        const fragments = extractStateFragments(this, target.name);

        merge(...fragments).subscribe((fragment) => connection.update(fragment));
      }
    };
  };
}

function extractStateFragments(
  record: Record<string, any>,
  parent: string,
): Observable<StateFragment>[] {
  const fragments = [];
  for (const key of Object.keys(record)) {
    const state = extractObservableIfDebuggable(record[key]);

    if (state) {
      fragments.push(createStateFragment(parent, key, state));
    }
  }

  return fragments;
}

function extractObservableIfDebuggable(input: any): Observable<unknown> | undefined {
  if (isDebuggable(input)) {
    return input[DEBUGGABLE_KEY]();
  }

  if (input instanceof BehaviorSubject) {
    return input;
  }

  return undefined;
}

function createStateFragment(
  parent: string,
  name: string,
  source: Observable<unknown>,
): Observable<StateFragment> {
  return source.pipe(map((value) => ({ parent, name, value })));
}
