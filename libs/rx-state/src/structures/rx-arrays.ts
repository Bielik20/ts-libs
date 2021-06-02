import { isNotUndefined } from '@ns3/ts-utils';
import { BehaviorSubject, Observable } from 'rxjs';
import { mapKeysToValues } from '../utils/map-keys-to-values';
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
  protected readonly map = new Map<TKey, BehaviorSubject<Array<TItemKey> | undefined>>();

  constructor({ itemsMap, keyMapper }: RxArraysOptions<TItemKey, TItemValue>) {
    this.itemsMap = itemsMap;
    this.keyMapper = keyMapper;
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
  }

  append(key: TKey, itemsToAppend: ReadonlyArray<TItemValue>): void {
    const [itemKeys, itemsEntries] = this.mapKeysAndEntries(itemsToAppend);
    const currentItemsKeys = this.ensure(key).value || [];

    this.itemsMap.setEntries(itemsEntries);
    this.updateValue(key, [...currentItemsKeys, ...itemKeys]);
  }

  prepend(key: TKey, itemsToPrepend: ReadonlyArray<TItemValue>): void {
    const [itemKeys, itemsEntries] = this.mapKeysAndEntries(itemsToPrepend);
    const currentItemsKeys = this.ensure(key).value || [];

    this.itemsMap.setEntries(itemsEntries);
    this.updateValue(key, [...itemKeys, ...currentItemsKeys]);
  }

  removeItems(key: TKey, itemKeysToRemove: ReadonlyArray<TItemKey>): void {
    const currentItemKeys = this.ensure(key).value || [];
    const updatedItemKeys = currentItemKeys.filter(
      (itemKey) => !itemKeysToRemove.includes(itemKey),
    );

    this.updateValue(key, updatedItemKeys);
  }

  delete(key: TKey): void {
    this.updateValue(key, undefined);
  }

  clear(): void {
    this.map.forEach((value, key) => this.delete(key));
  }

  protected mapKeysAndEntries(
    items: ReadonlyArray<TItemValue>,
  ): [keys: TItemKey[], entries: [TItemKey, TItemValue][]] {
    const keys: TItemKey[] = [];
    const entries: [TItemKey, TItemValue][] = [];

    for (const value of items) {
      const key = this.keyMapper(value);

      keys.push(key);
      entries.push([key, value]);
    }

    return [keys, entries];
  }

  protected updateValue(key: TKey, updatedItemKeys: Array<TItemKey> | undefined): void {
    this.ensure(key).next(updatedItemKeys);
  }

  protected ensure(key: TKey): BehaviorSubject<Array<TItemKey> | undefined> {
    if (!this.map.has(key)) {
      this.map.set(key, new BehaviorSubject<Array<TItemKey> | undefined>(undefined));
    }

    return this.map.get(key)!;
  }
}
