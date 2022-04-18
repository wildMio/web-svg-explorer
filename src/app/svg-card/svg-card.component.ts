import { Clipboard } from '@angular/cdk/clipboard';
import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ElementRef,
  HostBinding,
  OnDestroy,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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

import { SvgStateService } from '../service/svg-state.service';
import { SvgoService } from '../service/svgo.service';
import { encodeSVG } from '../util/encodeSvg';
import { round, sliceSvgSuffix } from '../util/general';
import { InputToSubject } from '../util/input-to-subject';
import { genInView } from '../util/intersection-observer';

@Component({
  selector: 'app-svg-card',
  templateUrl: './svg-card.component.html',
  styleUrls: ['./svg-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgCardComponent implements OnDestroy {
  @HostBinding('class') class = 'block';

  private readonly destroy$ = new Subject<void>();

  handle$ = new ReplaySubject<FileWithDirectoryHandle>(1);

  @InputToSubject('handle$')
  @Input()
  fileWithDirectoryHandle: FileWithDirectoryHandle | undefined;

  currentColor$ = new BehaviorSubject<string | null>(null);
  @InputToSubject()
  @Input()
  currentColor: string | null | undefined;

  optimizedSvgMap$ = this.svgStateService.optimizedSvgMap$;

  colorInvert$ = new BehaviorSubject(false);
  @InputToSubject()
  @Input()
  colorInvert = false;

  loading$ = new BehaviorSubject(true);

  svgText$ = this.handle$.pipe(
    tap(() => this.loading$.next(true)),
    switchMap((handle) =>
      genInView({
        root: null,
        threshold: [0.2],
      })(this.host.nativeElement).pipe(
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
    map(({ name }) => sliceSvgSuffix(name)),
    takeUntil(this.destroy$),
    shareReplay(1)
  );

  loadingDelay = `${Math.random() * 3}s`;

  pending$ = new BehaviorSubject(false);

  optimizedSvg$ = this.svgName$.pipe(
    switchMap((name) =>
      this.optimizedSvgMap$.pipe(map((svgMap) => svgMap?.[name]))
    )
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
    private readonly snackBar: MatSnackBar,
    private readonly svgoService: SvgoService,
    private readonly svgStateService: SvgStateService
  ) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  optimize() {
    this.pending$.next(true);
    combineLatest({ name: this.svgName$, text: this.svgText$ })
      .pipe(
        take(1),
        concatMap(({ name, text }) =>
          this.svgoService
            .optimize$(text, name)
            .pipe(map((optimizedSvg) => ({ name, optimizedSvg })))
        ),
        take(1),
        takeUntil(this.destroy$),
        finalize(() => this.pending$.next(false))
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
            saveAs(new Blob([svgBlob]), `${name}.svg`);
          }
        },
      });
  }

  invertColor() {
    this.colorInvert$.next(!this.colorInvert$.getValue());
  }

  copy() {
    combineLatest({ svg: this.optimizedSvg$, name: this.svgName$ })
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe({
        next: ({ svg, name }) => {
          if (svg?.data) {
            this.clipboard.copy(svg.data);
            this.snackBar.open(`Copy ${name} success.`, 'Dismiss', {
              duration: 2000,
            });
          }
        },
      });
  }
}
