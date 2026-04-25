import { Clipboard } from '@angular/cdk/clipboard';
import {
  Component,
  ChangeDetectionStrategy,
  Input,
  HostBinding,
  inject,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FileWithDirectoryHandle } from 'browser-fs-access';

@Component({
  selector: 'app-svg-markup',
  templateUrl: './svg-markup.component.html',
  styleUrls: ['./svg-markup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgMarkupComponent {
  private readonly clipboard = inject(Clipboard);
  private readonly snackBar = inject(MatSnackBar);

  @HostBinding('class') class = 'block h-full';

  @Input() handle?: FileWithDirectoryHandle | null;
  @Input() originalText?: string | null;
  @Input() optimizedText?: string | null;

  copy(name: string, text: string) {
    this.clipboard.copy(text);
    this.snackBar.open(`Copy ${name} success.`, 'Dismiss', {
      duration: 2000,
    });
  }
}
