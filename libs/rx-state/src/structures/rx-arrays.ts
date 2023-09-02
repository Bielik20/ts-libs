import { isNotUndefined } from '@ns3/ts-utils';
import { Observable } from 'rxjs';
import { Debuggable } from '../models/debuggable';
import { mapKeysToValues } from '../utils/map-keys-to-values';
import { RxBase } from './rx-base';
import { RxMap, RxMapKey, RxMapValue } from './rx-map';

export interface RxArraysOptions<TMapKey, TMapValue> {
  itemsMap: RxMap<TMapKey, TMapValue>;
  itemKey: (value: TMapValue) => TMapKey;
}

export class RxArrays<
    TKey,
    TItemsMap extends RxMap<any, any>,
    TItemKey = RxMapKey<TItemsMap>,
    TItemValue = RxMapValue<TItemsMap>,
  >
  extends RxBase<TKey, Array<TItemKey> | undefined>
  implements Debuggable
{
  protected readonly itemsMap: RxMap<TItemKey, TItemValue>;
  protected readonly itemKey: (value: TItemValue) => TItemKey;

  constructor({ itemsMap, itemKey }: RxArraysOptions<TItemKey, TItemValue>) {
    super(() => undefined);
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
    this.update([[key, itemKeys]]);
  }

  modify(key: TKey, func: (current: Array<TItemValue>) => ReadonlyArray<TItemValue>): void {
    const current = this.get(key) || [];
    const updated = func(current);

    return this.set(key, updated);
  }

  delete(key: TKey): void {
    this.update([[key, undefined]]);
  }

  clear(): void {
    this.update(Array.from(this.map.keys()).map((key) => [key, undefined]));
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

  protected updateImpl(key: TKey, value: Array<TItemKey> | undefined): boolean {
    const value$ = this.ensure(key);

    if (value === value$.value) {
      return false;
    }

    value$.next(value);

    return true;
  }
}
