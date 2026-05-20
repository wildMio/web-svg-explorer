import { Clipboard } from '@angular/cdk/clipboard';
import { AsyncPipe } from '@angular/common';
import {
  effect,
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  OnDestroy,
  ChangeDetectorRef,
  NgZone,
  inject,
  input,
  output,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { FileWithDirectoryHandle } from 'browser-fs-access';
import {
  BehaviorSubject,
  combineLatest,
  concatMap,
  filter,
  finalize,
  from,
  map,
  ReplaySubject,
  shareReplay,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';

import { I18nService } from '../service/i18n.service';
import { SvgStateService } from '../service/svg-state.service';
import { SvgoService } from '../service/svgo.service';
import { ToastService } from '../service/toast.service';
import {
  downloadBlob,
  formatBytes,
  round,
  sliceSvgSuffix,
} from '../util/general';
import { inView } from '../util/intersection-observer';
import { createPreviewSvgDataUri } from '../util/svg-preview';

@Component({
  selector: 'app-svg-card',
  templateUrl: './svg-card.component.html',
  styleUrls: ['./svg-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
    '[class.svg-card--compact]': 'isCompactMode',
  },
  imports: [AsyncPipe],
})
export class SvgCardComponent implements OnDestroy {
  private readonly zone = inject(NgZone);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly domSanitizer = inject(DomSanitizer);
  private readonly clipboard = inject(Clipboard);
  private readonly svgoService = inject(SvgoService);
  private readonly svgStateService = inject(SvgStateService);
  private readonly toastService = inject(ToastService);
  readonly i18n = inject(I18nService);

  private readonly destroy$ = new Subject<void>();

  readonly fileWithDirectoryHandle = input<FileWithDirectoryHandle | undefined>(
    undefined,
  );
  readonly currentColor = input<string | null | undefined>(undefined);
  readonly colorInvert = input(false);
  readonly compactMode = input(false);
  readonly quickPreviewSelected = input(false);
  readonly duplicateGroupSize = input(0);
  readonly quickPreviewSelectedChange = output<boolean>();

  get isCompactMode() {
    return this.compactMode();
  }

  private readonly syncInputState = effect(() => {
    const handle = this.fileWithDirectoryHandle();

    if (handle) {
      this.handle$.next(handle);
    }

    this.previewColor$.next(this.currentColor() ?? null);
    this.previewContrast$.next(this.colorInvert());
  });

  handle$ = new ReplaySubject<FileWithDirectoryHandle>(1);

  previewColor$ = new BehaviorSubject<string | null>(null);

  optimizedSvgMap$ = this.svgStateService.optimizedSvgMap$;

  previewContrast$ = new BehaviorSubject(false);

  loading$ = new BehaviorSubject(true);

  svgText$ = this.handle$.pipe(
    tap(() => this.loading$.next(true)),
    switchMap((handle) =>
      inView(this.host.nativeElement).pipe(
        filter((view) => view),
        take(1),
        tap(() => handle.size),
        concatMap(() => from(handle.text())),
      ),
    ),
    takeUntil(this.destroy$),
    shareReplay(1),
  );

  svgUri$ = this.svgText$.pipe(
    concatMap((data) =>
      combineLatest([this.previewColor$, this.previewContrast$]).pipe(
        map(([color, contrastPreview]) =>
          this.domSanitizer.bypassSecurityTrustResourceUrl(
            createPreviewSvgDataUri(data, {
              color,
              contrastPreview,
            }),
          ),
        ),
      ),
    ),
    tap(() => {
      this.loading$.next(false);
      this.zone.runOutsideAngular(() => {
        requestAnimationFrame(() => {
          this.cdr.detectChanges();
        });
      });
    }),
    takeUntil(this.destroy$),
    shareReplay(1),
  );

  svgName$ = this.handle$.pipe(
    map(({ name }) => sliceSvgSuffix(name)),
    takeUntil(this.destroy$),
    shareReplay(1),
  );

  loadingDelay = `${Math.random() * 3}s`;

  pending$ = new BehaviorSubject(false);

  optimizedSvg$ = this.svgName$.pipe(
    switchMap((name) =>
      this.optimizedSvgMap$.pipe(map((svgMap) => svgMap?.[name])),
    ),
  );

  optimizedSvgBlob$ = this.optimizedSvg$.pipe(
    filter((svg) => !!svg),
    map((svg) => {
      if (svg?.data) {
        return new Blob([svg?.data]);
      }
      return;
    }),
    takeUntil(this.destroy$),
    shareReplay(1),
  );

  optimizedSvgSize$ = this.optimizedSvgBlob$.pipe(map((blob) => blob?.size));

  originalSize$ = this.handle$.pipe(map((handle) => handle.size));
  originalSizeLabel$ = this.originalSize$.pipe(
    map((size) => formatBytes(size)),
  );
  optimizedSizeLabel$ = this.optimizedSvg$.pipe(
    map((svg) =>
      svg?.data
        ? formatBytes(new Blob([svg.data]).size)
        : this.i18n.t('svgCard.notOptimizedYet'),
    ),
  );
  deltaLabel$ = combineLatest([
    this.originalSize$,
    this.optimizedSvg$,
    this.i18n.language$,
  ]).pipe(
    map(([originalSize, optimizedSvg]) => {
      if (!optimizedSvg?.data) {
        return this.i18n.t('svgCard.runOptimizeToCompare');
      }

      const optimizedSize = new Blob([optimizedSvg.data]).size;
      const delta = originalSize - optimizedSize;

      return delta >= 0
        ? this.i18n.t('svgCard.delta.saved', {
            size: formatBytes(delta),
          })
        : this.i18n.t('svgCard.delta.larger', {
            size: formatBytes(Math.abs(delta)),
          });
    }),
  );
  cardStateLabel$ = combineLatest([
    this.pending$,
    this.optimizedSvg$,
    this.i18n.language$,
  ]).pipe(
    map(([pending, optimizedSvg]) => {
      if (pending) {
        return this.i18n.t('svgCard.state.optimizing');
      }

      return optimizedSvg
        ? this.i18n.t('svgCard.state.optimized')
        : this.i18n.t('svgCard.state.original');
    }),
  );

  compressRatio$ = combineLatest([
    this.originalSize$,
    this.optimizedSvgSize$,
  ]).pipe(
    map(
      ([comparisonSize, size]) =>
        round(((size ?? 0) / comparisonSize) * 100, 2) + '%',
    ),
  );

  compressRatioClass$ = combineLatest([
    this.originalSize$,
    this.optimizedSvgSize$,
  ]).pipe(
    map(([comparisonSize, size = 0]) =>
      comparisonSize > size
        ? 'asset-card__ratio--positive'
        : comparisonSize < size
          ? 'asset-card__ratio--negative'
          : '',
    ),
  );

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  optimize() {
    if (this.pending$.getValue()) {
      return;
    }

    this.pending$.next(true);
    combineLatest({ name: this.svgName$, text: this.svgText$ })
      .pipe(
        take(1),
        concatMap(({ name, text }) =>
          this.svgoService
            .optimize$(text, name)
            .pipe(map((optimizedSvg) => ({ name, optimizedSvg }))),
        ),
        take(1),
        takeUntil(this.destroy$),
        finalize(() => this.pending$.next(false)),
      )
      .subscribe({
        next: ({ name, optimizedSvg }) => {
          this.svgStateService.updateOptimizedSvg(name, optimizedSvg);
        },
      });
  }

  download() {
    combineLatest({ svgBlob: this.optimizedSvgBlob$, name: this.svgName$ })
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe({
        next: ({ svgBlob, name }) => {
          if (svgBlob) {
            downloadBlob(svgBlob, `${name}.svg`);
          }
        },
      });
  }

  invertColor() {
    this.previewContrast$.next(!this.previewContrast$.getValue());
  }

  setQuickPreviewSelection(selected: boolean) {
    this.quickPreviewSelectedChange.emit(selected);
  }

  copy() {
    combineLatest({ svg: this.optimizedSvg$, name: this.svgName$ })
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe({
        next: ({ svg, name }) => {
          if (svg?.data) {
            this.clipboard.copy(svg.data);
            this.toastService.success(
              this.i18n.t('svgCard.toast.copiedOptimized', { name }),
            );
          }
        },
      });
  }
}
