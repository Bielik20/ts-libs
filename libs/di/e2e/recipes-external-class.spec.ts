import 'reflect-metadata';
import { Container, Injectable } from '@ns3/di';

interface ExternalClassSettings {
  foo: boolean;
}

class ExternalClass {
  constructor(public settings: ExternalClassSettings) {}
}

@Injectable()
class AppClass extends ExternalClass {
  constructor() {
    super({ foo: true });
  }
}

/**
 * How to make "Injectable" version of a class from external library without binding it explicitly.
 * We create our own class through inheritance and deliver dependencies manually.
 */
describe('Recipes - ExternalClass', () => {
  let container: Container;

  beforeEach(() => {
    container = Container.make();
  });

  test('work', () => {
    const instance = container.get(AppClass);

    expect(instance).toBeInstanceOf(AppClass);
    expect(instance).toBeInstanceOf(ExternalClass);
  });
});
