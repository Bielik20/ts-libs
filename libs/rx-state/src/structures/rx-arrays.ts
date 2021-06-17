import { isNotUndefined } from '@ns3/ts-utils';
import { BehaviorSubject, Observable } from 'rxjs';
import { mapKeysToValues } from '../utils/map-keys-to-values';
import { RxMap, RxMapKey, RxMapValue } from './rx-map';

export interface RxArraysOptions<TMapKey, TMapValue> {
  itemsMap: RxMap<TMapKey, TMapValue>;
  itemKey: (value: TMapValue) => TMapKey;
}

export class RxArrays<
  TKey,
  TItemsMap extends RxMap<unknown, unknown>,
  TItemKey = RxMapKey<TItemsMap>,
  TItemValue = RxMapValue<TItemsMap>
> {
  protected readonly $$ = new BehaviorSubject<void>(undefined);
  protected readonly itemsMap: RxMap<TItemKey, TItemValue>;
  protected readonly itemKey: (value: TItemValue) => TItemKey;
  protected readonly map = new Map<TKey, BehaviorSubject<Array<TItemKey> | undefined>>();

  constructor({ itemsMap, itemKey }: RxArraysOptions<TItemKey, TItemValue>) {
    this.itemsMap = itemsMap;
    this.itemKey = itemKey;
  }

  get$(key: TKey): Observable<Array<TItemValue> | undefined> {
    return this.ensure(key).pipe(mapKeysToValues(this.itemsMap));
  }

  get(key: TKey): Array<TItemValue> | undefined {
    const itemKeys = this.ensure(key).value;

    if (!itemKeys) {
      return undefined;
    }

    return itemKeys.map((itemKey) => this.itemsMap.get(itemKey)).filter(isNotUndefined);
  }

  set(key: TKey, itemsToSet: ReadonlyArray<TItemValue>): void {
    const [itemKeys, itemsEntries] = this.mapKeysAndEntries(itemsToSet);

    this.itemsMap.setEntries(itemsEntries);
    this.updateValue(key, itemKeys);
    this.$$.next();
  }

  modify(key: TKey, func: (current: Array<TItemValue>) => ReadonlyArray<TItemValue>): void {
    const current = this.get(key) || [];
    const updated = func(current);

    return this.set(key, updated);
  }

  delete(key: TKey): void {
    const changed = this.updateValue(key, undefined);

    if (changed) {
      this.$$.next();
    }
  }

  clear(): void {
    let changed = false;

    this.map.forEach((value, key) => {
      const result = this.updateValue(key, undefined);

      changed = changed || result;
    });

    if (changed) {
      this.$$.next();
    }
  }

  protected mapKeysAndEntries(
    items: ReadonlyArray<TItemValue>,
  ): [keys: TItemKey[], entries: [TItemKey, TItemValue][]] {
    const keys: TItemKey[] = [];
    const entries: [TItemKey, TItemValue][] = [];

    for (const value of items) {
      const key = this.itemKey(value);

      keys.push(key);
      entries.push([key, value]);
    }

    return [keys, entries];
  }

  protected updateValue(key: TKey, value: Array<TItemKey> | undefined): boolean {
    const value$ = this.ensure(key);

    if (value === value$.value) {
      return false;
    }

    value$.next(value);

    return true;
  }

  protected ensure(key: TKey): BehaviorSubject<Array<TItemKey> | undefined> {
    if (!this.map.has(key)) {
      this.map.set(key, new BehaviorSubject<Array<TItemKey> | undefined>(undefined));
    }

    return this.map.get(key)!;
  }
}
