import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, mergeMap, tap } from 'rxjs/operators';

export class RxMapStore<TKey, TValue> {
  private map = new Map<TKey, BehaviorSubject<TValue | undefined>>();

  get(key: TKey): Observable<TValue | undefined> {
    return this.ensure(key).asObservable();
  }

  set(key: TKey, value: TValue): void {
    const subject$ = this.ensure(key);

    subject$.next(value);
  }

  remove(key: TKey): void {
    if (!this.map.has(key)) {
      return;
    }

    const subject$ = this.map.get(key);

    subject$.next(undefined);
    this.map.delete(key);
  }

  connect(key: TKey, stream$: () => Observable<TValue>): Observable<TValue> {
    if (this.map.has(key)) {
      return this.get(key);
    }

    return stream$().pipe(
      tap((value) => this.set(key, value)),
      catchError((error) => throwError(error)),
      mergeMap(() => this.get(key)),
    );
  }

  private ensure(key: TKey): BehaviorSubject<TValue> {
    if (!this.map.has(key)) {
      this.map.set(key, new BehaviorSubject<TValue>(undefined));
    }

    return this.map.get(key);
  }
}
