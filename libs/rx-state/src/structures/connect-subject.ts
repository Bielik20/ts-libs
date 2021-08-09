import { BehaviorSubject, Observable } from 'rxjs';
import { ConnectionManager } from '../utils/connection-manager';
import {
  ConnectionHooks,
  ConnectionOptions,
  normalizeConnectionHooks,
} from '../utils/connection-options';

type ConnectSubjectOptions = ConnectionOptions & ConnectionHooks;

export class ConnectSubject<T> extends BehaviorSubject<T | undefined> {
  protected readonly connectionManager: ConnectionManager<T>;

  constructor(options: ConnectSubjectOptions = {}) {
    super(undefined);
    this.connectionManager = new ConnectionManager<T>({
      ...options,
      ...normalizeConnectionHooks(options),
      has: () => this.value !== undefined,
      get$: () => this.asObservable() as Observable<T>,
      set: (value) => this.next(value),
    });
  }

  next(value: T | undefined) {
    this.connectionManager.validate();
    super.next(value);
  }

  connect$(factory: () => Observable<T>): Observable<T> {
    return this.connectionManager.connect$(factory);
  }

  invalidate(): void {
    return this.connectionManager.invalidate();
  }
}
