import { filter, Observable } from 'rxjs';
import { isNotUndefined } from '../utils/is-not-undefined';

export function omitUndefined() {
  return <T>(source: Observable<T | undefined>): Observable<T> =>
    source.pipe(filter(isNotUndefined));
}
