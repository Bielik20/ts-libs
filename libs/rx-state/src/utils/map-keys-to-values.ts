import { isNotUndefined } from '@ns3/ts-utils';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { RxMap } from '../structures/rx-map';

export function mapKeysToValues<TKey, TValue>(itemsMap: RxMap<TKey, TValue>) {
  return (
    source: Observable<ReadonlyArray<TKey> | undefined>,
  ): Observable<Array<TValue> | undefined> =>
    source.pipe(
      switchMap((itemsKeys) => {
        if (itemsKeys === undefined) {
          return of(undefined);
        }
        if (itemsKeys.length === 0) {
          return of([]);
        }
        return of(itemsKeys).pipe(
          switchMap((itemsKeys) =>
            combineLatest(itemsKeys.map((itemKey) => itemsMap.get$(itemKey))),
          ),
          map((values) => values.filter(isNotUndefined)),
        );
      }),
    );
}
