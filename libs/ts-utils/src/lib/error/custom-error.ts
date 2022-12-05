import { NamedError } from './named-error';

type CustomErrorConstructor<
  TName extends string = 'Error',
  TExtras = Record<string, any>,
> = ConditionalName<TName> & {
  message?: string;
  cause?: Error;
} & TExtras;

type ConditionalName<TName extends string> = TName extends 'Error'
  ? { name?: never }
  : { name: TName };

export class CustomError<TName extends string = 'Error', TExtras = Record<string, any>>
  extends Error
  implements NamedError<TName>
{
  override readonly name: TName;

  constructor({ name, message, cause, ...extras }: CustomErrorConstructor<TName, TExtras>) {
    // @ts-ignore
    super(message, { cause });
    this.name = (name as TName) || ('Error' as TName);

    Object.setPrototypeOf(this, new.target.prototype);

    Object.entries(extras).forEach(([key, value]) => {
      // @ts-ignore
      this[key] = value;
    });
  }
}
