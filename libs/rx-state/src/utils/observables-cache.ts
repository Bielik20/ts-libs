import { tapTeardown } from '@ns3/ts-utils';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

export class ObservablesCache<TKey, TValue> extends Map<TKey, Observable<TValue>> {
  constructor() {
    super();
  }

  ensure(key: TKey, factory: () => Observable<TValue>): Observable<TValue> {
    if (this.has(key)) {
      return this.get(key)!;
    }

    const observable = this.makeCacheableObservable(key, factory);

    this.set(key, observable);

    return observable;
  }

  private makeCacheableObservable(
    key: TKey,
    factory: () => Observable<TValue>,
  ): Observable<TValue> {
    return factory().pipe(
      tapTeardown(() => this.delete(key)),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }
}
