import { HttpHandler, HttpInterceptor } from '@ns3/http-client';
import { Observable, of, throwError } from 'rxjs';
import { AjaxConfig, AjaxResponse } from 'rxjs/ajax';
import { catchError, delay, mergeMap } from 'rxjs/operators';

export class DelayInterceptor implements HttpInterceptor {
  private readonly delay = 300;

  intercept<T>(req: AjaxConfig, next: HttpHandler<T>): Observable<AjaxResponse<T>> {
    return next(req).pipe(
      delay(this.delay),
      catchError((err) =>
        of(null).pipe(
          delay(this.delay),
          mergeMap(() => throwError(err)),
        ),
      ),
    );
  }
}
