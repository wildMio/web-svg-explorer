import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appInjectHTML]',
})
export class InjectHTMLDirective {
  @Input() set appInjectHTML(content: string | null) {
    this.host.nativeElement.innerHTML = content;
  }

  constructor(private host: ElementRef) {}
}
