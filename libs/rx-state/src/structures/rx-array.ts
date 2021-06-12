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

  modify(func: (current: Array<TItemValue>) => ReadonlyArray<TItemValue>): void {
    return this.rxArrays.modify('only', func);
  }

  delete(): void {
    return this.rxArrays.delete('only');
  }
}
