import { Clipboard } from '@angular/cdk/clipboard';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';

import { directoryOpen, FileWithDirectoryHandle } from 'browser-fs-access';
import * as saveAs from 'file-saver';
import * as JSZip from 'jszip';
import {
  BehaviorSubject,
  combineLatest,
  concatMap,
  distinctUntilChanged,
  filter,
  finalize,
  from,
  map,
  of,
  shareReplay,
  Subject,
  switchMap,
  take,
  takeUntil,
} from 'rxjs';

import { AppPwaService } from './service/app-pwa.service';
import { SvgStateService } from './service/svg-state.service';
import { SvgoService } from './service/svgo.service';
import { sliceSvgSuffix } from './util/general';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'grid h-full';

  private readonly destroy$ = new Subject<void>();

  fileWithDirectoryHandles$ = new BehaviorSubject<FileWithDirectoryHandle[]>(
    []
  );
  hasHandles$ = this.fileWithDirectoryHandles$.pipe(
    map((handles) => !!handles.length)
  );

  displaySettingOpen = false;
  currentColor = 'white';
  colorInvert = false;
  showMarkup = false;

  compressSettingOpen = false;

  directoryOpening$ = new BehaviorSubject(false);
  svgOptimizing$ = new BehaviorSubject(false);
  downloadZipping$ = new BehaviorSubject(false);
  loading$ = combineLatest([
    this.directoryOpening$,
    this.svgOptimizing$,
    this.downloadZipping$,
  ]).pipe(map((loadings) => loadings.some((loading) => loading)));

  optimizedSvgMap$ = this.svgStateService.optimizedSvgMap$;

  showInstallPromotion$ = this.appPwaService.showInstallPromotion$;
  swUpdateAvailable$ = this.swUpdate.versionUpdates.pipe(
    filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
    map((evt) => ({
      type: 'UPDATE_AVAILABLE',
      current: evt.currentVersion,
      available: evt.latestVersion,
    }))
  );

  firstUseApp$ = new BehaviorSubject(
    coerceBooleanProperty(localStorage.getItem('firstUseApp') ?? true)
  );

  activeHandleSubject = new BehaviorSubject<FileWithDirectoryHandle | null>(
    null
  );
  activeHandle$ = this.activeHandleSubject.pipe(
    distinctUntilChanged(),
    takeUntil(this.destroy$),
    shareReplay(1)
  );
  activeSvgText$ = this.activeHandle$.pipe(
    switchMap((handle) => (handle ? from(handle.text()) : of(''))),
    takeUntil(this.destroy$),
    shareReplay(1)
  );
  activeOptimizedSvg$ = this.optimizedSvgMap$.pipe(
    switchMap((svgMap) =>
      svgMap
        ? this.activeHandle$.pipe(
            map((handle) => {
              const name = sliceSvgSuffix(handle?.name);
              return name ? svgMap[name]?.data ?? '' : '';
            })
          )
        : of('')
    ),
    takeUntil(this.destroy$),
    shareReplay(1)
  );

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly swUpdate: SwUpdate,
    private readonly clipboard: Clipboard,
    private readonly snackBar: MatSnackBar,
    private readonly appPwaService: AppPwaService,
    private readonly svgoService: SvgoService,
    private readonly svgStateService: SvgStateService
  ) {}

  ngOnInit() {
    this.appPwaService.interceptDefaultInstall();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  installPromotion() {
    this.appPwaService.installPromotion();
  }

  reloadPage() {
    this.swUpdate.activateUpdate().then(() => this.document.location.reload());
  }

  openDirectory() {
    localStorage.setItem('firstUseApp', 'false');
    this.firstUseApp$.next(false);
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
                const name = sliceSvgSuffix(handle.name);
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
          this.svgStateService.updateOptimizedSvgMap(optimizedSvgMap);
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

  updateActiveHandle(handle: FileWithDirectoryHandle) {
    this.activeHandleSubject.next(handle);
  }

  copy(name: string, text: string) {
    this.clipboard.copy(text);
    this.snackBar.open(`Copy ${name} success.`, 'Dismiss', {
      duration: 2000,
    });
  }
}
