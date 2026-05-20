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
  catchError,
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
  startWith,
  Subject,
  switchMap,
  take,
  takeUntil,
} from 'rxjs';

import { CompressSettingComponent } from './compress-setting/compress-setting.component';
import { MatchPipe } from './pipe/match.pipe';
import { AppPwaService } from './service/app-pwa.service';
import { I18nService } from './service/i18n.service';
import { SvgStateService } from './service/svg-state.service';
import { SvgoService } from './service/svgo.service';
import { SvgCardComponent } from './svg-card/svg-card.component';
import { SvgMarkupComponent } from './svg-markup/svg-markup.component';
import { SvgProbeComponent } from './svg-probe/svg-probe.component';
import { ToastViewportComponent } from './toast-viewport/toast-viewport.component';
import { downloadBlob, sliceSvgSuffix } from './util/general';
import {
  createPreviewSvgDataUri,
  createSvgVisualFingerprint,
  resolvePreviewTone,
} from './util/svg-preview';

type ThemeMode = 'dark' | 'light';
type QuickPreviewItem = {
  handle: FileWithDirectoryHandle;
  name: string;
  optimized: boolean;
  uri: SafeResourceUrl;
};
type DuplicateGroupByFingerprint = Map<string, FileWithDirectoryHandle[]>;
type DuplicateGroupCard = {
  fingerprint: string;
  handles: FileWithDirectoryHandle[];
  itemCount: number;
  optimizedCount: number;
  active: boolean;
  items: Array<{
    handle: FileWithDirectoryHandle;
    name: string;
    optimized: boolean;
    quickPreviewSelected: boolean;
    active: boolean;
  }>;
};

const THEME_STORAGE_KEY = 'svgolot-theme';
const COMPACT_VIEW_STORAGE_KEY = 'svgolot-compact-view';
const SVG_PROBE_ENABLED_STORAGE_KEY = 'svgolot-svg-probe-enabled';
const THEME_COLOR_BY_MODE: Record<ThemeMode, string> = {
  dark: '#12100d',
  light: '#efe6d7',
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'app-root-host',
  },
  imports: [
    CdkOverlayOrigin,
    CdkConnectedOverlay,
    CdkTrapFocus,
    CompressSettingComponent,
    ToastViewportComponent,
    SvgCardComponent,
    SvgMarkupComponent,
    SvgProbeComponent,
    AsyncPipe,
    MatchPipe,
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly document = inject<Document>(DOCUMENT);
  private readonly domSanitizer = inject(DomSanitizer);
  private readonly swUpdate = inject(SwUpdate);
  readonly i18n = inject(I18nService);
  private readonly appPwaService = inject(AppPwaService);
  private readonly svgoService = inject(SvgoService);
  private readonly svgStateService = inject(SvgStateService);

  private readonly destroy$ = new Subject<void>();
  private latestDuplicateGroups: DuplicateGroupByFingerprint = new Map();
  private pendingDuplicateFocusHandleName: string | null = null;

  themeMode: ThemeMode;
  compactView = this.readStoredCompactView();
  svgProbeEnabled = this.readStoredSvgProbeEnabled();

  fileWithDirectoryHandles$ = new BehaviorSubject<FileWithDirectoryHandle[]>(
    [],
  );
  fileNameFilterQuery$ = new BehaviorSubject('');
  normalizedFileNameFilterQuery$ = this.fileNameFilterQuery$.pipe(
    map((query) => query.trim().toLocaleLowerCase()),
    distinctUntilChanged(),
    shareReplay(1),
  );
  fileNameFilterActive$ = this.normalizedFileNameFilterQuery$.pipe(
    map((query) => !!query.length),
    shareReplay(1),
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
  colorInvert$ = new BehaviorSubject(false);
  showMarkup = false;
  duplicateScanStarted = false;
  private readonly duplicateScanStarted$ = new BehaviorSubject(false);
  private readonly duplicateScanRequestId$ = new BehaviorSubject<number | null>(
    null,
  );
  duplicateFilterActive = false;
  private readonly duplicateFilterActive$ = new BehaviorSubject(false);
  activeDuplicateGroupKey: string | null = null;
  private readonly activeDuplicateGroupKey$ = new BehaviorSubject<
    string | null
  >(null);
  duplicateScanPending$ = new BehaviorSubject(false);
  previewToneLabel$ = combineLatest([
    this.currentColor$,
    this.colorInvert$,
    this.i18n.language$,
  ]).pipe(
    map(([color, contrastPreview]) => {
      const resolvedTone = resolvePreviewTone(color, contrastPreview);

      if (!resolvedTone) {
        return this.i18n.t('app.previewTone.originalArtwork');
      }

      return contrastPreview
        ? this.i18n.t('app.previewTone.contrastTone', {
            tone: resolvedTone,
          })
        : resolvedTone;
    }),
    shareReplay(1),
  );

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
    this.i18n.language$,
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
          return this.i18n.t('app.status.scanningDirectory');
        }

        if (svgOptimizing) {
          return this.i18n.t('app.status.optimizingAssets');
        }

        if (downloadZipping) {
          return this.i18n.t('app.status.preparingZip');
        }

        if (hasHandles) {
          return this.i18n.t('app.status.batchReady');
        }

        if (directoryReviewed) {
          return this.i18n.t('app.status.noSvgFound');
        }

        return this.i18n.t('app.status.awaitingDirectory');
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
    this.colorInvert$,
    this.optimizedSvgMap$,
  ]).pipe(
    switchMap(([handles, currentColor, contrastPreview, optimizedSvgMap]) => {
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
                uri: this.createQuickPreviewUri(
                  text,
                  currentColor,
                  contrastPreview,
                ),
              } satisfies QuickPreviewItem;
            }),
          ),
        ),
      );
    }),
    takeUntil(this.destroy$),
    shareReplay(1),
  );
  duplicateGroups$ = combineLatest([
    this.fileWithDirectoryHandles$,
    this.duplicateScanRequestId$,
  ]).pipe(
    switchMap(([handles, duplicateScanRequestId]) => {
      if (!handles.length || duplicateScanRequestId === null) {
        this.duplicateScanPending$.next(false);
        return of(new Map<string, FileWithDirectoryHandle[]>());
      }

      this.duplicateScanPending$.next(true);

      return from(
        Promise.all(
          handles.map(async (handle) => ({
            handle,
            fingerprint: await createSvgVisualFingerprint(await handle.text()),
          })),
        ),
      ).pipe(
        map((fingerprints) => this.groupDuplicateFingerprints(fingerprints)),
        catchError(() => of(new Map<string, FileWithDirectoryHandle[]>())),
        finalize(() => this.duplicateScanPending$.next(false)),
      );
    }),
    shareReplay(1),
  );
  duplicateGroupSizeByName$ = this.duplicateGroups$.pipe(
    map((groups) => {
      const groupSizeByName = new Map<string, number>();

      for (const handles of groups.values()) {
        for (const handle of handles) {
          groupSizeByName.set(handle.name, handles.length);
        }
      }

      return groupSizeByName;
    }),
    startWith(new Map<string, number>()),
    shareReplay(1),
  );
  possibleDuplicateNames$ = this.duplicateGroupSizeByName$.pipe(
    map((groupSizeByName) => new Set(groupSizeByName.keys())),
    startWith(new Set<string>()),
    shareReplay(1),
  );
  possibleDuplicateCount$ = this.duplicateGroupSizeByName$.pipe(
    map((groupSizeByName) => groupSizeByName.size),
    startWith(0),
    shareReplay(1),
  );
  duplicateGroupCount$ = this.duplicateGroups$.pipe(
    map((groups) => groups.size),
    startWith(0),
    shareReplay(1),
  );
  duplicateStatusLabel$ = combineLatest([
    this.duplicateScanStarted$,
    this.duplicateScanPending$,
    this.possibleDuplicateCount$,
    this.i18n.language$,
  ]).pipe(
    map(
      ([
        duplicateScanStarted,
        duplicateScanPending,
        possibleDuplicateCount,
      ]) => {
        if (duplicateScanPending) {
          return this.i18n.t('app.duplicate.status.scanning');
        }

        if (!duplicateScanStarted) {
          return this.i18n.t('app.duplicate.status.notScanned');
        }

        if (!possibleDuplicateCount) {
          return this.i18n.t('app.duplicate.status.noMatches');
        }

        return this.i18n.t('app.duplicate.status.likelyCount', {
          count: possibleDuplicateCount,
        });
      },
    ),
    shareReplay(1),
  );
  duplicateReviewHeadline$ = combineLatest([
    this.duplicateScanStarted$,
    this.duplicateScanPending$,
    this.possibleDuplicateCount$,
    this.duplicateGroupCount$,
    this.duplicateFilterActive$,
    this.activeDuplicateGroupKey$,
    this.i18n.language$,
  ]).pipe(
    map(
      ([
        duplicateScanStarted,
        duplicateScanPending,
        possibleDuplicateCount,
        duplicateGroupCount,
        duplicateFilterActive,
        activeDuplicateGroupKey,
      ]) => {
        if (duplicateScanPending) {
          return this.i18n.t('app.duplicate.headline.building');
        }

        if (!duplicateScanStarted) {
          return this.i18n.t('app.duplicate.headline.scanOnDemand');
        }

        if (!possibleDuplicateCount) {
          return this.i18n.t('app.duplicate.headline.noDuplicates');
        }

        if (duplicateFilterActive && activeDuplicateGroupKey) {
          return this.i18n.t('app.duplicate.headline.focusedGroupAssets', {
            count: possibleDuplicateCount,
          });
        }

        if (duplicateFilterActive) {
          return this.i18n.t('app.duplicate.headline.likelyInView', {
            count: possibleDuplicateCount,
          });
        }

        return this.i18n.t('app.duplicate.headline.groupsReady', {
          count: duplicateGroupCount,
        });
      },
    ),
    shareReplay(1),
  );
  duplicateReviewHint$ = combineLatest([
    this.duplicateScanStarted$,
    this.duplicateScanPending$,
    this.possibleDuplicateCount$,
    this.duplicateFilterActive$,
    this.activeDuplicateGroupKey$,
    this.i18n.language$,
  ]).pipe(
    map(
      ([
        duplicateScanStarted,
        duplicateScanPending,
        possibleDuplicateCount,
        duplicateFilterActive,
        activeDuplicateGroupKey,
      ]) => {
        if (duplicateScanPending) {
          return this.i18n.t('app.duplicate.hint.building');
        }

        if (!duplicateScanStarted) {
          return this.i18n.t('app.duplicate.hint.scanOnDemand');
        }

        if (!possibleDuplicateCount) {
          return this.i18n.t('app.duplicate.hint.noDuplicates');
        }

        if (duplicateFilterActive && activeDuplicateGroupKey) {
          return this.i18n.t('app.duplicate.hint.focusedGroup');
        }

        if (duplicateFilterActive) {
          return this.i18n.t('app.duplicate.hint.filtered');
        }

        return this.i18n.t('app.duplicate.hint.default');
      },
    ),
    shareReplay(1),
  );
  duplicateGroupCards$ = combineLatest([
    this.duplicateGroups$,
    this.optimizedSvgMap$,
    this.quickPreviewHandleNames$,
    this.activeHandle$,
    this.activeDuplicateGroupKey$,
  ]).pipe(
    map(
      ([
        duplicateGroups,
        optimizedSvgMap,
        quickPreviewHandleNames,
        activeHandle,
        activeDuplicateGroupKey,
      ]) =>
        [...duplicateGroups.entries()].map(([fingerprint, handles]) => {
          const sortedHandles = [...handles].sort((left, right) =>
            left.name.localeCompare(right.name),
          );

          return {
            fingerprint,
            handles: sortedHandles,
            itemCount: sortedHandles.length,
            optimizedCount: sortedHandles.filter((handle) => {
              const name = sliceSvgSuffix(handle.name);
              return !!(name && optimizedSvgMap?.[name]);
            }).length,
            active: activeDuplicateGroupKey === fingerprint,
            items: sortedHandles.map((handle) => {
              const name = sliceSvgSuffix(handle.name);

              return {
                handle,
                name: handle.name,
                optimized: !!(name && optimizedSvgMap?.[name]),
                quickPreviewSelected: quickPreviewHandleNames.has(handle.name),
                active: activeHandle?.name === handle.name,
              };
            }),
          } satisfies DuplicateGroupCard;
        }),
    ),
    shareReplay(1),
  );
  activeHandleDuplicateGroup$ = combineLatest([
    this.activeHandle$,
    this.duplicateGroupCards$,
  ]).pipe(
    map(([activeHandle, duplicateGroupCards]) => {
      if (!activeHandle) {
        return null;
      }

      return (
        duplicateGroupCards.find((duplicateGroupCard) =>
          duplicateGroupCard.items.some(
            (item) => item.handle.name === activeHandle.name,
          ),
        ) ?? null
      );
    }),
    shareReplay(1),
  );
  visibleHandles$ = combineLatest([
    this.fileWithDirectoryHandles$,
    this.duplicateFilterActive$,
    this.activeDuplicateGroupKey$,
    this.duplicateGroups$,
    this.possibleDuplicateNames$,
    this.normalizedFileNameFilterQuery$,
  ]).pipe(
    map(
      ([
        handles,
        duplicateFilterActive,
        activeDuplicateGroupKey,
        duplicateGroups,
        possibleDuplicateNames,
        fileNameFilterQuery,
      ]) => {
        let filteredHandles = handles;

        if (!duplicateFilterActive) {
          filteredHandles = handles;
        } else if (activeDuplicateGroupKey) {
          const activeGroup = duplicateGroups.get(activeDuplicateGroupKey);

          if (activeGroup?.length) {
            const activeGroupNames = new Set(
              activeGroup.map((handle) => handle.name),
            );

            filteredHandles = handles.filter((handle) =>
              activeGroupNames.has(handle.name),
            );
          } else {
            filteredHandles = handles.filter((handle) =>
              possibleDuplicateNames.has(handle.name),
            );
          }
        } else {
          filteredHandles = handles.filter((handle) =>
            possibleDuplicateNames.has(handle.name),
          );
        }

        if (!fileNameFilterQuery) {
          return filteredHandles;
        }

        return filteredHandles.filter((handle) =>
          this.matchesFileNameFilter(handle, fileNameFilterQuery),
        );
      },
    ),
    shareReplay(1),
  );
  visibleHandleCount$ = this.visibleHandles$.pipe(
    map((handles) => handles.length),
    startWith(0),
    shareReplay(1),
  );
  fileNameFilterHint$ = combineLatest([
    this.normalizedFileNameFilterQuery$,
    this.visibleHandleCount$,
    this.fileCount$,
    this.i18n.language$,
  ]).pipe(
    map(([query, visibleHandleCount, totalCount]) => {
      if (!query) {
        return this.i18n.t('app.workspace.filter.hint.idle');
      }

      return this.i18n.t('app.workspace.filter.hint.matches', {
        count: visibleHandleCount,
        total: totalCount,
        query,
      });
    }),
    shareReplay(1),
  );

  constructor() {
    this.themeMode = this.resolveInitialTheme();
    this.applyTheme(this.themeMode, false);

    combineLatest([this.visibleHandles$, this.activeHandle$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([visibleHandles, activeHandle]) => {
        if (!visibleHandles.length) {
          if (activeHandle) {
            this.activeHandleSubject.next(null);
          }

          return;
        }

        if (
          !activeHandle ||
          !visibleHandles.some(({ name }) => name === activeHandle.name)
        ) {
          this.activeHandleSubject.next(visibleHandles[0]);
        }
      });

    this.possibleDuplicateCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe((possibleDuplicateCount) => {
        if (!possibleDuplicateCount && this.duplicateFilterActive) {
          this.setDuplicateFilter(false);
        }
      });

    combineLatest([this.duplicateGroups$, this.duplicateScanPending$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([duplicateGroups, duplicateScanPending]) => {
        this.latestDuplicateGroups = duplicateGroups;

        if (!this.pendingDuplicateFocusHandleName || duplicateScanPending) {
          return;
        }

        const fingerprint = this.findDuplicateGroupFingerprintByHandleName(
          this.pendingDuplicateFocusHandleName,
          duplicateGroups,
        );

        this.pendingDuplicateFocusHandleName = null;

        if (fingerprint) {
          this.setDuplicateFilter(true);
          this.setActiveDuplicateGroup(fingerprint);
        }
      });
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

  toggleSvgProbeEnabled() {
    this.svgProbeEnabled = !this.svgProbeEnabled;
    this.persistSvgProbeEnabled();
  }

  toggleMarkup() {
    this.showMarkup = !this.showMarkup;
  }

  setPreviewContrast(enabled: boolean) {
    this.colorInvert = enabled;
    this.colorInvert$.next(enabled);
  }

  toggleDuplicateFilter() {
    if (!this.duplicateScanStarted) {
      return;
    }

    this.setDuplicateFilter(!this.duplicateFilterActive);
  }

  scanLikelyDuplicates() {
    if (
      this.duplicateScanPending$.getValue() ||
      !this.fileWithDirectoryHandles$.getValue().length
    ) {
      return;
    }

    this.setDuplicateFilter(false);
    this.setActiveDuplicateGroup(null);
    this.duplicateScanStarted = true;
    this.duplicateScanStarted$.next(true);

    const currentScanRequestId = this.duplicateScanRequestId$.getValue();

    this.duplicateScanRequestId$.next((currentScanRequestId ?? 0) + 1);
  }

  focusDuplicateGroup(fingerprint: string) {
    if (
      this.activeDuplicateGroupKey === fingerprint &&
      this.duplicateFilterActive
    ) {
      this.setActiveDuplicateGroup(null);
      this.setDuplicateFilter(true);
      return;
    }

    this.setDuplicateFilter(true);
    this.setActiveDuplicateGroup(fingerprint);
  }

  showAllDuplicateGroups() {
    this.setDuplicateFilter(true);
    this.setActiveDuplicateGroup(null);
  }

  addDuplicateGroupToQuickPreview(handles: FileWithDirectoryHandle[]) {
    const currentHandles = this.quickPreviewHandles$.getValue();
    const handlesByName = new Map(
      currentHandles.map((handle) => [handle.name, handle]),
    );

    for (const handle of handles) {
      handlesByName.set(handle.name, handle);
    }

    this.quickPreviewHandles$.next([...handlesByName.values()]);
  }

  openActiveHandleDuplicateGroup() {
    const activeHandle = this.activeHandleSubject.getValue();

    if (!activeHandle) {
      return;
    }

    if (!this.duplicateScanStarted) {
      this.pendingDuplicateFocusHandleName = activeHandle.name;
      this.scanLikelyDuplicates();
      return;
    }

    const fingerprint = this.findDuplicateGroupFingerprintByHandleName(
      activeHandle.name,
    );

    if (fingerprint) {
      this.setDuplicateFilter(true);
      this.setActiveDuplicateGroup(fingerprint);
      return;
    }

    if (this.latestDuplicateGroups.size) {
      this.showAllDuplicateGroups();
    }
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
          this.resetDuplicateReview();
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

  updateFileNameFilter(value: string) {
    this.fileNameFilterQuery$.next(value);
  }

  clearFileNameFilter() {
    this.fileNameFilterQuery$.next('');
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

  private readStoredSvgProbeEnabled(): boolean {
    try {
      return (
        this.document.defaultView?.localStorage.getItem(
          SVG_PROBE_ENABLED_STORAGE_KEY,
        ) !== 'false'
      );
    } catch {
      return true;
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

  private persistSvgProbeEnabled() {
    try {
      this.document.defaultView?.localStorage.setItem(
        SVG_PROBE_ENABLED_STORAGE_KEY,
        String(this.svgProbeEnabled),
      );
    } catch {
      return;
    }
  }

  private createQuickPreviewUri(
    svgText: string,
    color: string | null,
    contrastPreview: boolean,
  ): SafeResourceUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(
      createPreviewSvgDataUri(svgText, {
        color,
        contrastPreview,
      }),
    );
  }

  private matchesFileNameFilter(
    handle: FileWithDirectoryHandle,
    query: string,
  ) {
    const baseName = sliceSvgSuffix(handle.name).toLocaleLowerCase();
    const fullName = handle.name.toLocaleLowerCase();

    return baseName.includes(query) || fullName.includes(query);
  }

  private setDuplicateFilter(enabled: boolean) {
    this.duplicateFilterActive = enabled;
    this.duplicateFilterActive$.next(enabled);

    if (!enabled) {
      this.setActiveDuplicateGroup(null);
    }
  }

  private setActiveDuplicateGroup(fingerprint: string | null) {
    this.activeDuplicateGroupKey = fingerprint;
    this.activeDuplicateGroupKey$.next(fingerprint);
  }

  private resetDuplicateReview() {
    this.latestDuplicateGroups = new Map();
    this.pendingDuplicateFocusHandleName = null;
    this.duplicateScanStarted = false;
    this.duplicateScanStarted$.next(false);
    this.duplicateScanRequestId$.next(null);
    this.duplicateScanPending$.next(false);
    this.setDuplicateFilter(false);
    this.setActiveDuplicateGroup(null);
  }

  private findDuplicateGroupFingerprintByHandleName(
    handleName: string,
    duplicateGroups: DuplicateGroupByFingerprint = this.latestDuplicateGroups,
  ) {
    for (const [fingerprint, handles] of duplicateGroups.entries()) {
      if (handles.some((handle) => handle.name === handleName)) {
        return fingerprint;
      }
    }

    return null;
  }

  private groupDuplicateFingerprints(
    fingerprints: Array<{
      handle: FileWithDirectoryHandle;
      fingerprint: string;
    }>,
  ): DuplicateGroupByFingerprint {
    const groupedFingerprints = new Map<string, FileWithDirectoryHandle[]>();

    for (const { handle, fingerprint } of fingerprints) {
      const currentGroup = groupedFingerprints.get(fingerprint);

      if (currentGroup) {
        currentGroup.push(handle);
        continue;
      }

      groupedFingerprints.set(fingerprint, [handle]);
    }

    return new Map(
      [...groupedFingerprints.entries()]
        .filter(([, handles]) => handles.length > 1)
        .sort(([, left], [, right]) => {
          if (right.length !== left.length) {
            return right.length - left.length;
          }

          return left[0].name.localeCompare(right[0].name);
        }),
    );
  }
}
