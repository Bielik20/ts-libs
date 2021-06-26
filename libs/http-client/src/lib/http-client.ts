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
  private _handler!: HttpHandler<any>;

  constructor(private interceptors: HttpInterceptors) {}

  get<T = unknown>(
    url: string,
    config: Omit<AjaxConfig, 'url' | 'method'> = {},
  ): Observable<AjaxResponse<T>> {
    return this.makeRequest<T>({ ...config, method: 'GET', url });
  }

  patch<T = unknown>(
    url: string,
    body?: unknown,
    config: Omit<AjaxConfig, 'url' | 'body' | 'method'> = {},
  ): Observable<AjaxResponse<T>> {
    return this.makeRequest<T>({ ...config, method: 'PATCH', url, body });
  }

  post<T = unknown>(
    url: string,
    body?: unknown,
    config: Omit<AjaxConfig, 'url' | 'body' | 'method'> = {},
  ): Observable<AjaxResponse<T>> {
    return this.makeRequest<T>({ ...config, method: 'POST', url, body });
  }

  put<T = unknown>(
    url: string,
    body?: unknown,
    config: Omit<AjaxConfig, 'url' | 'body' | 'method'> = {},
  ): Observable<AjaxResponse<T>> {
    return this.makeRequest<T>({ ...config, method: 'PUT', url, body });
  }

  delete<T = unknown>(
    url: string,
    config: Omit<AjaxConfig, 'url' | 'method'> = {},
  ): Observable<AjaxResponse<T>> {
    return this.makeRequest<T>({ ...config, method: 'DELETE', url });
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
