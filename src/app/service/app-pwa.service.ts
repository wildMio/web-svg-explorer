import { Injectable } from '@angular/core';

import { BehaviorSubject, from, fromEvent } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

export interface BeforeInstallPromptEvent extends Event {
  /**
   * Returns an array of DOMString items containing the platforms on which the event was dispatched.
   * This is provided for user agents that want to present a choice of versions to the user such as,
   * for example, "web" or "play" which would allow the user to chose between a web version or
   * an Android version.
   */
  readonly platforms: Array<string>;

  /**
   * Returns a Promise that resolves to a DOMString containing either "accepted" or "dismissed".
   */
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;

  /**
   * Allows a developer to show the install prompt at a time of their own choosing.
   * This method returns a Promise.
   */
  prompt(): Promise<void>;
}

@Injectable({
  providedIn: 'root',
})
export class AppPwaService {
  deferredPrompt$ = new BehaviorSubject<BeforeInstallPromptEvent | null>(null);

  showInstallPromotion$ = this.deferredPrompt$.pipe(map((prompt) => !!prompt));

  interceptDefaultInstall() {
    fromEvent<BeforeInstallPromptEvent>(
      window,
      'beforeinstallprompt',
    ).subscribe({
      next: (event) => {
        event.preventDefault();

        this.deferredPrompt$.next(event);
      },
    });

    fromEvent(window, 'appinstalled').subscribe({
      next: () => {
        this.deferredPrompt$.next(null);
      },
    });
  }

  installPromotion() {
    const deferredPrompt = this.deferredPrompt$.getValue();
    if (!deferredPrompt) {
      return;
    }
    from(deferredPrompt?.prompt())
      .pipe(
        switchMap(() => from(deferredPrompt.userChoice)),
        take(1),
      )
      .subscribe({
        next: () => {
          this.deferredPrompt$.next(null);
        },
      });
  }
}
