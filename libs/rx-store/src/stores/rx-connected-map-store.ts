import { isNotUndefined } from '@ns3/ts-utils';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { RxMapStore } from './rx-map-store';
import { RxValidityMap, ValidityOptions } from './rx-validity-map';

type RxConnectedMapStoreOptions<TParentKey, TParentValue> = ValidityOptions & {
  parent: RxMapStore<TParentKey, TParentValue>;
  keyMapper: (value: TParentValue) => TParentKey;
};

type ExtractKey<Type> = Type extends RxMapStore<infer X, unknown> ? X : never;
type ExtractValue<Type> = Type extends RxMapStore<unknown, infer X> ? X : never;

export class RxConnectedMapStore<
  TKey,
  TParent extends RxMapStore<unknown, unknown>,
  TParentKey = ExtractKey<TParent>,
  TParentValue = ExtractValue<TParent>
> extends RxValidityMap<TKey, ReadonlyArray<TParentValue>, ReadonlyArray<TParentKey>> {
  private readonly parent: RxMapStore<TParentKey, TParentValue>;
  private readonly keyMapper: (value: TParentValue) => TParentKey;

  constructor({
    parent,
    keyMapper,
    ...options
  }: RxConnectedMapStoreOptions<TParentKey, TParentValue>) {
    super(options);
    this.parent = parent;
    this.keyMapper = keyMapper;
  }

  get(key: TKey): Observable<ReadonlyArray<TParentValue> | undefined> {
    return this.ensure(key).value$.pipe(
      switchMap((keys) => {
        if (keys === undefined) {
          return of(undefined);
        }
        return of(keys).pipe(
          switchMap((ids) => combineLatest(ids.map((id) => this.parent.get(id)))),
          map((values) => values.filter(isNotUndefined)),
        );
      }),
    );
  }

  set(key: TKey, values: ReadonlyArray<TParentValue>): void {
    const { value$ } = this.updateExpiresAt(key);

    values.forEach((product) => this.parent.set(this.keyMapper(product), product));
    value$.next(values.map(this.keyMapper));
  }
}
