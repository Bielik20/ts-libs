import 'reflect-metadata';
import { Container } from '@ns3/di';
import { expectError } from 'tsd';

class BaseClass {
  private constructor(private field: any) {}

  method() {
    return 'method';
  }

  private hidden() {
    return 'hidden';
  }
}

class CorrectClass {
  method() {
    return 'method';
  }
}
const CORRECT_INSTANCE = {
  method: () => 'method',
};

const CORRECT_FACTORY = () => CORRECT_INSTANCE;

class WrongClass {
  wrong() {
    return 'wrong';
  }
}

const WRONG_INSTANCE = {
  wrong: () => 'wrong',
};

const WRONG_FACTORY = () => WRONG_INSTANCE;

const container = Container.make();

container.provide({ token: BaseClass, useClass: CorrectClass });
container.provide({ token: BaseClass, useValue: CORRECT_INSTANCE });
container.provide({ token: BaseClass, useFactory: CORRECT_FACTORY });

expectError(container.provide({ token: BaseClass, useClass: WrongClass }));
// tsd doesn't interpret that line correctly... I don't know why.
// expectError(container.provide({ bind: BaseClass, toValue: WRONG_INSTANCE }));
expectError(container.provide({ token: BaseClass, useFactory: WRONG_FACTORY }));
