import { Directive, ElementRef, inject, Input } from '@angular/core';

@Directive({ selector: '[appInjectHTML]' })
export class InjectHTMLDirective {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  @Input() set appInjectHTML(content: string | null) {
    this.host.nativeElement.innerHTML = content;
  }
}
