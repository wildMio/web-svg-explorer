import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { directoryOpen, FileWithDirectoryHandle } from 'browser-fs-access';
import * as saveAs from 'file-saver';
import * as JSZip from 'jszip';
import {
  BehaviorSubject,
  combineLatest,
  concatMap,
  from,
  map,
  take,
  tap,
} from 'rxjs';
import { OptimizedSvg } from 'svgo';
import { SvgoService } from './service/svgo.service';

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

  hasHandles$ = this.fileWithDirectoryHandles$.pipe(
    map((handles) => !!handles.length)
  );

  currentColor = 'white';

  svgOptimizing$ = new BehaviorSubject(false);

  optimizedSvgMap$ = new BehaviorSubject<
    { [name: string]: OptimizedSvg } | undefined
  >(undefined);

  downloadZipping$ = new BehaviorSubject(false);

  constructor(private readonly svgoService: SvgoService) {}

  openDirectory() {
    from(directoryOpen()).subscribe({
      next: (files) =>
        this.fileWithDirectoryHandles$.next(
          files.filter((file) => file.type === 'image/svg+xml')
        ),
    });
  }

  svgoAll() {
    if (this.svgOptimizing$.getValue()) {
      return;
    }
    this.svgOptimizing$.next(true);
    this.fileWithDirectoryHandles$
      .pipe(
        take(1),
        concatMap((handles) =>
          combineLatest(
            Object.fromEntries(
              handles.map((handle) => {
                const name = handle.name.replace('.svg', '');
                return [
                  name,
                  from(handle.text()).pipe(
                    concatMap((text) => this.svgoService.optimize$(text, name))
                  ),
                ];
              })
            )
          )
        ),
        take(1),
        tap(() => this.svgOptimizing$.next(false))
      )
      .subscribe({
        next: (optimizedSvgMap) => {
          this.optimizedSvgMap$.next(optimizedSvgMap);
        },
      });
  }

  downloadAll() {
    if (this.downloadZipping$.getValue()) {
      return;
    }
    this.downloadZipping$.next(true);
    this.optimizedSvgMap$
      .pipe(
        take(1),
        concatMap((svgMap) => {
          const zip = new JSZip();
          Object.entries(svgMap!).forEach(([name, svg]) => {
            zip.file(`${name}.svg`, svg.data);
          });
          zip.generateAsync;
          return from(zip.generateAsync({ type: 'blob' }));
        }),
        tap(() => this.downloadZipping$.next(false))
      )
      .subscribe({ next: (content) => saveAs(content, 'svg.zip') });
  }
}
