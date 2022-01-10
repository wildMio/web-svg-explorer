// ref: https://netbasal.com/make-your-angular-directive-functionality-lazy-344a4bd9434b

import { Observable } from 'rxjs';

const hasSupport = 'IntersectionObserver' in window;

export function inView(
  element: Element,
  options: IntersectionObserverInit = {
    root: null,
    threshold: [0, 1],
  }
): Observable<boolean> {
  return new Observable((subscriber) => {
    if (!hasSupport) {
      subscriber.next(true);
      subscriber.complete();
    }

    const observer = new IntersectionObserver(([entry]) => {
      subscriber.next(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => observer.disconnect();
  });
}
