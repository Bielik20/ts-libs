import { RxArrays, RxArraysOptions, RxMap, RxMapKey, RxMapValue } from '@ns3/rx-state';
import { Observable } from 'rxjs';

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

  remove(...itemKeysToRemove: ReadonlyArray<TItemKey>): void {
    return this.rxArrays.remove('only', ...itemKeysToRemove);
  }

  delete(): void {
    return this.rxArrays.delete('only');
  }
}
