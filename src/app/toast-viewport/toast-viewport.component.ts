import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ToastService } from '../service/toast.service';

@Component({
  selector: 'app-toast-viewport',
  templateUrl: './toast-viewport.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe],
})
export class ToastViewportComponent {
  private readonly toastService = inject(ToastService);

  readonly items$ = this.toastService.items$;

  dismiss(id: number) {
    this.toastService.dismiss(id);
  }
}
