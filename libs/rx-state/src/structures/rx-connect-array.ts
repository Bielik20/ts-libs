import { BehaviorSubject, Observable } from 'rxjs';
import { ConnectionManager, ConnectionManagerConfig } from '../utils/connection-manager';
import { RxArray } from './rx-array';
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
  protected readonly connectionManager: ConnectionManager<Array<TItemValue>>;

  constructor({ connecting$, ...options }: RxConnectArrayOptions<TItemKey, TItemValue>) {
    super(options);
    this.connectionManager = new ConnectionManager(options, {
      connecting: connecting$ && (() => !connecting$.value && connecting$.next(true)),
      connected: connecting$ && (() => connecting$.value && connecting$.next(false)),
      has: () => this.get() !== undefined,
      get$: () => this.get$() as Observable<Array<TItemValue>>,
      set: (value) => this.set(value),
    });
  }

  set(itemsToSet: ReadonlyArray<TItemValue>): void {
    this.connectionManager.validate();
    return super.set(itemsToSet);
  }

  modify(func: (current: Array<TItemValue>) => ReadonlyArray<TItemValue>): void {
    this.connectionManager.validate();
    return super.modify(func);
  }

  connect$(factory: () => Observable<Array<TItemValue>>): Observable<ReadonlyArray<TItemValue>> {
    return this.connectionManager.connect$(factory);
  }

  invalidate(): void {
    return this.connectionManager.invalidate();
  }
}
