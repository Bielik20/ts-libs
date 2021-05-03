import { useEffect } from 'react';
import { Subject } from 'rxjs';
import useConstant from 'use-constant';

export function useSubject<T>(): Subject<T> {
  const subject = useConstant(() => new Subject<T>());

  useEffect(() => {
    return () => subject.complete();
  }, [subject]);

  return subject;
}
