export function isNotUndefined<T>(argument: T | undefined): argument is T {
  return argument !== undefined;
}
