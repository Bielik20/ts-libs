import { Observable } from 'rxjs';
import { ConnectionsManager, ConnectionsManagerConfig } from '../utils/connections-manager';
import { RxArrays, RxArraysOptions } from './rx-arrays';
import { RxMap, RxMapKey, RxMapValue } from './rx-map';
import { RxSet } from './rx-set';

interface RxConnectArraysOptions<TKey, TMapKey, TMapValue>
  extends ConnectionsManagerConfig,
    RxArraysOptions<TMapKey, TMapValue> {
  connectingSet?: RxSet<TKey>;
}

export class RxConnectArrays<
  TKey,
  TItemsMap extends RxMap<unknown, unknown>,
  TItemKey = RxMapKey<TItemsMap>,
  TItemValue = RxMapValue<TItemsMap>
> extends RxArrays<TKey, TItemsMap, TItemKey, TItemValue> {
  protected readonly connectionsManager: ConnectionsManager<TKey, ReadonlyArray<TItemValue>>;

  constructor({ connectingSet, ...options }: RxConnectArraysOptions<TKey, TItemKey, TItemValue>) {
    super(options);
    this.connectionsManager = new ConnectionsManager(options, {
      connecting: connectingSet && ((key) => connectingSet.add(key)),
      connected: connectingSet && ((key) => connectingSet.delete(key)),
      has: (key) => this.get(key) !== undefined,
      get$: (key) => this.get$(key),
      set: (key, value) => this.set(key, value),
    });
  }

  set(key: TKey, itemsToSet: ReadonlyArray<TItemValue>): void {
    this.connectionsManager.validate(key);
    return super.set(key, itemsToSet);
  }

  append(key: TKey, itemsToAppend: ReadonlyArray<TItemValue>): void {
    this.connectionsManager.validate(key);
    return super.append(key, itemsToAppend);
  }

  prepend(key: TKey, itemsToPrepend: ReadonlyArray<TItemValue>): void {
    this.connectionsManager.validate(key);
    return super.prepend(key, itemsToPrepend);
  }

  remove(key: TKey, ...itemKeysToRemove: ReadonlyArray<TItemKey>): void {
    this.connectionsManager.validate(key);
    return super.remove(key, ...itemKeysToRemove);
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
