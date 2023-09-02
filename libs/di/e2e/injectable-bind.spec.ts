import 'reflect-metadata';
import { Container, Injectable } from '@ns3/di';

describe('Injectable - binding', () => {
  describe('factory', () => {
    const TEST_VALUE = {};

    @Injectable({ useFactory: () => TEST_VALUE })
    class TestClass {}

    test('create instance', () => {
      const container = Container.make();
      const instance = container.get(TestClass);

      expect(instance).toBe(TEST_VALUE);
    });
  });

  describe('value', () => {
    const TEST_VALUE = {};

    @Injectable({ useValue: TEST_VALUE })
    class TestClass {}

    test('create instance', () => {
      const container = Container.make();
      const instance = container.get(TestClass);

      expect(instance).toBe(TEST_VALUE);
    });
  });

  describe('Class', () => {
    @Injectable()
    class TestFooClass {}

    @Injectable({ useClass: TestFooClass })
    class TestBarClass {}

    test('create instance', () => {
      const container = Container.make();
      const instance = container.get(TestBarClass);

      expect(instance).toBeInstanceOf(TestFooClass);
    });
  });
});
