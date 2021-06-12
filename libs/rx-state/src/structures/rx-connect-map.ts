import { Observable } from 'rxjs';
import { ConnectionsManager } from '../utils/connections-manager';
import {
  ConnectionsHooks,
  ConnectionsOptions,
  normalizeConnectionsHooks,
} from '../utils/connections-options';
import { RxMap } from './rx-map';

type RxConnectMapOptions<TKey> = ConnectionsOptions<TKey> & ConnectionsHooks<TKey>;

export class RxConnectMap<TKey, TValue> extends RxMap<TKey, TValue> {
  protected readonly connectionsManager: ConnectionsManager<TKey, TValue>;

  constructor(options: RxConnectMapOptions<TKey>) {
    super();
    this.connectionsManager = new ConnectionsManager({
      ...options,
      ...normalizeConnectionsHooks(options),
      has: (key) => this.get(key) !== undefined,
      get$: (key) => this.get$(key) as Observable<TValue>,
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
