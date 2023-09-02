import { map, Observable } from 'rxjs';
import { Debuggable, DEBUGGABLE_KEY } from '../models/debuggable';
import { RxArrays, RxArraysOptions } from './rx-arrays';
import { RxMap, RxMapKey, RxMapValue } from './rx-map';

export class RxArray<
  TItemsMap extends RxMap<any, any>,
  TItemKey = RxMapKey<TItemsMap>,
  TItemValue = RxMapValue<TItemsMap>,
> implements Debuggable
{
  protected readonly rxArrays: RxArrays<'only', TItemsMap, TItemKey, TItemValue>;

  constructor(options: RxArraysOptions<TItemKey, TItemValue>) {
    this.rxArrays = new RxArrays(options);
  }

  [DEBUGGABLE_KEY](): Observable<unknown> {
    return this.rxArrays[DEBUGGABLE_KEY]().pipe(map(({ only }) => only));
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
