import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export function omitUndefined() {
  return <T>(source: Observable<T | undefined>): Observable<T> =>
    source.pipe(filter((value) => typeof value !== 'undefined'));
}
