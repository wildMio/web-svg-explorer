import { CdkTrapFocus } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CdkOverlayOrigin, CdkConnectedOverlay } from '@angular/cdk/overlay';
import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnDestroy,
  OnInit,
  DOCUMENT,
  inject,
} from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatTooltip } from '@angular/material/tooltip';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';

import { directoryOpen, FileWithDirectoryHandle } from 'browser-fs-access';
import { strToU8, zipSync } from 'fflate';
import {
  BehaviorSubject,
  combineLatest,
  concatMap,
  debounceTime,
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

import { CompressSettingComponent } from './compress-setting/compress-setting.component';
import { MatchPipe } from './pipe/match.pipe';
import { AppPwaService } from './service/app-pwa.service';
import { SvgStateService } from './service/svg-state.service';
import { SvgoService } from './service/svgo.service';
import { SvgCardComponent } from './svg-card/svg-card.component';
import { SvgMarkupComponent } from './svg-markup/svg-markup.component';
import { downloadBlob, sliceSvgSuffix } from './util/general';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButton,
    MatTooltip,
    MatIconButton,
    CdkOverlayOrigin,
    CdkConnectedOverlay,
    MatCard,
    CdkTrapFocus,
    MatCheckbox,
    CompressSettingComponent,
    SvgCardComponent,
    SvgMarkupComponent,
    AsyncPipe,
    MatchPipe,
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly document = inject<Document>(DOCUMENT);
  private readonly swUpdate = inject(SwUpdate);
  private readonly appPwaService = inject(AppPwaService);
  private readonly svgoService = inject(SvgoService);
  private readonly svgStateService = inject(SvgStateService);

  @HostBinding('class') class = 'grid h-full';

  private readonly destroy$ = new Subject<void>();

  fileWithDirectoryHandles$ = new BehaviorSubject<FileWithDirectoryHandle[]>(
    []
  );
  hasHandles$ = this.fileWithDirectoryHandles$.pipe(
    map((handles) => !!handles.length)
  );

  displaySettingOpen = false;
  currentColor$ = new BehaviorSubject('white');
  debounceCurrentColor$ = this.currentColor$.pipe(debounceTime(200));
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
  hasOptimizedSvgMap$ = this.svgStateService.hasOptimizedSvgMap$;

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
          const zipContent = zipSync(
            Object.fromEntries(
              Object.entries(svgMap ?? {}).map(([name, svg]) => [
                `${name}.svg`,
                strToU8(svg.data),
              ])
            )
          );

          return of(
            new Blob([zipContent.buffer as ArrayBuffer], {
              type: 'application/zip',
            })
          );
        }),
        finalize(() => this.downloadZipping$.next(false))
      )
      .subscribe({ next: (content) => downloadBlob(content, 'svg.zip') });
  }

  updateActiveHandle(handle: FileWithDirectoryHandle) {
    this.activeHandleSubject.next(handle);
  }
}
