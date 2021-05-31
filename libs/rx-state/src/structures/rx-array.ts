import { Observable } from 'rxjs';
import { RxArrays, RxArraysOptions } from './rx-arrays';
import { RxMap, RxMapKey, RxMapValue } from './rx-map';

export class RxArray<
  TItemsMap extends RxMap<unknown, unknown>,
  TItemKey = RxMapKey<TItemsMap>,
  TItemValue = RxMapValue<TItemsMap>
> {
  protected readonly rxArrays: RxArrays<'only', TItemsMap, TItemKey, TItemValue>;

  constructor(options: RxArraysOptions<TItemKey, TItemValue>) {
    this.rxArrays = new RxArrays(options);
  }

  get$(): Observable<Array<TItemValue> | undefined> {
    return this.rxArrays.get$('only');
  }

  get(): Array<TItemValue> | undefined {
    return this.rxArrays.get('only');
  }

  set(itemsToSet: ReadonlyArray<TItemValue>): void {
    return this.rxArrays.set('only', itemsToSet);
  }

  append(itemsToAppend: ReadonlyArray<TItemValue>): void {
    return this.rxArrays.append('only', itemsToAppend);
  }

  prepend(itemsToPrepend: ReadonlyArray<TItemValue>): void {
    return this.rxArrays.prepend('only', itemsToPrepend);
  }

  removeItems(itemKeysToRemove: ReadonlyArray<TItemKey>): void {
    return this.rxArrays.removeItems('only', itemKeysToRemove);
  }

  delete(): void {
    return this.rxArrays.delete('only');
  }
}
