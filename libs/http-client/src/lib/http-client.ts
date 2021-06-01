import { Injectable } from '@wikia/dependency-injection';
import { Observable, of } from 'rxjs';
import { ajax, AjaxConfig, AjaxResponse } from 'rxjs/ajax';
import { concatMap } from 'rxjs/operators';
import { HttpInterceptors } from './http-interceptors';
import { HttpHandler } from './models/http-handler';

const BackendHandler = <T>(req: AjaxConfig) => {
  return ajax<T>(req);
};

@Injectable()
export class HttpClient {
  private _handler: HttpHandler<any>;

  constructor(private interceptors: HttpInterceptors) {}

  get<T = unknown>(url: string, headers?: Record<string, any>): Observable<AjaxResponse<T>> {
    return this.makeRequest<T>({ method: 'GET', url, headers });
  }

  patch<T = unknown>(
    url: string,
    body?: unknown,
    headers?: Readonly<Record<string, any>>,
  ): Observable<AjaxResponse<T>> {
    return this.makeRequest<T>({ method: 'PATCH', url, headers, body });
  }

  post<T = unknown>(
    url: string,
    body?: unknown,
    headers?: Readonly<Record<string, any>>,
  ): Observable<AjaxResponse<T>> {
    return this.makeRequest<T>({ method: 'POST', url, headers, body });
  }

  put<T = unknown>(
    url: string,
    body?: unknown,
    headers?: Readonly<Record<string, any>>,
  ): Observable<AjaxResponse<T>> {
    return this.makeRequest<T>({ method: 'PUT', url, headers, body });
  }

  delete<T = unknown>(
    url: string,
    headers?: Readonly<Record<string, any>>,
  ): Observable<AjaxResponse<T>> {
    return this.makeRequest<T>({ method: 'DELETE', url, headers });
  }

  private makeRequest<T>(req: AjaxConfig): Observable<AjaxResponse<T>> {
    const request = this.createRequest(req);
    const handler = this.getHandler<T>();

    return of(request).pipe(concatMap((req) => handler(req)));
  }

  private createRequest(req: AjaxConfig): AjaxConfig {
    return {
      ...req,
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers || {}),
      },
    };
  }

  private getHandler<T>(): HttpHandler<T> {
    if (!this._handler) {
      this._handler = this.createHandler<T>();
    }

    return this._handler;
  }

  private createHandler<T>(): HttpHandler<T> {
    const interceptors = this.interceptors.get();

    return interceptors.reduceRight<HttpHandler<T>>(
      (next, interceptor) => (req) => interceptor.intercept<T>(req, next),
      BackendHandler,
    );
  }
}
