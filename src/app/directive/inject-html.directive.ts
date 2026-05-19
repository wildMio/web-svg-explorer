import { Directive, ElementRef, effect, inject, input } from '@angular/core';

@Directive({ selector: '[appInjectHTML]' })
export class InjectHTMLDirective {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly appInjectHTML = input<string | null>(null);

  private readonly syncContent = effect(() => {
    this.host.nativeElement.innerHTML = this.appInjectHTML() ?? '';
  });
}
