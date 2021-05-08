import { RxMapStore } from '@ns3/rx-store';
import { BehaviorSubject, combineLatest, Observable, of, throwError } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

type RxConnectedMapStoreOptions<TParentKey, TParentValue> = {
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
> {
  private map = new Map<TKey, BehaviorSubject<ReadonlyArray<TParentKey> | undefined>>();
  private readonly parent: RxMapStore<TParentKey, TParentValue>;
  private readonly keyMapper: (value: TParentValue) => TParentKey;

  constructor(options: RxConnectedMapStoreOptions<TParentKey, TParentValue>) {
    this.parent = options.parent;
    this.keyMapper = options.keyMapper;
  }

  get(key: TKey): Observable<ReadonlyArray<TParentValue> | undefined> {
    return this.ensure(key)
      .pipe(
        mergeMap((keys) => {
          if (keys === undefined) {
            return of(undefined);
          }
          return of(keys).pipe(
            mergeMap((ids) => combineLatest(ids.map((id) => this.parent.get(id)))),
            map((values) => values.filter((value) => !!value)),
          );
        }),
      );
  }

  set(key: TKey, values: ReadonlyArray<TParentValue>): void {
    const subject$ = this.ensure(key);

    values.forEach((product) => this.parent.set(this.keyMapper(product), product));
    subject$.next(values.map(this.keyMapper));
  }

  remove(key: TKey): void {
    if (!this.map.has(key)) {
      return;
    }

    const subject$ = this.map.get(key);

    subject$.next(undefined);
    this.map.delete(key);
  }

  connect(
    key: TKey,
    stream$: () => Observable<ReadonlyArray<TParentValue>>,
  ): Observable<ReadonlyArray<TParentValue>> {
    if (this.map.has(key)) {
      return this.get(key);
    }

    return stream$().pipe(
      tap((value) => this.set(key, value)),
      catchError((error) => throwError(error)),
      mergeMap(() => this.get(key)),
    );
  }

  private ensure(key: TKey): BehaviorSubject<ReadonlyArray<TParentKey>> {
    if (!this.map.has(key)) {
      this.map.set(key, new BehaviorSubject<ReadonlyArray<TParentKey>>(undefined));
    }

    return this.map.get(key);
  }
}
