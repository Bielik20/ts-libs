export interface Klass<T> extends Function {
  new (...args: unknown[]): T;
}

export type DiKey<T> = Klass<T> | symbol | string;
