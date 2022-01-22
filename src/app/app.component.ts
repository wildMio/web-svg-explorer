import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Inject,
  OnInit,
} from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';

import { directoryOpen, FileWithDirectoryHandle } from 'browser-fs-access';
import * as saveAs from 'file-saver';
import * as JSZip from 'jszip';
import {
  BehaviorSubject,
  combineLatest,
  concatMap,
  filter,
  finalize,
  from,
  map,
  take,
} from 'rxjs';
import { OptimizedSvg } from 'svgo';

import { AppPwaService } from './service/app-pwa.service';
import { SvgoService } from './service/svgo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  @HostBinding('class') class = 'grid h-full';

  title = 'web-svg-explorer';

  fileWithDirectoryHandles$ = new BehaviorSubject<FileWithDirectoryHandle[]>(
    []
  );
  hasHandles$ = this.fileWithDirectoryHandles$.pipe(
    map((handles) => !!handles.length)
  );

  displaySettingOpen = false;
  currentColor = 'white';
  colorInvert = false;

  directoryOpening$ = new BehaviorSubject(false);
  svgOptimizing$ = new BehaviorSubject(false);
  downloadZipping$ = new BehaviorSubject(false);
  loading$ = combineLatest([
    this.directoryOpening$,
    this.svgOptimizing$,
    this.downloadZipping$,
  ]).pipe(map((loadings) => loadings.some((loading) => loading)));

  optimizedSvgMap$ = new BehaviorSubject<
    { [name: string]: OptimizedSvg } | undefined
  >(undefined);

  showInstallPromotion$ = this.appPwaService.showInstallPromotion$;
  swUpdateAvailable$ = this.swUpdate.versionUpdates.pipe(
    filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
    map((evt) => ({
      type: 'UPDATE_AVAILABLE',
      current: evt.currentVersion,
      available: evt.latestVersion,
    }))
  );

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly swUpdate: SwUpdate,
    private readonly appPwaService: AppPwaService,
    private readonly svgoService: SvgoService
  ) {}

  ngOnInit() {
    this.appPwaService.interceptDefaultInstall();
  }

  installPromotion() {
    this.appPwaService.installPromotion();
  }

  reloadPage() {
    this.swUpdate.activateUpdate().then(() => this.document.location.reload());
  }

  openDirectory() {
    if (this.directoryOpening$.getValue()) {
      return;
    }
    this.directoryOpening$.next(true);
    from(directoryOpen())
      .pipe(finalize(() => this.directoryOpening$.next(false)))
      .subscribe({
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
        finalize(() => this.svgOptimizing$.next(false))
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
          Object.entries(svgMap ?? {}).forEach(([name, svg]) => {
            zip.file(`${name}.svg`, svg.data);
          });
          zip.generateAsync;
          return from(zip.generateAsync({ type: 'blob' }));
        }),
        finalize(() => this.downloadZipping$.next(false))
      )
      .subscribe({ next: (content) => saveAs(content, 'svg.zip') });
  }
}
