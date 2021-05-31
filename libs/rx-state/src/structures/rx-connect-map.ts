import { Observable } from 'rxjs';
import { ConnectionsManager, ConnectionsManagerConfig } from '../utils/connections-manager';
import { RxMap } from './rx-map';
import { RxSet } from './rx-set';

interface RxConnectMapOptions<TKey> extends ConnectionsManagerConfig {
  connectingSet?: RxSet<TKey>;
}

export class RxConnectMap<TKey, TValue> extends RxMap<TKey, TValue> {
  protected readonly manager: ConnectionsManager<TKey, TValue>;

  constructor({ connectingSet, ...options }: RxConnectMapOptions<TKey>) {
    super();
    this.manager = new ConnectionsManager(options, {
      connecting: connectingSet && ((key) => connectingSet.add(key)),
      connected: connectingSet && ((key) => connectingSet.delete(key)),
      has: (key) => this.get(key) !== undefined,
      get$: (key) => this.get$(key),
      set: (key, value) => this.set(key, value),
    });
  }

  connect$(key: TKey, factory: () => Observable<TValue>): Observable<TValue | undefined> {
    return this.manager.connect$(key, factory);
  }

  invalidate(key: TKey): void {
    return this.manager.invalidate(key);
  }

  invalidateAll(): void {
    return this.manager.invalidateAll();
  }

  protected updateValue(key: TKey, value: TValue | undefined): boolean {
    this.manager.validate(key);

    return super.updateValue(key, value);
  }
}
