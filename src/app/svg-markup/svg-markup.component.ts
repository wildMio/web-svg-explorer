import { Clipboard } from '@angular/cdk/clipboard';
import {
  Component,
  ChangeDetectionStrategy,
  Input,
  HostBinding,
  inject,
} from '@angular/core';

import { FileWithDirectoryHandle } from 'browser-fs-access';

import { ToastService } from '../service/toast.service';

@Component({
  selector: 'app-svg-markup',
  templateUrl: './svg-markup.component.html',
  styleUrls: ['./svg-markup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgMarkupComponent {
  private readonly clipboard = inject(Clipboard);
  private readonly toastService = inject(ToastService);

  @HostBinding('class') class = 'block h-full';

  @Input() handle?: FileWithDirectoryHandle | null;
  @Input() originalText?: string | null;
  @Input() optimizedText?: string | null;

  copy(label: string, text: string) {
    this.clipboard.copy(text);
    this.toastService.success(`Copied ${label}.`);
  }
}
