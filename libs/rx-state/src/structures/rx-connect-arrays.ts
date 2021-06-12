import { Observable } from 'rxjs';
import { ConnectionsManager } from '../utils/connections-manager';
import {
  ConnectionsHooks,
  ConnectionsOptions,
  normalizeConnectionsHooks,
} from '../utils/connections-options';
import { RxArrays, RxArraysOptions } from './rx-arrays';
import { RxMap, RxMapKey, RxMapValue } from './rx-map';

type RxConnectArraysOptions<TKey, TMapKey, TMapValue> = RxArraysOptions<TMapKey, TMapValue> &
  ConnectionsOptions<TKey> &
  ConnectionsHooks<TKey>;

export class RxConnectArrays<
  TKey,
  TItemsMap extends RxMap<unknown, unknown>,
  TItemKey = RxMapKey<TItemsMap>,
  TItemValue = RxMapValue<TItemsMap>
> extends RxArrays<TKey, TItemsMap, TItemKey, TItemValue> {
  protected readonly connectionsManager: ConnectionsManager<TKey, ReadonlyArray<TItemValue>>;

  constructor(options: RxConnectArraysOptions<TKey, TItemKey, TItemValue>) {
    super(options);
    this.connectionsManager = new ConnectionsManager({
      ...options,
      ...normalizeConnectionsHooks(options),
      has: (key) => this.get(key) !== undefined,
      get$: (key) => this.get$(key) as Observable<Array<TItemValue>>,
      set: (key, value) => this.set(key, value),
    });
  }

  set(key: TKey, itemsToSet: ReadonlyArray<TItemValue>): void {
    this.connectionsManager.validate(key);
    return super.set(key, itemsToSet);
  }

  modify(key: TKey, func: (current: Array<TItemValue>) => ReadonlyArray<TItemValue>): void {
    this.connectionsManager.validate(key);
    return super.modify(key, func);
  }

  connect$(
    key: TKey,
    factory: () => Observable<ReadonlyArray<TItemValue>>,
  ): Observable<ReadonlyArray<TItemValue>> {
    return this.connectionsManager.connect$(key, factory);
  }

  invalidate(key: TKey): void {
    return this.connectionsManager.invalidate(key);
  }

  invalidateAll(): void {
    return this.connectionsManager.invalidateAll();
  }
}
