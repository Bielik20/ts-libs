import { EMPTY, merge, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

export interface ValidityMapConfig {
  timeout: number;
  scope: 'single' | 'all';
  strategy: 'eager' | 'lazy';
}

export interface ValidityMapHooks<TKey, TValue> {
  get: (key: TKey) => Observable<TValue | undefined>;
  set: (key: TKey, value: TValue) => void;
}

export class ValidityMap<TKey, TValue> {
  protected expiresAtMap = new Map<TKey, number>();

  constructor(
    protected config: ValidityMapConfig,
    protected hooks: ValidityMapHooks<TKey, TValue>,
  ) {}

  connect(key: TKey, factory: () => Observable<TValue>): Observable<TValue | undefined> {
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
  }

  protected connectEagerly(
    key: TKey,
    factory: () => Observable<TValue>,
  ): Observable<TValue | undefined> {
    return factory().pipe(
      tap((value) => this.hooks.set(key, value)),
      switchMap(() => this.hooks.get(key)),
    );
  }

  protected connectLazily(
    key: TKey,
    factory: () => Observable<TValue>,
  ): Observable<TValue | undefined> {
    return merge(
      this.hooks.get(key),
      factory().pipe(
        tap((value) => this.hooks.set(key, value)),
        switchMap(() => EMPTY),
      ),
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
