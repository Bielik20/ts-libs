import { tapTeardown } from '@ns3/ts-utils';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

export class ObservablesCache<TKey, TValue> {
  private readonly map = new Map<TKey, Observable<TValue>>();

  get$(key: TKey): Observable<TValue> | undefined {
    return this.map.get(key);
  }

  delete(key: TKey): boolean {
    return this.map.delete(key);
  }

  has(key: TKey): boolean {
    return this.map.has(key);
  }

  ensure$(key: TKey, factory: () => Observable<TValue>): Observable<TValue> {
    if (this.has(key)) {
      return this.map.get(key)!;
    }

    const observable = this.makeCacheableObservable(key, factory);

    this.map.set(key, observable);

    return observable;
  }

  private makeCacheableObservable(
    key: TKey,
    factory: () => Observable<TValue>,
  ): Observable<TValue> {
    return factory().pipe(
      tapTeardown(() => this.map.delete(key)),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }
}
