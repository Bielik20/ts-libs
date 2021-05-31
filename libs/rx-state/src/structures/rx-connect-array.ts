import { ConnectionManager, ConnectionManagerConfig, RxArray } from '@ns3/rx-state';
import { BehaviorSubject, Observable } from 'rxjs';
import { RxArraysOptions } from './rx-arrays';
import { RxMap, RxMapKey, RxMapValue } from './rx-map';

interface RxConnectArrayOptions<TMapKey, TMapValue>
  extends ConnectionManagerConfig,
    RxArraysOptions<TMapKey, TMapValue> {
  connecting$?: BehaviorSubject<boolean>;
}

export class RxConnectArray<
  TItemsMap extends RxMap<unknown, unknown>,
  TItemKey = RxMapKey<TItemsMap>,
  TItemValue = RxMapValue<TItemsMap>
> extends RxArray<TItemsMap, TItemKey, TItemValue> {
  protected readonly connectionManager: ConnectionManager<ReadonlyArray<TItemValue>>;

  constructor({ connecting$, ...options }: RxConnectArrayOptions<TItemKey, TItemValue>) {
    super(options);
    this.connectionManager = new ConnectionManager(options, {
      connecting: connecting$ && (() => connecting$.value !== true && connecting$.next(true)),
      connected: connecting$ && (() => connecting$.value !== false && connecting$.next(false)),
      has: () => this.get() !== undefined,
      get$: () => this.get$(),
      set: (value) => this.set(value),
    });
  }

  set(itemsToSet: ReadonlyArray<TItemValue>): void {
    this.connectionManager.validate();
    return super.set(itemsToSet);
  }

  append(itemsToAppend: ReadonlyArray<TItemValue>): void {
    this.connectionManager.validate();
    return super.append(itemsToAppend);
  }

  prepend(itemsToPrepend: ReadonlyArray<TItemValue>): void {
    this.connectionManager.validate();
    return super.prepend(itemsToPrepend);
  }

  removeItems(itemKeysToRemove: ReadonlyArray<TItemKey>): void {
    this.connectionManager.validate();
    return super.removeItems(itemKeysToRemove);
  }

  connect$(
    factory: () => Observable<ReadonlyArray<TItemValue>>,
  ): Observable<ReadonlyArray<TItemValue>> {
    return this.connectionManager.connect$(factory);
  }

  invalidate(): void {
    return this.connectionManager.invalidate();
  }
}
