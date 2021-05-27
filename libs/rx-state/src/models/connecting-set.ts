export interface ConnectingSet<T> {
  add(value: T): void;
  delete(value: T): void;
}

export const noopConnectingSet: ConnectingSet<any> = {
  add: () => null,
  delete: () => null,
};
