import { Observable } from 'rxjs';
import { AjaxConfig, AjaxResponse } from 'rxjs/ajax';

export type HttpHandler<T = unknown> = (req: AjaxConfig) => Observable<AjaxResponse<T>>;
