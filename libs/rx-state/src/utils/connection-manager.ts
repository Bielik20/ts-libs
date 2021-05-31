import { Observable } from 'rxjs';
import { ConnectionsManager } from './connections-manager';

export interface ConnectionManagerConfig {
  timeout: number;
  strategy: 'eager' | 'lazy';
}

export interface ConnectionManagerHooks<TValue> {
  connecting?: () => void;
  connected?: () => void;
  has: () => boolean;
  get$: () => Observable<TValue>;
  set: (value: TValue) => void;
}

export class ConnectionManager<TValue> {
  private connectionsManager: ConnectionsManager<'only', TValue>;

  constructor(config: ConnectionManagerConfig, hooks: ConnectionManagerHooks<TValue>) {
    this.connectionsManager = new ConnectionsManager<'only', TValue>(
      { ...config, scope: 'single' },
      { ...hooks, set: (key, value) => hooks.set(value) },
    );
  }

  connect$(factory: () => Observable<TValue>): Observable<TValue> {
    return this.connectionsManager.connect$('only', factory);
  }

  validate(): void {
    return this.connectionsManager.validate('only');
  }

  invalidate(): void {
    return this.connectionsManager.invalidate('only');
  }
}
