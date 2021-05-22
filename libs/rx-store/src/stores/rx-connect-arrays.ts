import { Observable } from 'rxjs';
import { RxArrays, RxArraysOptions } from './rx-arrays';
import { RxMap, RxMapKey, RxMapValue } from './rx-map';
import { ValidityMap, ValidityMapConfig } from './validity-map';

interface RxConnectArraysOptions<TMapKey, TMapValue>
  extends ValidityMapConfig,
    RxArraysOptions<TMapKey, TMapValue> {}

export class RxConnectArrays<
  TKey,
  TItemsMap extends RxMap<unknown, unknown>,
  TItemKey = RxMapKey<TItemsMap>,
  TItemValue = RxMapValue<TItemsMap>
> extends RxArrays<TKey, TItemsMap, TItemKey, TItemValue> {
  protected readonly validityMap: ValidityMap<TKey, ReadonlyArray<TItemValue>>;

  constructor(options: RxConnectArraysOptions<TItemKey, TItemValue>) {
    super(options);
    this.validityMap = new ValidityMap(options, {
      get: (key) => this.get(key),
      set: (key, value) => this.set(key, value),
    });
  }

  connect(
    key: TKey,
    factory: () => Observable<ReadonlyArray<TItemValue>>,
  ): Observable<ReadonlyArray<TItemValue> | undefined> {
    return this.validityMap.connect(key, factory);
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
