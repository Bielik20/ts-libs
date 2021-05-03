type Method = 'DELETE' | 'GET' | 'PUT' | 'PATCH' | 'POST';

export type HttpRequest<T = unknown> = {
  url: string;
  method: Method;
  headers?: Record<string, any>;
  body?: T;
};
