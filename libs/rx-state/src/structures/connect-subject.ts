import { BehaviorSubject, Observable } from 'rxjs';
import { ConnectionManager, ConnectionManagerConfig } from '../utils/connection-manager';

interface ConnectSubjectOptions extends ConnectionManagerConfig {
  connecting$?: BehaviorSubject<boolean>;
}

export class ConnectSubject<T> extends BehaviorSubject<T | undefined> {
  protected readonly connectionManager: ConnectionManager<T>;

  constructor({ connecting$, ...options }: ConnectSubjectOptions) {
    super(undefined);
    this.connectionManager = new ConnectionManager<T>(options, {
      connecting: connecting$ && (() => connecting$.value !== true && connecting$.next(true)),
      connected: connecting$ && (() => connecting$.value !== false && connecting$.next(false)),
      has: () => this.value !== undefined,
      get$: () => this.asObservable(),
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
