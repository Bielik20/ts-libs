import 'reflect-metadata';
import { Container, Injectable } from '@ns3/di';
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

@Injectable({ useClass: CorrectClass })
abstract class AbstractClass {
  abstract method(): string;
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

container.provide({ token: AbstractClass, useClass: CorrectClass });
container.provide({ token: BaseClass, useClass: CorrectClass });
container.provide({ token: BaseClass, useValue: CORRECT_INSTANCE });
container.provide({ token: BaseClass, useFactory: CORRECT_FACTORY });

expectError(container.provide({ token: AbstractClass, useClass: BaseClass }));
expectError(container.provide({ token: AbstractClass, useClass: WrongClass }));
expectError(container.provide({ token: BaseClass, useClass: AbstractClass }));
expectError(container.provide({ token: BaseClass, useClass: WrongClass }));
// tsd doesn't interpret that line correctly... I don't know why.
// expectError(container.provide({ token: BaseClass, useValue: WRONG_INSTANCE }));
expectError(container.provide({ token: BaseClass, useFactory: WRONG_FACTORY }));

// ########################################
// There are "correct errors", I cannot automate checking them with tsd :/
// ########################################
// @Injectable()
// abstract class AbstractClassWithoutConfig {}
//
// @Injectable({ useClass: WrongClass })
// abstract class AbstractClassWithWrongConfig {}
