import 'reflect-metadata';
import { Container, Injectable } from '@ns3/di';

interface ExternalInterface {
  foo(): string;
}

function ExternalInterfaceFactory(): ExternalInterface {
  return {
    foo: () => 'bar',
  };
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AppClass extends ExternalInterface {}

@Injectable({ provider: () => ExternalInterfaceFactory() })
class AppClass {}

/**
 * How to make "Injectable" version of an interface from external library.
 * We create our own AppClass interface and class.
 * This way we do not need to explicitly redefine all fields in class.
 * In Injectable decorator we provide factory to create "instance" of ExternalInterface.
 * class AppClass servers merely as a symbol for DI.
 */
describe('Recipes - ExternalInterface', () => {
  let container: Container;

  beforeEach(() => {
    container = Container.make();
  });

  test('work', () => {
    const instance = container.get(AppClass);
    instance.foo();

    expect(instance).not.toBeInstanceOf(AppClass);
    expect(instance.foo()).toBe('bar');
  });
});
