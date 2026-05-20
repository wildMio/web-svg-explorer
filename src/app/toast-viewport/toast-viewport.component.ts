import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { I18nService } from '../service/i18n.service';
import { ToastService } from '../service/toast.service';

@Component({
  selector: 'app-toast-viewport',
  templateUrl: './toast-viewport.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe],
})
export class ToastViewportComponent {
  private readonly toastService = inject(ToastService);
  readonly i18n = inject(I18nService);

  readonly items$ = this.toastService.items$;

  dismiss(id: number) {
    this.toastService.dismiss(id);
  }
}
