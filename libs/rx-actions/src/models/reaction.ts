import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

const REACTION_METADATA_KEY = '__@ns3/rx-actions_reaction__';

export type Reaction<O> = ReactionExecutor<O> & {
  succeeded$: Observable<O>;
  failed$: Observable<any>;
  completed$: Observable<void>;
  /**
   * @internal
   */
  [REACTION_METADATA_KEY]: ReactionConfig;
};

type ReactionExecutor<O> = () => Observable<O>;

export interface ReactionConfig {
  /**
   * @default true
   */
  rerunFailed: boolean;
  /**
   * @default true
   */
  rerunCompleted: boolean;
}

const DEFAULT_REACTION_CONFIG: ReactionConfig = {
  rerunFailed: true,
  rerunCompleted: true,
};

export function reaction<O>(
  factory: () => Observable<O>,
  config: Partial<ReactionConfig> = {},
): Reaction<O> {
  const succeeded$$ = new Subject<O>();
  const failed$$ = new Subject<any>();
  const completed$$ = new Subject<void>();
  const result = () =>
    factory().pipe(
      tap({
        next: (output) => succeeded$$.next(output),
        error: (error) => failed$$.next(error),
        complete: () => completed$$.next(),
      }),
    );

  Object.defineProperties(result, {
    succeeded$: { value: succeeded$$.asObservable() },
    failed$: { value: failed$$.asObservable() },
    completed$: { value: completed$$.asObservable() },
    [REACTION_METADATA_KEY]: { value: { ...DEFAULT_REACTION_CONFIG, ...config } },
  });

  return result as Reaction<O>;
}

export function isReaction(input: any): input is Reaction<unknown> {
  return typeof input === 'function' && REACTION_METADATA_KEY in input;
}

export function getReactionConfig(input: Reaction<unknown>): ReactionConfig {
  return input[REACTION_METADATA_KEY];
}
