import { defer, EMPTY, merge, Observable } from 'rxjs';
import { exhaustMap, switchMap, tap } from 'rxjs/operators';
import { ObservablesCache } from './observables-cache';

export interface ConnectionsManagerConfig<TKey, TValue> {
  timeout?: number;
  scope?: 'single' | 'all';
  strategy?: 'eager' | 'lazy';
  has: (key: TKey) => boolean;
  get$: (key: TKey) => Observable<TValue>;
  set: (key: TKey, value: TValue) => void;
  connecting?: (key: TKey) => void;
  connected?: (key: TKey) => void;
}

/**
 * Essentially to mark "very long time"
 */
const WEEK = 604800000;

export class ConnectionsManager<TKey, TValue> {
  protected readonly expiresAtMap = new Map<TKey, number>();
  protected readonly cache = new ObservablesCache<TKey, TValue>();
  protected readonly connecting: (key: TKey) => void;
  protected readonly connected: (key: TKey) => void;
  protected readonly has: (key: TKey) => boolean;
  protected readonly get$: (key: TKey) => Observable<TValue>;
  protected readonly set: (key: TKey, value: TValue) => void;
  protected readonly timeout: number;
  protected readonly scope: 'single' | 'all';
  protected readonly strategy: 'eager' | 'lazy';

  constructor(config: ConnectionsManagerConfig<TKey, TValue>) {
    this.connecting = config.connecting || (() => null);
    this.connected = config.connected || (() => null);
    this.has = config.has;
    this.get$ = config.get$;
    this.set = config.set;
    this.timeout = config.timeout ?? WEEK;
    this.scope = config.scope || 'single';
    this.strategy = config.strategy || 'eager';
  }

  connect$(key: TKey, factory: () => Observable<TValue>): Observable<TValue> {
    return defer(() => {
      const expiresAt = this.expiresAtMap.get(key);

      if (this.cache.has(key)) {
        return this.cache.get(key)!;
      }

      if (!this.has(key)) {
        return this.connectEagerly(key, factory);
      }

      if (Date.now() < expiresAt!) {
        return this.get$(key);
      }

      const wasManuallyInvalidated = expiresAt === undefined;
      if (this.scope === 'all' && !wasManuallyInvalidated) {
        this.invalidateAll();
      }

      if (this.strategy === 'eager') {
        return this.connectEagerly(key, factory);
      }

      return this.connectLazily(key, factory);
    });
  }

  protected connectEagerly(key: TKey, factory: () => Observable<TValue>): Observable<TValue> {
    return this.cache.ensure(key, () =>
      this.executeFactory(key, factory).pipe(exhaustMap(() => this.get$(key))),
    );
  }

  protected connectLazily(key: TKey, factory: () => Observable<TValue>): Observable<TValue> {
    return this.cache.ensure(key, () =>
      merge(this.get$(key), this.executeFactory(key, factory).pipe(switchMap(() => EMPTY))),
    );
  }

  protected executeFactory(key: TKey, factory: () => Observable<TValue>): Observable<TValue> {
    this.connecting(key);

    return factory().pipe(
      tap({
        next: (value) => {
          this.connected(key);
          this.set(key, value);
        },
        error: () => {
          this.connected(key);
        },
        complete: () => {
          this.cache.delete(key);
        },
      }),
    );
  }

  validate(key: TKey): void {
    this.expiresAtMap.set(key, Date.now() + this.timeout);
  }

  invalidate(key: TKey): void {
    this.expiresAtMap.delete(key);
  }

  invalidateAll(): void {
    this.expiresAtMap.clear();
  }
}
