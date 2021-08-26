export interface Klass<T> extends Function {
  new (...args: any[]): T;
}
