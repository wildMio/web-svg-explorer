import { CdkTrapFocus } from '@angular/cdk/a11y';
import {
  CdkOverlayOrigin,
  CdkConnectedOverlay,
  type ConnectedPosition,
} from '@angular/cdk/overlay';
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
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
import { ToastViewportComponent } from './toast-viewport/toast-viewport.component';
import { encodeSVG } from './util/encodeSvg';
import { downloadBlob, sliceSvgSuffix } from './util/general';

type ThemeMode = 'dark' | 'light';
type QuickPreviewItem = {
  handle: FileWithDirectoryHandle;
  name: string;
  optimized: boolean;
  uri: SafeResourceUrl;
};

const THEME_STORAGE_KEY = 'svgolot-theme';
const COMPACT_VIEW_STORAGE_KEY = 'svgolot-compact-view';
const THEME_COLOR_BY_MODE: Record<ThemeMode, string> = {
  dark: '#12100d',
  light: '#efe6d7',
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdkOverlayOrigin,
    CdkConnectedOverlay,
    CdkTrapFocus,
    CompressSettingComponent,
    ToastViewportComponent,
    SvgCardComponent,
    SvgMarkupComponent,
    AsyncPipe,
    MatchPipe,
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly document = inject<Document>(DOCUMENT);
  private readonly domSanitizer = inject(DomSanitizer);
  private readonly swUpdate = inject(SwUpdate);
  private readonly appPwaService = inject(AppPwaService);
  private readonly svgoService = inject(SvgoService);
  private readonly svgStateService = inject(SvgStateService);

  @HostBinding('class') class = 'app-root-host';

  private readonly destroy$ = new Subject<void>();

  themeMode: ThemeMode;
  compactView = this.readStoredCompactView();

  fileWithDirectoryHandles$ = new BehaviorSubject<FileWithDirectoryHandle[]>(
    [],
  );
  fileCount$ = this.fileWithDirectoryHandles$.pipe(
    map((handles) => handles.length),
  );
  hasHandles$ = this.fileWithDirectoryHandles$.pipe(
    map((handles) => !!handles.length),
  );

  displaySettingOpen = false;
  currentColor$ = new BehaviorSubject('white');
  debounceCurrentColor$ = this.currentColor$.pipe(debounceTime(200));
  colorInvert = false;
  showMarkup = false;

  readonly overlayPositions: ConnectedPosition[] = [
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
      offsetY: 12,
    },
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 12,
    },
    {
      originX: 'end',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'bottom',
      offsetY: -12,
    },
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetY: -12,
    },
  ];

  compressSettingOpen = false;

  directoryOpening$ = new BehaviorSubject(false);
  svgOptimizing$ = new BehaviorSubject(false);
  downloadZipping$ = new BehaviorSubject(false);
  directoryReviewed$ = new BehaviorSubject(false);
  loading$ = combineLatest([
    this.directoryOpening$,
    this.svgOptimizing$,
    this.downloadZipping$,
  ]).pipe(map((loadings) => loadings.some((loading) => loading)));
  statusLabel$ = combineLatest([
    this.directoryOpening$,
    this.svgOptimizing$,
    this.downloadZipping$,
    this.hasHandles$,
    this.directoryReviewed$,
  ]).pipe(
    map(
      ([
        directoryOpening,
        svgOptimizing,
        downloadZipping,
        hasHandles,
        directoryReviewed,
      ]) => {
        if (directoryOpening) {
          return 'Scanning directory';
        }

        if (svgOptimizing) {
          return 'Optimizing SVG assets';
        }

        if (downloadZipping) {
          return 'Preparing ZIP export';
        }

        if (hasHandles) {
          return 'Batch ready';
        }

        if (directoryReviewed) {
          return 'No SVG files found';
        }

        return 'Awaiting directory';
      },
    ),
  );

  optimizedSvgMap$ = this.svgStateService.optimizedSvgMap$;
  hasOptimizedSvgMap$ = this.svgStateService.hasOptimizedSvgMap$;
  optimizedCount$ = this.optimizedSvgMap$.pipe(
    map((svgMap) => Object.keys(svgMap).length),
  );

  showInstallPromotion$ = this.appPwaService.showInstallPromotion$;
  swUpdateAvailable$ = this.swUpdate.versionUpdates.pipe(
    filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
    map((evt) => ({
      type: 'UPDATE_AVAILABLE',
      current: evt.currentVersion,
      available: evt.latestVersion,
    })),
  );

  activeHandleSubject = new BehaviorSubject<FileWithDirectoryHandle | null>(
    null,
  );
  activeHandle$ = this.activeHandleSubject.pipe(
    distinctUntilChanged(),
    takeUntil(this.destroy$),
    shareReplay(1),
  );
  activeSvgText$ = this.activeHandle$.pipe(
    switchMap((handle) => (handle ? from(handle.text()) : of(''))),
    takeUntil(this.destroy$),
    shareReplay(1),
  );
  activeOptimizedSvg$ = this.optimizedSvgMap$.pipe(
    switchMap((svgMap) =>
      svgMap
        ? this.activeHandle$.pipe(
            map((handle) => {
              const name = sliceSvgSuffix(handle?.name);
              return name ? (svgMap[name]?.data ?? '') : '';
            }),
          )
        : of(''),
    ),
    takeUntil(this.destroy$),
    shareReplay(1),
  );
  quickPreviewHandles$ = new BehaviorSubject<FileWithDirectoryHandle[]>([]);
  hasQuickPreviewHandles$ = this.quickPreviewHandles$.pipe(
    map((handles) => handles.length > 0),
  );
  quickPreviewCount$ = this.quickPreviewHandles$.pipe(
    map((handles) => handles.length),
  );
  quickPreviewHandleNames$ = this.quickPreviewHandles$.pipe(
    map((handles) => new Set(handles.map((handle) => handle.name))),
    shareReplay(1),
  );
  quickPreviewItems$ = combineLatest([
    this.quickPreviewHandles$,
    this.debounceCurrentColor$,
    this.optimizedSvgMap$,
  ]).pipe(
    switchMap(([handles, currentColor, optimizedSvgMap]) => {
      if (!handles.length) {
        return of([] as QuickPreviewItem[]);
      }

      return combineLatest(
        handles.map((handle) =>
          from(handle.text()).pipe(
            map((text) => {
              const name = sliceSvgSuffix(handle.name);

              return {
                handle,
                name,
                optimized: !!(name && optimizedSvgMap?.[name]),
                uri: this.createQuickPreviewUri(text, currentColor),
              } satisfies QuickPreviewItem;
            }),
          ),
        ),
      );
    }),
    takeUntil(this.destroy$),
    shareReplay(1),
  );

  constructor() {
    this.themeMode = this.resolveInitialTheme();
    this.applyTheme(this.themeMode, false);
  }

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

  setTheme(themeMode: ThemeMode) {
    this.themeMode = themeMode;
    this.applyTheme(themeMode, true);
  }

  toggleCompactView() {
    this.compactView = !this.compactView;
    this.persistCompactView();
  }

  openDirectory() {
    if (this.directoryOpening$.getValue()) {
      return;
    }
    this.directoryOpening$.next(true);
    from(directoryOpen())
      .pipe(finalize(() => this.directoryOpening$.next(false)))
      .subscribe({
        next: (files) => {
          const svgFiles = files.filter(
            (file) => file.type === 'image/svg+xml',
          );

          this.directoryReviewed$.next(true);
          this.fileWithDirectoryHandles$.next(svgFiles);
          this.quickPreviewHandles$.next([]);
          this.activeHandleSubject.next(svgFiles[0] ?? null);
          this.svgStateService.resetOptimizedSvgMap();
        },
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
                    concatMap((text) => this.svgoService.optimize$(text, name)),
                  ),
                ];
              }),
            ),
          ),
        ),
        take(1),
        finalize(() => this.svgOptimizing$.next(false)),
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
              ]),
            ),
          );

          return of(
            new Blob([zipContent.buffer as ArrayBuffer], {
              type: 'application/zip',
            }),
          );
        }),
        finalize(() => this.downloadZipping$.next(false)),
      )
      .subscribe({ next: (content) => downloadBlob(content, 'svg.zip') });
  }

  updateActiveHandle(handle: FileWithDirectoryHandle) {
    this.activeHandleSubject.next(handle);
  }

  updateQuickPreviewSelection(
    handle: FileWithDirectoryHandle,
    selected: boolean,
  ) {
    const currentHandles = this.quickPreviewHandles$.getValue();
    const hasHandle = currentHandles.some(
      (currentHandle) => currentHandle.name === handle.name,
    );

    if (selected && !hasHandle) {
      this.quickPreviewHandles$.next([...currentHandles, handle]);
      return;
    }

    if (!selected && hasHandle) {
      this.quickPreviewHandles$.next(
        currentHandles.filter(
          (currentHandle) => currentHandle.name !== handle.name,
        ),
      );
    }
  }

  clearQuickPreviewHandles() {
    this.quickPreviewHandles$.next([]);
  }

  private resolveInitialTheme(): ThemeMode {
    const storedTheme = this.readStoredTheme();

    if (storedTheme) {
      return storedTheme;
    }

    return this.document.defaultView?.matchMedia(
      '(prefers-color-scheme: light)',
    ).matches
      ? 'light'
      : 'dark';
  }

  private readStoredTheme(): ThemeMode | null {
    try {
      const storedTheme =
        this.document.defaultView?.localStorage.getItem(THEME_STORAGE_KEY) ??
        null;

      return storedTheme === 'dark' || storedTheme === 'light'
        ? storedTheme
        : null;
    } catch {
      return null;
    }
  }

  private applyTheme(themeMode: ThemeMode, persist: boolean) {
    this.document.documentElement.dataset['theme'] = themeMode;
    this.document
      .querySelector<HTMLMetaElement>('meta[name="theme-color"]')
      ?.setAttribute('content', THEME_COLOR_BY_MODE[themeMode]);

    if (!persist) {
      return;
    }

    try {
      this.document.defaultView?.localStorage.setItem(
        THEME_STORAGE_KEY,
        themeMode,
      );
    } catch {
      return;
    }
  }

  private readStoredCompactView(): boolean {
    try {
      return (
        this.document.defaultView?.localStorage.getItem(
          COMPACT_VIEW_STORAGE_KEY,
        ) === 'true'
      );
    } catch {
      return false;
    }
  }

  private persistCompactView() {
    try {
      this.document.defaultView?.localStorage.setItem(
        COMPACT_VIEW_STORAGE_KEY,
        String(this.compactView),
      );
    } catch {
      return;
    }
  }

  private createQuickPreviewUri(
    svgText: string,
    color: string | null,
  ): SafeResourceUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(
      `data:image/svg+xml,${encodeSVG(svgText, color ?? undefined)}`,
    );
  }
}
