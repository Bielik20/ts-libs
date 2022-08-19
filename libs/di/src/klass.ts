export interface Klass<T> extends Function {
  new (...args: any[]): T;
}

export function assertKlass<T = any>(input: any): asserts input is Klass<T> {
  if (!isKlass(input)) {
    throw new TypeError(`${input.toString()} is not a class.`);
  }
}

export function isKlass<T = any>(input: any): input is Klass<T> {
  return typeof input === 'function';
}
