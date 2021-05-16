import { useEffect, useState } from 'react';
import { BehaviorSubject } from 'rxjs';

export function useBehaviorSubjectValue<T>(behaviorSubject$: BehaviorSubject<T>): T {
  const [value, setValue] = useState<T>(behaviorSubject$.value);

  useEffect(() => {
    behaviorSubject$.subscribe(setValue);

    return () => behaviorSubject$.complete();
  }, [behaviorSubject$]);

  return value;
}
