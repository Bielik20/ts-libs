import { StateFragment } from './state-fragment';

export class RxDevtoolsConnection {
  private state: Record<string, any> = {};

  constructor(private reduxDevTools: any) {}

  update(fragment: StateFragment) {
    this.state = {
      ...this.state,
      [fragment.parent]: {
        ...(this.state[fragment.parent] || {}),
        [fragment.name]: fragment.value,
      },
    };

    this.reduxDevTools.send(
      {
        type: `{${fragment.parent}} ${fragment.name}`,
        payload: fragment.value,
      },
      this.state,
    );
  }
}
