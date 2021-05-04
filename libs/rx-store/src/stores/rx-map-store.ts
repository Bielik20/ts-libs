import { BehaviorSubject, EMPTY, merge, Observable } from 'rxjs';
import { catchError, mergeMap, tap } from 'rxjs/operators';

export class RxMapStore<TKey = string, T = unknown> {
  private map = new Map<TKey, BehaviorSubject<T | undefined>>();

  get(key: TKey): Observable<T | undefined> {
    return this.ensure(key).asObservable();
  }

  set(key: TKey, value: T): Observable<T | undefined> {
    const subject$ = this.ensure(key);

    subject$.next(value);

    return subject$.asObservable();
  }

  remove(key: TKey): void {
    if (!this.map.has(key)) {
      return;
    }

    const subject$ = this.map.get(key);

    subject$.next(undefined);
    this.map.delete(key);
  }

  connect(key: TKey, stream$: () => Observable<T>): Observable<T> {
    if (this.map.has(key)) {
      return this.map.get(key).asObservable();
    }

    const subject$ = this.ensure(key);
    const update$ = stream$().pipe(
      tap((value) => subject$.next(value)),
      catchError((error) => {
        subject$.error(error);

        return EMPTY;
      }),
      mergeMap(() => EMPTY),
    );

    return merge(subject$, update$);
  }

  private ensure(key: TKey): BehaviorSubject<T> {
    if (!this.map.has(key)) {
      this.map.set(key, new BehaviorSubject<T>(undefined));
    }

    return this.map.get(key);
  }
}
