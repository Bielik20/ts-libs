import { Observable } from 'rxjs';
import { ConnectionsManager, ConnectionsManagerConfig } from '../utils/connections-manager';
import { RxMap } from './rx-map';
import { RxSet } from './rx-set';

interface RxConnectMapOptions<TKey> extends ConnectionsManagerConfig {
  connectingSet?: RxSet<TKey>;
}

export class RxConnectMap<TKey, TValue> extends RxMap<TKey, TValue> {
  protected readonly connectionsManager: ConnectionsManager<TKey, TValue>;

  constructor({ connectingSet, ...options }: RxConnectMapOptions<TKey>) {
    super();
    this.connectionsManager = new ConnectionsManager(options, {
      connecting: connectingSet && ((key) => connectingSet.add(key)),
      connected: connectingSet && ((key) => connectingSet.delete(key)),
      has: (key) => this.get(key) !== undefined,
      get$: (key) => this.get$(key),
      set: (key, value) => this.set(key, value),
    });
  }

  set(key: TKey, value: TValue): void {
    this.connectionsManager.validate(key);
    return super.set(key, value);
  }

  setEntries(entries: ReadonlyArray<[key: TKey, value: TValue]>): void {
    entries.forEach(([key]) => this.connectionsManager.validate(key));
    return super.setEntries(entries);
  }

  connect$(key: TKey, factory: () => Observable<TValue>): Observable<TValue> {
    return this.connectionsManager.connect$(key, factory);
  }

  invalidate(key: TKey): void {
    return this.connectionsManager.invalidate(key);
  }

  invalidateAll(): void {
    return this.connectionsManager.invalidateAll();
  }
}
