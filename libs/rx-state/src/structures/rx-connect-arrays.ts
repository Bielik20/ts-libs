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
  protected readonly manager: ConnectionsManager<TKey, ReadonlyArray<TItemValue>>;

  constructor({ connectingSet, ...options }: RxConnectArraysOptions<TKey, TItemKey, TItemValue>) {
    super(options);
    this.manager = new ConnectionsManager(options, {
      connecting: connectingSet && ((key) => connectingSet.add(key)),
      connected: connectingSet && ((key) => connectingSet.delete(key)),
      has: (key) => this.get(key) !== undefined,
      get$: (key) => this.get$(key),
      set: (key, value) => this.set(key, value),
    });
  }

  connect$(
    key: TKey,
    factory: () => Observable<ReadonlyArray<TItemValue>>,
  ): Observable<ReadonlyArray<TItemValue> | undefined> {
    return this.manager.connect$(key, factory);
  }

  invalidate(key: TKey): void {
    return this.manager.invalidate(key);
  }

  invalidateAll(): void {
    return this.manager.invalidateAll();
  }

  protected updateValue(key: TKey, value: Array<TItemKey> | undefined): void {
    this.manager.validate(key);

    return super.updateValue(key, value);
  }
}
