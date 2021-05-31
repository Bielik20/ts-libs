import { Observable } from 'rxjs';
import { ConnectingSet } from '../models/connecting-set';
import { ValidityMap, ValidityMapConfig } from '../utils/validity-map';
import { RxMap } from './rx-map';

interface RxConnectMapOptions<TKey> extends ValidityMapConfig {
  connectingSet?: ConnectingSet<TKey>;
}

export class RxConnectMap<TKey, TValue> extends RxMap<TKey, TValue> {
  protected readonly validityMap: ValidityMap<TKey, TValue>;

  constructor({ connectingSet, ...options }: RxConnectMapOptions<TKey>) {
    super();
    this.validityMap = new ValidityMap(options, {
      connecting: connectingSet && ((key) => connectingSet.add(key)),
      connected: connectingSet && ((key) => connectingSet.delete(key)),
      has: (key) => this.get(key) !== undefined,
      get$: (key) => this.get$(key),
      set: (key, value) => this.set(key, value),
    });
  }

  connect$(key: TKey, factory: () => Observable<TValue>): Observable<TValue | undefined> {
    return this.validityMap.connect$(key, factory);
  }

  invalidate(key: TKey): void {
    return this.validityMap.invalidate(key);
  }

  invalidateAll(): void {
    return this.validityMap.invalidateAll();
  }

  protected updateValue(key: TKey, value: TValue | undefined): boolean {
    this.validityMap.validate(key);

    return super.updateValue(key, value);
  }
}
