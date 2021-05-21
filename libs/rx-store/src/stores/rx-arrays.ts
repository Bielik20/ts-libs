import { isNotUndefined } from '@ns3/ts-utils';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Change, makeChange } from '../models/change';
import { RxMap, RxMapKey, RxMapValue } from './rx-map';

export interface RxArraysOptions<TMapKey, TMapValue> {
  itemsMap: RxMap<TMapKey, TMapValue>;
  keyMapper: (value: TMapValue) => TMapKey;
}

export class RxArrays<
  TKey,
  TItemsMap extends RxMap<unknown, unknown>,
  TItemKey = RxMapKey<TItemsMap>,
  TItemValue = RxMapValue<TItemsMap>
> {
  protected readonly itemsMap: RxMap<TItemKey, TItemValue>;
  protected readonly keyMapper: (value: TItemValue) => TItemKey;
  protected readonly map = new Map<TKey, BehaviorSubject<ReadonlyArray<TItemKey> | undefined>>();
  protected readonly changeSubject$ = new Subject<Change<TKey, ReadonlyArray<TItemKey>>>();
  readonly change$ = this.changeSubject$.asObservable();

  constructor({ itemsMap, keyMapper }: RxArraysOptions<TItemKey, TItemValue>) {
    this.itemsMap = itemsMap;
    this.keyMapper = keyMapper;
  }

  get(key: TKey): Observable<ReadonlyArray<TItemValue> | undefined> {
    return this.ensure(key).pipe(
      switchMap((keys) => {
        if (keys === undefined) {
          return of(undefined);
        }
        return of(keys).pipe(
          switchMap((ids) => combineLatest(ids.map((id) => this.itemsMap.get(id)))),
          map((values) => values.filter(isNotUndefined)),
        );
      }),
    );
  }

  set(key: TKey, values: ReadonlyArray<TItemValue>): void {
    values.forEach((product) => this.itemsMap.set(this.keyMapper(product), product));
    this.updateValue(key, values.map(this.keyMapper));
  }

  delete(key: TKey): void {
    this.updateValue(key, undefined);
  }

  clear(): void {
    this.map.forEach((value, key) => this.delete(key));
  }

  protected updateValue(key: TKey, value: ReadonlyArray<TItemKey>): boolean {
    const value$ = this.ensure(key);
    const oldValue = value$.value;

    if (value === oldValue) {
      return false;
    }

    value$.next(value);
    this.changeSubject$.next(makeChange(key, oldValue, value));

    return true;
  }

  protected ensure(key: TKey): BehaviorSubject<ReadonlyArray<TItemKey> | undefined> {
    if (!this.map.has(key)) {
      this.map.set(key, new BehaviorSubject<ReadonlyArray<TItemKey> | undefined>(undefined));
    }

    return this.map.get(key);
  }
}
