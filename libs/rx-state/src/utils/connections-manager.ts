import { defer, EMPTY, merge, Observable } from 'rxjs';
import { exhaustMap, switchMap, tap } from 'rxjs/operators';

export interface ConnectionsManagerConfig {
  timeout?: number;
  scope: 'single' | 'all';
  strategy: 'eager' | 'lazy';
}

export interface ConnectionsManagerHooks<TKey, TValue> {
  connecting?: (key: TKey) => void;
  connected?: (key: TKey) => void;
  has: (key: TKey) => boolean;
  get$: (key: TKey) => Observable<TValue>;
  set: (key: TKey, value: TValue) => void;
}

/**
 * Essentially to mark "very long time"
 */
const WEEK = 604800000;

export class ConnectionsManager<TKey, TValue> {
  protected readonly expiresAtMap = new Map<TKey, number>();
  protected readonly connecting: (key: TKey) => void;
  protected readonly connected: (key: TKey) => void;
  protected readonly has: (key: TKey) => boolean;
  protected readonly get$: (key: TKey) => Observable<TValue>;
  protected readonly set: (key: TKey, value: TValue) => void;
  protected readonly timeout: number;
  protected readonly scope: 'single' | 'all';
  protected readonly strategy: 'eager' | 'lazy';

  constructor(config: ConnectionsManagerConfig, hooks: ConnectionsManagerHooks<TKey, TValue>) {
    this.connecting = hooks.connecting || (() => null);
    this.connected = hooks.connected || (() => null);
    this.has = hooks.has;
    this.get$ = hooks.get$;
    this.set = hooks.set;
    this.timeout = config.timeout ?? WEEK;
    this.scope = config.scope;
    this.strategy = config.strategy;
  }

  connect$(key: TKey, factory: () => Observable<TValue>): Observable<TValue> {
    return defer(() => {
      const expiresAt = this.expiresAtMap.get(key);

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
    return this.executeFactory(key, factory).pipe(exhaustMap(() => this.get$(key)));
  }

  protected connectLazily(key: TKey, factory: () => Observable<TValue>): Observable<TValue> {
    return merge(this.get$(key), this.executeFactory(key, factory).pipe(switchMap(() => EMPTY)));
  }

  protected executeFactory(key: TKey, factory: () => Observable<TValue>): Observable<TValue> {
    this.connecting(key);

    return factory().pipe(
      tap({
        next: (value) => {
          this.connected(key);
          this.set(key, value);
        },
        error: () => this.connected(key),
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
