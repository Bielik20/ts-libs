import { Observable, ObservableInput } from 'rxjs';
import { ConnectionsManager, ConnectionsManagerConfig } from './connections-manager';

export interface ConnectionManagerConfig<TValue>
  extends Omit<ConnectionsManagerConfig<'only', TValue>, 'scope' | 'set'> {
  connecting?: () => void;
  connected?: () => void;
  has: () => boolean;
  get$: () => Observable<TValue>;
  set: (value: TValue) => void;
}

export class ConnectionManager<TValue> {
  private connectionsManager: ConnectionsManager<'only', TValue>;

  constructor(config: ConnectionManagerConfig<TValue>) {
    this.connectionsManager = new ConnectionsManager<'only', TValue>({
      ...config,
      set: (key, value) => config.set(value),
    });
  }

  connect$(factory: () => ObservableInput<TValue>): Observable<TValue> {
    return this.connectionsManager.connect$('only', factory);
  }

  validate(): void {
    return this.connectionsManager.validate('only');
  }

  invalidate(): void {
    return this.connectionsManager.invalidate('only');
  }
}
