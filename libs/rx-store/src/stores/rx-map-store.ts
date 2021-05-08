import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

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
    const subject$ = this.map.get(key);

    if (!subject$) {
      return;
    }

    subject$.next(undefined);
    this.map.delete(key);
  }

  connect(key: TKey, stream$: () => Observable<TValue>): Observable<TValue | undefined> {
    if (this.map.has(key)) {
      return this.get(key);
    }

    return stream$().pipe(
      tap((value) => this.set(key, value)),
      switchMap(() => this.get(key) as Observable<TValue>),
    );
  }

  private ensure(key: TKey): BehaviorSubject<TValue | undefined> {
    if (!this.map.has(key)) {
      this.map.set(key, new BehaviorSubject<TValue | undefined>(undefined));
    }

    return this.map.get(key) as BehaviorSubject<TValue | undefined>;
  }
}
