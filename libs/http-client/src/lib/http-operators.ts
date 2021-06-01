import { Observable } from 'rxjs';
import { AjaxResponse } from 'rxjs/ajax';
import { map } from 'rxjs/operators';

export function toResponse() {
  return <T>(source: Observable<AjaxResponse<T>>): Observable<T> =>
    source.pipe(map((res: AjaxResponse<T>) => res.response));
}
