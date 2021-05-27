import { HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@ns3/http-client';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, mergeMap } from 'rxjs/operators';

export class DelayInterceptor implements HttpInterceptor {
  private readonly delay = 1000;

  intercept(req: HttpRequest, next: HttpHandler): Observable<HttpResponse> {
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
