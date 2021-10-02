export type FactoryOrValue<T> = T | Factory<T>;
type Factory<T> = () => T;

export function unpackFactoryOrValue<T>(input: FactoryOrValue<T>): T {
  return isFactory(input) ? input() : input;
}

function isFactory<T>(input: FactoryOrValue<T>): input is Factory<T> {
  return typeof input === 'function';
}
