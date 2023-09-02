import { defer, Observable, ObservableInput, ObservedValueOf, of, Subject, tap } from 'rxjs';

const ACTION_METADATA_KEY = '__@ns3/rx-actions_action__';

export type Action<I, O> = ActionExecutor<I, O> & {
  invoked$: Observable<ActionInvoked<I>>;
  succeeded$: Observable<ActionSucceeded<I, O>>;
  failed$: Observable<ActionFailed<I>>;
  completed$: Observable<ActionCompleted<I>>;
  /**
   * @internal
   */
  [ACTION_METADATA_KEY]: true;
};

type ActionExecutor<I, O> = I extends undefined ? () => Observable<O> : (input: I) => Observable<O>;

export interface ActionInvoked<I> {
  id: number;
  input: I;
}

export interface ActionSucceeded<I, O> {
  id: number;
  input: I;
  output: O;
}

export interface ActionFailed<I> {
  id: number;
  input: I;
  error: any;
}

export interface ActionCompleted<I> {
  id: number;
  input: I;
}

export function action(): Action<undefined, undefined>;
export function action(factory: () => void): Action<undefined, undefined>;
export function action<O extends ObservableInput<any>>(
  factory: () => O,
): Action<undefined, ObservedValueOf<O>>;
export function action<I, O extends ObservableInput<any>>(
  factory: (input: I) => O,
): Action<I, ObservedValueOf<O>>;
export function action<I>(factory: (input: I) => void): Action<I, undefined>;
export function action<I, O extends ObservableInput<any>>(
  factory: (input: I) => O = () => undefined as any,
): Action<I, ObservedValueOf<O>> {
  const invoked$$ = new Subject<ActionInvoked<I>>();
  const succeeded$$ = new Subject<ActionSucceeded<I, ObservedValueOf<O>>>();
  const failed$$ = new Subject<ActionFailed<I>>();
  const completed$$ = new Subject<ActionCompleted<I>>();
  let globalId = 0;

  const result = (input: I) => {
    const id = ++globalId;

    return defer(() => {
      invoked$$.next({ id, input });

      return factory(input) ?? of(undefined);
    }).pipe(
      tap({
        next: (output) => succeeded$$.next({ id, input, output }),
        error: (error) => failed$$.next({ id, input, error }),
        complete: () => completed$$.next({ id, input }),
      }),
    );
  };

  Object.defineProperties(result, {
    invoked$: { value: invoked$$.asObservable() },
    succeeded$: { value: succeeded$$.asObservable() },
    failed$: { value: failed$$.asObservable() },
    completed$: { value: completed$$.asObservable() },
    [ACTION_METADATA_KEY]: { value: true },
  });

  return result as Action<I, ObservedValueOf<O>>;
}

export function isAction(input: any): input is Action<unknown, unknown> {
  return typeof input === 'function' && ACTION_METADATA_KEY in input;
}
