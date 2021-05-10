import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { isNotUndefined } from '../utils/is-not-undefined';

export function omitUndefined() {
  return <T>(source: Observable<T | undefined>): Observable<T> =>
    source.pipe(filter(isNotUndefined));
}
