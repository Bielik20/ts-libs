import { isNotUndefined } from '@ns3/ts-utils';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { RxEntityStore } from './rx-entity-store';
import { RxValidityMap, ValidityOptions } from './rx-validity-map';

type RxArrayStoreOptions<TEntityKey, TEntityValue> = ValidityOptions & {
  entityStore: RxEntityStore<TEntityKey, TEntityValue>;
  keyMapper: (value: TEntityValue) => TEntityKey;
};

type ExtractKey<Type> = Type extends RxEntityStore<infer X, unknown> ? X : never;
type ExtractValue<Type> = Type extends RxEntityStore<unknown, infer X> ? X : never;

export class RxArrayStore<
  TKey,
  TEntityStore extends RxEntityStore<unknown, unknown>,
  TEntityKey = ExtractKey<TEntityStore>,
  TEntityValue = ExtractValue<TEntityStore>
> extends RxValidityMap<TKey, ReadonlyArray<TEntityValue>, ReadonlyArray<TEntityKey>> {
  private readonly entityStore: RxEntityStore<TEntityKey, TEntityValue>;
  private readonly keyMapper: (value: TEntityValue) => TEntityKey;

  constructor({
    entityStore,
    keyMapper,
    ...options
  }: RxArrayStoreOptions<TEntityKey, TEntityValue>) {
    super(options);
    this.entityStore = entityStore;
    this.keyMapper = keyMapper;
  }

  get(key: TKey): Observable<ReadonlyArray<TEntityValue> | undefined> {
    return this.ensure(key).value$.pipe(
      switchMap((keys) => {
        if (keys === undefined) {
          return of(undefined);
        }
        return of(keys).pipe(
          switchMap((ids) => combineLatest(ids.map((id) => this.entityStore.get(id)))),
          map((values) => values.filter(isNotUndefined)),
        );
      }),
    );
  }

  set(key: TKey, values: ReadonlyArray<TEntityValue>): void {
    const { value$ } = this.updateExpiresAt(key);

    values.forEach((product) => this.entityStore.set(this.keyMapper(product), product));
    value$.next(values.map(this.keyMapper));
  }
}
