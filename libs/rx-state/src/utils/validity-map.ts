import { defer, EMPTY, merge, Observable } from 'rxjs';
import { exhaustMap, switchMap, tap } from 'rxjs/operators';
import { ConnectingSet, noopConnectingSet } from '../models/connecting-set';

export interface ValidityMapConfig {
  timeout: number;
  scope: 'single' | 'all';
  strategy: 'eager' | 'lazy';
}

export interface ValidityMapHooks<TKey, TValue> {
  connectingSet?: ConnectingSet<TKey>;
  get: (key: TKey) => Observable<TValue | undefined>;
  set: (key: TKey, value: TValue) => void;
}

export class ValidityMap<TKey, TValue> {
  protected readonly expiresAtMap = new Map<TKey, number>();
  protected readonly connectingSet: ConnectingSet<TKey>;

  constructor(
    protected readonly config: ValidityMapConfig,
    protected readonly hooks: ValidityMapHooks<TKey, TValue>,
  ) {
    this.connectingSet = hooks.connectingSet || noopConnectingSet;
  }

  connect$(key: TKey, factory: () => Observable<TValue>): Observable<TValue | undefined> {
    return defer(() => {
      const expiresAt = this.expiresAtMap.get(key);

      if (expiresAt === undefined) {
        return this.connectEagerly(key, factory);
      }

      if (Date.now() < expiresAt) {
        return this.hooks.get(key);
      }

      if (this.config.scope === 'all') {
        this.invalidateAll();
      }

      if (this.config.strategy === 'eager') {
        return this.connectEagerly(key, factory);
      }

      return this.connectLazily(key, factory);
    });
  }

  protected connectEagerly(
    key: TKey,
    factory: () => Observable<TValue>,
  ): Observable<TValue | undefined> {
    return this.executeFactory(key, factory).pipe(exhaustMap(() => this.hooks.get(key)));
  }

  protected connectLazily(
    key: TKey,
    factory: () => Observable<TValue>,
  ): Observable<TValue | undefined> {
    return merge(
      this.hooks.get(key),
      this.executeFactory(key, factory).pipe(switchMap(() => EMPTY)),
    );
  }

  protected executeFactory(key: TKey, factory: () => Observable<TValue>): Observable<TValue> {
    this.connectingSet.add(key);

    return factory().pipe(
      tap({
        next: (value) => {
          this.connectingSet.delete(key);
          this.hooks.set(key, value);
        },
        error: () => this.connectingSet.delete(key),
      }),
    );
  }

  validate(key: TKey): void {
    this.expiresAtMap.set(key, Date.now() + this.config.timeout);
  }

  invalidate(key: TKey): void {
    this.expiresAtMap.delete(key);
  }

  invalidateAll(): void {
    this.expiresAtMap.clear();
  }
}
