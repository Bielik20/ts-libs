import { Observable } from 'rxjs';
import { ConnectingSet } from '../models/connecting-set';
import { ValidityMap, ValidityMapConfig } from '../utils/validity-map';
import { RxArrays, RxArraysOptions } from './rx-arrays';
import { RxMap, RxMapKey, RxMapValue } from './rx-map';

interface RxConnectArraysOptions<TKey, TMapKey, TMapValue>
  extends ValidityMapConfig,
    RxArraysOptions<TMapKey, TMapValue> {
  connectingSet?: ConnectingSet<TKey>;
}

export class RxConnectArrays<
  TKey,
  TItemsMap extends RxMap<unknown, unknown>,
  TItemKey = RxMapKey<TItemsMap>,
  TItemValue = RxMapValue<TItemsMap>
> extends RxArrays<TKey, TItemsMap, TItemKey, TItemValue> {
  protected readonly validityMap: ValidityMap<TKey, ReadonlyArray<TItemValue>>;

  constructor(options: RxConnectArraysOptions<TKey, TItemKey, TItemValue>) {
    super(options);
    this.validityMap = new ValidityMap(options, {
      connectingSet: options.connectingSet,
      get: (key) => this.get$(key),
      set: (key, value) => this.set(key, value),
    });
  }

  connect$(
    key: TKey,
    factory: () => Observable<ReadonlyArray<TItemValue>>,
  ): Observable<ReadonlyArray<TItemValue> | undefined> {
    return this.validityMap.connect$(key, factory);
  }

  invalidate(key: TKey): void {
    return this.validityMap.invalidate(key);
  }

  invalidateAll(): void {
    return this.validityMap.invalidateAll();
  }

  protected updateValue(key: TKey, value: Array<TItemKey> | undefined): void {
    value === undefined ? this.validityMap.invalidate(key) : this.validityMap.validate(key);

    return super.updateValue(key, value);
  }
}
