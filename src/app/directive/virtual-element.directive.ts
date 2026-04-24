import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  inject,
} from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

import { inView } from '../util/intersection-observer';

@Directive({ selector: '[appVirtualElement]' })
export class VirtualElementDirective implements OnInit, OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);

  destroy$ = new Subject<void>();

  ngOnInit(): void {
    const el = this.host.nativeElement;
    const parentEl = el.parentElement;
    if (!parentEl) {
      return;
    }
    inView(parentEl)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (inViewport) => {
          if (inViewport) {
            this.renderer.appendChild(parentEl, el);
          } else {
            this.renderer.removeChild(parentEl, el);
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
