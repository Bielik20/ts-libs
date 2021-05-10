import { BehaviorSubject, EMPTY, merge, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

export interface ValidityOptions {
  timeout: number;
  scope: 'single' | 'all';
  strategy: 'eager' | 'lazy';
}

interface ValidityObject<T> {
  value$: BehaviorSubject<T | undefined>;
  expiresAt: number;
}

export abstract class RxValidityMap<TKey, TValue, TInternal = TValue> {
  protected map = new Map<TKey, ValidityObject<TInternal>>();

  protected constructor(protected options: ValidityOptions) {}

  abstract get(key: TKey): Observable<TValue | undefined>;
  abstract set(key: TKey, value: TValue): void;

  connect(key: TKey, streamFactory: () => Observable<TValue>): Observable<TValue | undefined> {
    const { expiresAt } = this.ensure(key);

    if (expiresAt === 0) {
      return this.connectEagerly(key, streamFactory);
    }

    if (Date.now() < expiresAt) {
      return this.get(key);
    }

    if (this.options.scope === 'all') {
      this.invalidateAll();
    }

    if (this.options.strategy === 'eager') {
      return this.connectEagerly(key, streamFactory);
    }

    return this.connectLazily(key, streamFactory);
  }

  protected connectEagerly(
    key: TKey,
    streamFactory: () => Observable<TValue>,
  ): Observable<TValue | undefined> {
    return streamFactory().pipe(
      tap((value) => this.set(key, value)),
      switchMap(() => this.get(key)),
    );
  }

  protected connectLazily(
    key: TKey,
    streamFactory: () => Observable<TValue>,
  ): Observable<TValue | undefined> {
    return merge(
      this.get(key),
      streamFactory().pipe(
        tap((value) => this.set(key, value)),
        switchMap(() => EMPTY),
      ),
    );
  }

  delete(key: TKey): void {
    const { value$ } = this.updateExpiresAt(key, 0);

    value$.next(undefined);
  }

  deleteAll(): void {
    this.map.forEach((value, key) => this.delete(key));
  }

  invalidate(key: TKey): void {
    this.updateExpiresAt(key, 0);
  }

  invalidateAll(): void {
    this.map.forEach((value, key) => this.invalidate(key));
  }

  protected ensure(key: TKey): ValidityObject<TInternal> {
    if (!this.map.has(key)) {
      this.map.set(key, { value$: new BehaviorSubject(undefined), expiresAt: 0 });
    }

    return this.map.get(key);
  }

  protected updateExpiresAt(
    key: TKey,
    expiresAt = Date.now() + this.options.timeout,
  ): ValidityObject<TInternal> {
    const { value$ } = this.ensure(key);
    const update = { value$, expiresAt };

    this.map.set(key, update);

    return update;
  }
}
