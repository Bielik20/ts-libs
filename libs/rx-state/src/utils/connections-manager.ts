import { tapTeardown } from '@ns3/ts-utils';
import { defer, EMPTY, merge, Observable } from 'rxjs';
import { exhaustMap, shareReplay, switchMap, tap } from 'rxjs/operators';

export interface ConnectionsManagerConfig<TKey, TValue> {
  timeout?: number;
  scope?: 'single' | 'all';
  strategy?: 'eager' | 'lazy';
  preventMultiple?: boolean;
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
  protected readonly connectionsMap = new Map<TKey, Observable<TValue>>();
  protected readonly connecting: (key: TKey) => void;
  protected readonly connected: (key: TKey) => void;
  protected readonly has: (key: TKey) => boolean;
  protected readonly get$: (key: TKey) => Observable<TValue>;
  protected readonly set: (key: TKey, value: TValue) => void;
  protected readonly timeout: number;
  protected readonly scope: 'single' | 'all';
  protected readonly strategy: 'eager' | 'lazy';
  protected readonly preventMultiple: boolean;

  constructor(config: ConnectionsManagerConfig<TKey, TValue>) {
    this.connecting = config.connecting || (() => null);
    this.connected = config.connected || (() => null);
    this.has = config.has;
    this.get$ = config.get$;
    this.set = config.set;
    this.timeout = config.timeout ?? WEEK;
    this.scope = config.scope || 'single';
    this.strategy = config.strategy || 'eager';
    this.preventMultiple = config.preventMultiple ?? true;
  }

  connect$(key: TKey, factory: () => Observable<TValue>): Observable<TValue> {
    return defer(() => {
      const expiresAt = this.expiresAtMap.get(key);

      if (this.preventMultiple && this.connectionsMap.has(key)) {
        return this.connectionsMap.get(key)!;
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
    const connection = this.executeFactory(key, factory).pipe(exhaustMap(() => this.get$(key)));

    return this.augmentConnection(key, connection);
  }

  protected connectLazily(key: TKey, factory: () => Observable<TValue>): Observable<TValue> {
    const connection = merge(
      this.get$(key),
      this.executeFactory(key, factory).pipe(switchMap(() => EMPTY)),
    );

    return this.augmentConnection(key, connection);
  }

  protected augmentConnection(key: TKey, connection: Observable<TValue>) {
    const augmented = connection.pipe(
      tapTeardown(() => this.connectionsMap.delete(key)),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    this.connectionsMap.set(key, augmented);

    return augmented;
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
          this.connectionsMap.delete(key);
        },
        complete: () => {
          this.connectionsMap.delete(key);
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
