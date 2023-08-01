import { Container, Injectable } from '@ns3/di';

describe('Reflect Metadata', () => {
  test('do not throw without importing reflect-metadata', () => {
    @Injectable()
    class ExampleClass {}
    expect(ExampleClass).toBeDefined();
  });

  test('throw on get without importing reflect-metadata', () => {
    @Injectable()
    class ExampleClass {}
    expect(ExampleClass).toBeDefined();

    const container = Container.make();
    expect(() => container.get(ExampleClass)).toThrow(
      'class ExampleClass {\n' + '        } is not bound to anything.',
    );
  });
});
