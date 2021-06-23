import { Observable, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Reaction } from './reaction';

export class ReactionsRunner {
  private repository = new Map<Reaction<unknown>, Subscription>();

  startMany(reactions: ReadonlyArray<Reaction<unknown>>): void {
    reactions.forEach((reaction) => this.start(reaction));
  }

  start(reaction: Reaction<unknown>): void {
    if (this.repository.has(reaction)) {
      return;
    }

    this.execute(reaction);
  }

  stopMany(reactions: ReadonlyArray<Reaction<unknown>>): void {
    reactions.forEach((reaction) => this.stop(reaction));
  }

  stop(reaction: Reaction<unknown>): void {
    const subscription = this.repository.get(reaction);

    if (subscription) {
      subscription.unsubscribe();
      this.repository.delete(reaction);
    }
  }

  clear(): void {
    this.stopMany(Array.from(this.repository.keys()));
  }

  private execute(reaction: Reaction<unknown>) {
    const subscription = wrapInErrorHandler(reaction()).subscribe();

    this.repository.set(reaction, subscription);
  }
}

function wrapInErrorHandler<T>(observable$: Observable<T>): Observable<T> {
  return observable$.pipe(
    catchError(() => {
      // Return observable that produces this particular effect
      return wrapInErrorHandler(observable$);
    }),
  );
}
