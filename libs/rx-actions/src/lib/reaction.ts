import { Observable } from 'rxjs';

const REACTION_METADATA_KEY = '__@ns3/rx-actions_reaction__';

export type Reaction<O> = ReactionExecutor<O> & {
  /**
   * @internal
   */
  [REACTION_METADATA_KEY]: true;
};

type ReactionExecutor<O> = () => Observable<O>;

export function reaction<O>(factory: () => Observable<O>): Reaction<O> {
  const result = () => factory();

  Object.defineProperties(result, {
    [REACTION_METADATA_KEY]: { value: true },
  });

  return result as Reaction<O>;
}

export function isReaction(input: any): input is Reaction<unknown> {
  return typeof input === 'function' && REACTION_METADATA_KEY in input;
}
