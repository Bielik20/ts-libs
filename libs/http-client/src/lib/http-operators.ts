import { map, Observable } from 'rxjs';
import { AjaxResponse } from 'rxjs/ajax';

export function toResponse() {
  return <T>(source: Observable<AjaxResponse<T>>): Observable<T> =>
    source.pipe(map((res: AjaxResponse<T>) => res.response));
}
