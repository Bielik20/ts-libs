import { Observable } from 'rxjs';
import { ConnectionManager } from '../utils/connection-manager';
import {
  ConnectionHooks,
  ConnectionOptions,
  normalizeConnectionHooks,
} from '../utils/connection-options';
import { RxArray } from './rx-array';
import { RxArraysOptions } from './rx-arrays';
import { RxMap, RxMapKey, RxMapValue } from './rx-map';

type RxConnectArrayOptions<TMapKey, TMapValue> = RxArraysOptions<TMapKey, TMapValue> &
  ConnectionOptions &
  ConnectionHooks;

export class RxConnectArray<
  TItemsMap extends RxMap<unknown, unknown>,
  TItemKey = RxMapKey<TItemsMap>,
  TItemValue = RxMapValue<TItemsMap>
> extends RxArray<TItemsMap, TItemKey, TItemValue> {
  protected readonly connectionManager: ConnectionManager<Array<TItemValue>>;

  constructor(options: RxConnectArrayOptions<TItemKey, TItemValue>) {
    super(options);
    this.connectionManager = new ConnectionManager({
      ...options,
      ...normalizeConnectionHooks(options),
      has: () => this.get() !== undefined,
      get$: () => this.get$() as Observable<Array<TItemValue>>,
      set: (value) => this.set(value),
    });
  }

  set(itemsToSet: ReadonlyArray<TItemValue>): void {
    this.connectionManager.validate();
    return super.set(itemsToSet);
  }

  modify(func: (current: Array<TItemValue>) => ReadonlyArray<TItemValue>): void {
    this.connectionManager.validate();
    return super.modify(func);
  }

  connect$(factory: () => Observable<Array<TItemValue>>): Observable<ReadonlyArray<TItemValue>> {
    return this.connectionManager.connect$(factory);
  }

  invalidate(): void {
    return this.connectionManager.invalidate();
  }
}
