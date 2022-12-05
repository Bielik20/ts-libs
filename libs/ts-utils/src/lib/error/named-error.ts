/**
 * Provides a way to create not throwable error instance.
 * If error is to be throwable one can extend CustomError.
 */
export interface NamedError<T extends string> {
  readonly name: T;
  readonly message: string;
}
