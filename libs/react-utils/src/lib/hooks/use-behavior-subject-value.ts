import { useEffect, useState } from 'react';
import { BehaviorSubject } from 'rxjs';
import { debounce } from 'rxjs/operators';

export function useBehaviorSubjectValue<T>(behaviorSubject$: BehaviorSubject<T>): T {
  const [value, setValue] = useState<T>(behaviorSubject$.value);

  useEffect(() => {
    behaviorSubject$.pipe(debounce(() => Promise.resolve())).subscribe(setValue);

    return () => behaviorSubject$.complete();
  }, [behaviorSubject$]);

  return value;
}
