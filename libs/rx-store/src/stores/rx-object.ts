import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

// eslint-disable-next-line @typescript-eslint/ban-types
export class RxObject<T extends object> extends BehaviorSubject<T> {
  constructor(protected readonly initialValue: T) {
    super(initialValue);
  }

  fragment<TKey extends keyof T>(
    key: TKey,
    compare?: (x: T[TKey], y: T[TKey]) => boolean,
  ): Observable<T[TKey]> {
    return this.pipe(
      map((value) => value[key]),
      distinctUntilChanged(compare),
    );
  }

  patch(value: Partial<T>): void {
    this.next({ ...this.value, ...value });
  }

  reset(): void {
    this.next(this.initialValue);
  }
}
