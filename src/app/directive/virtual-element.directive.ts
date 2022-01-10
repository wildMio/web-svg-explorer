import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { inView } from '../util/intersection-observer';

@Directive({
  selector: '[appVirtualElement]',
})
export class VirtualElementDirective implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();

  constructor(
    private readonly host: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2
  ) {}

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
