export interface Class<T> extends Function {
  new (...args: any[]): T;
}

export function assertClass<T = any>(input: any): asserts input is Class<T> {
  if (!isClass(input)) {
    throw new TypeError(`${input.toString()} is not a class.`);
  }
}

export function isClass<T = any>(input: any): input is Class<T> {
  return typeof input === 'function';
}
