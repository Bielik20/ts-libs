import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { isDefined } from '../utils/is-defined';

export function onlyDefined() {
  return <T>(source: Observable<T | undefined>): Observable<T> => source.pipe(filter(isDefined));
}
