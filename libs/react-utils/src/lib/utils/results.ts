export type PendingResult = { status: 'pending' };
export type SuccessResult<T> = { status: 'success'; value: T };
export type ErrorResult = { status: 'error'; error: Error };

export const PENDING_RESULT: PendingResult = { status: 'pending' };

export function makeSuccessResult<T>(value: T): SuccessResult<T> {
  return { status: 'success', value };
}

export function makeErrorResult(error: Error): ErrorResult {
  return { status: 'error', error };
}
