// ref: https://netbasal.com/make-your-angular-directive-functionality-lazy-344a4bd9434b
import { distinctUntilChanged, filter, map, Observable, Subject } from 'rxjs';

const hasSupport = 'IntersectionObserver' in window;

export const genInView = (
  options = {
    root: null,
    threshold: [0, 1],
  }
) => {
  const entries$ = new Subject<IntersectionObserverEntry[]>();
  const observer = new IntersectionObserver(
    (entries) => entries$.next(entries),
    options
  );
  return (element: Element) => {
    return new Observable<boolean>((subscriber) => {
      if (!hasSupport) {
        subscriber.next(true);
        subscriber.complete();
      }

      const subscription = entries$
        .pipe(
          map((entries) => entries.find(({ target }) => target === element)),
          filter((entry) => !!entry),
          map((entry) => entry?.isIntersecting),
          distinctUntilChanged()
        )
        .subscribe({
          next: (visible) => {
            subscriber.next(!!visible);
          },
        });

      observer.observe(element);

      return () => {
        observer.unobserve(element);
        subscription.unsubscribe();
      };
    });
  };
};

export const inView = genInView();
