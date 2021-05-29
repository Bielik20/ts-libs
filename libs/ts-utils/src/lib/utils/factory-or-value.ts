// eslint-disable-next-line @typescript-eslint/ban-types
export type FactoryOrValue<T> = T extends Function ? never : T | Factory<T>;
type Factory<T> = () => T;

export function unpackFactoryOrValue<T>(input: FactoryOrValue<T>): T {
  return typeof input === 'function' ? input() : input;
}
