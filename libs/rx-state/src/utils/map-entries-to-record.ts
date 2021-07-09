export function mapEntriesToRecord<TKey, TValue>(
  entries: [key: TKey, value: TValue][],
): Record<string, TValue> {
  return entries
    .map(([key, value]) => ({ [JSON.stringify(key)]: value }))
    .reduce((res, curr) => ({ ...res, ...curr }), {});
}
