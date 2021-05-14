export interface Change<TKey, TValue> {
  key: TKey;
  oldValue: TValue | undefined;
  newValue: TValue | undefined;
}

export function makeChange<TKey, TValue>(
  key: TKey,
  oldValue: TValue | undefined,
  newValue: TValue | undefined,
): Change<TKey, TValue> {
  return { key, oldValue, newValue };
}
