import { Clipboard } from '@angular/cdk/clipboard';
import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
} from '@angular/core';

import { FileWithDirectoryHandle } from 'browser-fs-access';

import { ToastService } from '../service/toast.service';

@Component({
  selector: 'app-svg-markup',
  templateUrl: './svg-markup.component.html',
  styleUrls: ['./svg-markup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block h-full',
  },
})
export class SvgMarkupComponent {
  private readonly clipboard = inject(Clipboard);
  private readonly toastService = inject(ToastService);

  readonly handle = input<FileWithDirectoryHandle | null | undefined>(
    undefined,
  );
  readonly originalText = input<string | null | undefined>(undefined);
  readonly optimizedText = input<string | null | undefined>(undefined);

  copy(label: string, text: string) {
    this.clipboard.copy(text);
    this.toastService.success(`Copied ${label}.`);
  }
}
