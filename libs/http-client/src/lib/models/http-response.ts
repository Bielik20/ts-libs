import { AjaxResponse } from 'rxjs/ajax';

export type HttpResponse<T = any> = {
  [key in keyof Omit<AjaxResponse, 'response'>]: AjaxResponse[key];
} & { response: T };
