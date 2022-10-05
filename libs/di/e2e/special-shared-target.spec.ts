import 'reflect-metadata';
import { Container, Injectable, Scope } from '@ns3/di';

@Injectable()
class TargetClass {}

@Injectable()
class B {}

@Injectable()
class A {}

describe('Special - shared target', () => {
  describe('when the same scope', () => {
    test('be the same', () => {
      const container = Container.make();

      container.set({ bind: A, klass: TargetClass });
      container.set({ bind: B, klass: TargetClass });

      const a = container.get(A);
      const b = container.get(B);

      expect(a).toBe(b);
      expect(a).toBeInstanceOf(TargetClass);
    });
  });

  describe('when binding Global -> Local', () => {
    /**
     * Because A is Global but TargetClass is Local
     * it will be impossible to satisfy scope boundary.
     */
    test('throw', () => {
      const container = Container.make();

      container.set({ bind: A, klass: TargetClass, scope: Scope.Global });

      expect(() => container.get(A)).toThrow('Unsatisfied scope boundary');
    });
  });

  describe('when binding Transient -> Local', () => {
    /**
     * Even though A and B are Transient
     * since they are bound to TargetClass which is Local
     * they will act like a Local.
     */
    test('act as local', () => {
      const container = Container.make();

      container.set({ bind: A, klass: TargetClass, scope: Scope.Transient });
      container.set({ bind: B, klass: TargetClass, scope: Scope.Transient });

      const a = container.get(A);
      const b = container.get(B);

      expect(a).toBe(b);
      expect(a).toBeInstanceOf(TargetClass);
    });
  });
});
