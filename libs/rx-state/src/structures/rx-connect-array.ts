import { Observable } from 'rxjs';
import { ConnectionHooks, ConnectionOptions } from '../utils/connection-options';
import { RxArraysOptions } from './rx-arrays';
import { RxConnectArrays } from './rx-connect-arrays';
import { RxMap, RxMapKey, RxMapValue } from './rx-map';

type RxConnectArrayOptions<TMapKey, TMapValue> = RxArraysOptions<TMapKey, TMapValue> &
  ConnectionOptions &
  ConnectionHooks;

export class RxConnectArray<
  TItemsMap extends RxMap<unknown, unknown>,
  TItemKey = RxMapKey<TItemsMap>,
  TItemValue = RxMapValue<TItemsMap>
> {
  protected readonly rxArrays: RxConnectArrays<'only', TItemsMap, TItemKey, TItemValue>;

  constructor(options: RxConnectArrayOptions<TItemKey, TItemValue>) {
    this.rxArrays = new RxConnectArrays({ ...options, scope: 'single' });
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

  connect$(factory: () => Observable<Array<TItemValue>>): Observable<ReadonlyArray<TItemValue>> {
    return this.rxArrays.connect$('only', factory);
  }

  invalidate(): void {
    return this.rxArrays.invalidate('only');
  }
}
