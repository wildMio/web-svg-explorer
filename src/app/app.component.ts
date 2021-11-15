import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { directoryOpen, FileWithDirectoryHandle } from 'browser-fs-access';
import { BehaviorSubject, from } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  @HostBinding('class') class = 'grid h-full';

  title = 'web-svg-explorer';

  fileWithDirectoryHandles$ = new BehaviorSubject<FileWithDirectoryHandle[]>(
    []
  );

  openDirectory() {
    from(directoryOpen()).subscribe({
      next: (files) =>
        this.fileWithDirectoryHandles$.next(
          files.filter((file) => file.type === 'image/svg+xml')
        ),
    });
  }
}
