import 'reflect-metadata';
import { Container, Injectable } from '@ns3/di';

describe('Injectable - bind', () => {
  describe('factory', () => {
    const TEST_VALUE = {};

    @Injectable({ factory: () => TEST_VALUE })
    class TestClass {}

    test('create instance', () => {
      const container = Container.make();
      const instance = container.get(TestClass);

      expect(instance).toBe(TEST_VALUE);
    });
  });

  describe('value', () => {
    const TEST_VALUE = {};

    @Injectable({ value: TEST_VALUE })
    class TestClass {}

    test('create instance', () => {
      const container = Container.make();
      const instance = container.get(TestClass);

      expect(instance).toBe(TEST_VALUE);
    });
  });

  describe('klass', () => {
    @Injectable()
    class TestFooClass {}

    @Injectable({ klass: TestFooClass })
    class TestBarClass {}

    test('create instance', () => {
      const container = Container.make();
      const instance = container.get(TestBarClass);

      expect(instance).toBeInstanceOf(TestFooClass);
    });
  });
});
