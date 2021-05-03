import { Observable } from 'rxjs';
import { HttpRequest } from './http-request';
import { HttpResponse } from './http-response';

export type HttpHandler = (req: HttpRequest) => Observable<HttpResponse>;
