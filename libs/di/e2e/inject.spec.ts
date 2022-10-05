import 'reflect-metadata';
import { Container, Inject, Injectable } from '@ns3/di';

interface MockInterface {
  name: string;
}

@Injectable()
class MockClass implements MockInterface {
  name = 'mock class';
}

const symbol = Symbol('symbol');

@Injectable()
class TestClass {
  constructor(
    public container: Container,
    @Inject('string') public stringParameter: MockInterface,
    @Inject(symbol) public symbolParameter: MockInterface,
  ) {}
}

describe('Inject', () => {
  let container: Container;

  beforeEach(() => {
    container = Container.make();
  });

  test('work with binder object', () => {
    container.set({ bind: 'string', klass: MockClass });
    container.set({ bind: symbol, value: new MockClass() });

    const instance = container.get(TestClass);

    expect(instance.container).toBe(container);
    expect(instance.stringParameter).toBeInstanceOf(MockClass);
    expect(instance.symbolParameter).toBeInstanceOf(MockClass);
  });

  test('throw when not provided (string dependency)', () => {
    expect(() => container.get(TestClass)).toThrow('string is not bound to anything.');
  });

  test('throw when not provided (symbol itself)', () => {
    expect(() => container.get(symbol)).toThrow('Symbol(symbol) is not bound to anything.');
  });

  test('throw when not provided (string itself)', () => {
    expect(() => container.get('string')).toThrow('string is not bound to anything.');
  });

  test('throw on property', () => {
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class ClassWithProperty {
        @Inject('string') property: any;
      }
    }).toThrow('Cannot apply @Inject decorator to a property.');
  });

  test('throw if multiple times', () => {
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class ClassWithParameter {
        constructor(@Inject('string1') @Inject('string2') public parameter: any) {}
      }
    }).toThrow('Cannot apply @Inject decorator multiple times on the same parameter.');
  });
});
