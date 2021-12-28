import { Subject } from 'rxjs';

export function InputToSubject<T = any>(subjectKey?: string) {
  const cachedValueKey = Symbol();
  return (target: any, key: string) => {
    const targetKey = subjectKey ?? `${key}$`;
    Object.defineProperty(target, key, {
      set(value: T) {
        this[cachedValueKey] = value;
        const subject: Subject<T> = this[targetKey];
        subject.next(value);
      },
      get() {
        return this[cachedValueKey];
      },
    });
  };
}
