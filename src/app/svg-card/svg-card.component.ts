import { Clipboard } from '@angular/cdk/clipboard';
import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ElementRef,
  HostBinding,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { FileWithDirectoryHandle } from 'browser-fs-access';
import { saveAs } from 'file-saver';
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
import { OptimizedSvg } from 'svgo';

import { SvgoService } from '../service/svgo.service';
import { encodeSVG } from '../util/encodeSvg';
import { round } from '../util/general';
import { InputToSubject } from '../util/input-to-subject';
import { inView } from '../util/intersection-observer';

@Component({
  selector: 'app-svg-card',
  templateUrl: './svg-card.component.html',
  styleUrls: ['./svg-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgCardComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'block';

  private readonly destroy$ = new Subject<void>();

  handle$ = new ReplaySubject<FileWithDirectoryHandle>(1);

  @InputToSubject('handle$')
  @Input()
  fileWithDirectoryHandle: FileWithDirectoryHandle | undefined;

  currentColor$ = new BehaviorSubject<string | null>(null);
  @InputToSubject()
  @Input()
  currentColor: string | undefined;

  optimizedSvgMap$ = new BehaviorSubject<
    { [name: string]: OptimizedSvg } | undefined
  >(undefined);
  @InputToSubject()
  @Input()
  optimizedSvgMap?: { [name: string]: OptimizedSvg } | null;

  colorInvert$ = new BehaviorSubject(false);
  @InputToSubject()
  @Input()
  colorInvert = false;

  loading$ = new BehaviorSubject(true);

  svgText$ = this.handle$.pipe(
    tap(() => this.loading$.next(true)),
    switchMap((handle) =>
      inView(this.host.nativeElement, {
        root: null,
        threshold: [0.2],
      }).pipe(
        filter((view) => view),
        take(1),
        tap(() => handle.size),
        concatMap(() => from(handle.text()))
      )
    ),
    takeUntil(this.destroy$),
    shareReplay(1)
  );

  svgUri$ = this.svgText$.pipe(
    concatMap((data) =>
      this.currentColor$.pipe(
        map((color) =>
          this.domSanitizer.bypassSecurityTrustResourceUrl(
            `data:image/svg+xml,${encodeSVG(data, color)}`
          )
        )
      )
    ),
    tap(() => this.loading$.next(false)),
    takeUntil(this.destroy$),
    shareReplay(1)
  );

  svgName$ = this.handle$.pipe(
    map((handle) => handle.name.replace('.svg', '')),
    takeUntil(this.destroy$),
    shareReplay(1)
  );

  loadingDelay = `${Math.random() * 3}s`;

  pending$ = new BehaviorSubject(false);

  optimizedSvg$ = new BehaviorSubject<OptimizedSvg | null>(null);

  optimizedSvgBlob$ = this.optimizedSvg$.pipe(
    filter((svg) => !!svg),
    map((svg) => {
      if (svg?.data) {
        return new Blob([svg?.data]);
      }
      return;
    }),
    takeUntil(this.destroy$),
    shareReplay(1)
  );

  optimizedSvgSize$ = this.optimizedSvgBlob$.pipe(map((blob) => blob?.size));

  originalSize$ = this.handle$.pipe(map((handle) => handle.size));

  compressRatio$ = combineLatest([
    this.originalSize$,
    this.optimizedSvgSize$,
  ]).pipe(
    map(
      ([comparisonSize, size]) =>
        round(((size ?? 0) / comparisonSize) * 100, 2) + '%'
    )
  );

  compressRationClass$ = combineLatest([
    this.originalSize$,
    this.optimizedSvgSize$,
  ]).pipe(
    map(([comparisonSize, size = 0]) =>
      comparisonSize > size
        ? 'text-green-500'
        : comparisonSize < size
        ? 'text-red-500'
        : ''
    )
  );

  constructor(
    private readonly host: ElementRef<HTMLElement>,
    private readonly domSanitizer: DomSanitizer,
    private readonly clipboard: Clipboard,
    private readonly svgoService: SvgoService
  ) {}

  ngOnInit(): void {
    this.svgName$
      .pipe(
        switchMap((name) =>
          this.optimizedSvgMap$.pipe(map((svgMap) => svgMap?.[name]))
        ),
        filter((svg) => !!svg),
        takeUntil(this.destroy$)
      )
      .subscribe({ next: (svg) => svg && this.optimizedSvg$.next(svg) });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  optimize() {
    this.pending$.next(true);
    combineLatest({ name: this.svgName$, text: this.svgText$ })
      .pipe(
        take(1),
        concatMap(({ name, text }) => this.svgoService.optimize$(text, name)),
        take(1),
        takeUntil(this.destroy$),
        finalize(() => this.pending$.next(false))
      )
      .subscribe({
        next: (optimizedSvg) => {
          this.optimizedSvg$.next(optimizedSvg);
        },
      });
  }

  download() {
    combineLatest({ svgBlob: this.optimizedSvgBlob$, name: this.svgName$ })
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe({
        next: ({ svgBlob, name }) => {
          if (svgBlob) {
            saveAs(new Blob([svgBlob]), `${name}.svg`);
          }
        },
      });
  }

  invertColor() {
    this.colorInvert$.next(!this.colorInvert$.getValue());
  }

  copy() {
    this.optimizedSvg$
      .pipe(
        map((svg) => svg?.data),
        take(1)
      )
      .subscribe({
        next: (text) => {
          if (text) {
            this.clipboard.copy(text);
          }
        },
      });
  }
}
