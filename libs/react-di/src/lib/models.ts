export interface Klass<T> extends Function {
  new (...args: any[]): T;
}

export type DiKey<T> = Klass<T> | symbol | string;
