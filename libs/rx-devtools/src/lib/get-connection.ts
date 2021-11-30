import { RxDevtoolsConnection } from './rx-devtools-connection';

let connection: RxDevtoolsConnection | undefined;

export function getConnection(): RxDevtoolsConnection | undefined {
  if (typeof window === 'undefined') {
    return;
  }

  if (!connection) {
    const reduxDevTools = (window as any)?.__REDUX_DEVTOOLS_EXTENSION__?.connect();

    if (!reduxDevTools) {
      return undefined;
    }

    connection = new RxDevtoolsConnection(reduxDevTools);
  }

  return connection;
}
