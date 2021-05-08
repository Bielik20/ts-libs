import { DependencyList, useEffect, useState } from 'react';
import { Observable } from 'rxjs';
import {
  ErrorResult,
  IDLE_RESULT,
  IdleResult,
  makeErrorResult,
  makeSuccessResult,
  PENDING_RESULT,
  PendingResult,
  SuccessResult,
} from '../utils/results';

export type StreamResult<T> = IdleResult | PendingResult | SuccessResult<T> | ErrorResult;

export function useStream<T>(
  streamFactory: () => Observable<T>,
  deps?: DependencyList,
): StreamResult<T> {
  const [value, setValue] = useState<StreamResult<T>>(IDLE_RESULT);

  useEffect(() => {
    const stream$ = streamFactory();
    let immediate = false;
    const subscription = stream$.subscribe(
      (value) => {
        immediate = true;
        setValue(makeSuccessResult(value));
      },
      (error) => {
        immediate = true;
        setValue(makeErrorResult(error));
      },
    );
    !immediate && setValue(PENDING_RESULT);

    return () => {
      subscription.unsubscribe();
      setValue(IDLE_RESULT);
    };
  }, deps);

  return value;
}
