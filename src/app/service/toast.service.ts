import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

export type ToastTone = 'info' | 'success' | 'warning' | 'danger';

export type ToastItem = {
  id: number;
  message: string;
  tone: ToastTone;
};

type ToastOptions = {
  tone?: ToastTone;
  duration?: number;
};

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly itemsSubject = new BehaviorSubject<ToastItem[]>([]);
  private readonly timeoutIds = new Map<
    number,
    ReturnType<typeof setTimeout>
  >();

  private nextToastId = 1;

  readonly items$ = this.itemsSubject.asObservable();

  show(message: string, options: ToastOptions = {}) {
    const duration = options.duration ?? 2200;
    const tone = options.tone ?? 'info';
    const currentItems = this.itemsSubject.getValue();

    if (currentItems.length >= 4) {
      this.dismiss(currentItems[0].id);
    }

    const toast: ToastItem = {
      id: this.nextToastId++,
      message,
      tone,
    };

    this.itemsSubject.next([...this.itemsSubject.getValue(), toast]);

    if (duration > 0) {
      const timeoutId = globalThis.setTimeout(() => {
        this.dismiss(toast.id);
      }, duration);

      this.timeoutIds.set(toast.id, timeoutId);
    }

    return toast.id;
  }

  success(message: string, duration?: number) {
    return this.show(message, { tone: 'success', duration });
  }

  dismiss(id: number) {
    const timeoutId = this.timeoutIds.get(id);

    if (timeoutId) {
      globalThis.clearTimeout(timeoutId);
      this.timeoutIds.delete(id);
    }

    this.itemsSubject.next(
      this.itemsSubject.getValue().filter((toast) => toast.id !== id),
    );
  }
}
