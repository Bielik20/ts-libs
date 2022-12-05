import { CustomError } from './custom-error';

class IncorrectError extends CustomError<'IncorrectError'> {
  constructor(cause: any) {
    super({ name: 'IncorrectError', message: 'Someone threw value that was not an error', cause });
  }
}

export function assertErrorLike(input: unknown): asserts input is Error {
  if (isErrorLike(input)) {
    return;
  }
  throw new IncorrectError(input);
}

export function ensureErrorLike(input: unknown): Error {
  return isErrorLike(input) ? input : new IncorrectError(input);
}

function isErrorLike(input: any): input is Error {
  return (
    input instanceof Error ||
    (typeof input['name'] === 'string' && typeof input['message'] === 'string')
  );
}
