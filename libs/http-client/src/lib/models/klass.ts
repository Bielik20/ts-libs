export interface Klass<T> extends Function {
  new (...args: unknown[]): T;
}
