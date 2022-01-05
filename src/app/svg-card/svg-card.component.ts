import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ElementRef,
  HostBinding,
  OnDestroy,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FileWithDirectoryHandle } from 'browser-fs-access';
import {
  BehaviorSubject,
  concatMap,
  filter,
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
import { InputToSubject } from '../util/input-to-subject';
import { inView } from '../util/intersection-observer';
import { saveAs } from 'file-saver';

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
  currentColor: string | undefined;

  loading$ = new BehaviorSubject(true);

  svgStr = '';

  svgUri$ = this.handle$.pipe(
    tap(() => this.loading$.next(true)),
    switchMap((handle) =>
      inView(this.host.nativeElement, {
        root: null,
        threshold: [0.2],
      }).pipe(
        filter((view) => view),
        take(1),
        concatMap(() => from(handle.text())),
        tap((data) => (this.svgStr = data)),
        concatMap((data) =>
          this.currentColor$.pipe(
            map((color) =>
              this.domSanitizer.bypassSecurityTrustResourceUrl(
                `data:image/svg+xml,${encodeSVG(data, color)}`
              )
            )
          )
        ),
        tap(() => this.loading$.next(false))
      )
    ),
    takeUntil(this.destroy$),
    shareReplay(1)
  );

  svgName = '';

  svgName$ = this.handle$.pipe(
    map((handle) => handle.name.replace('.svg', '')),
    tap((svgName) => (this.svgName = svgName)),
    takeUntil(this.destroy$),
    shareReplay(1)
  );

  loadingDelay = `${Math.random() * 3}s`;

  invert = false;

  pending$ = new BehaviorSubject(false);

  optimizedSvg$ = new BehaviorSubject<OptimizedSvg | null>(null);

  constructor(
    private readonly host: ElementRef<HTMLElement>,
    private readonly domSanitizer: DomSanitizer,
    private readonly svgoService: SvgoService
  ) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  optimize() {
    this.pending$.next(true);
    this.svgoService
      .optimize$(this.svgStr, this.svgName)
      .pipe(
        tap((optimizedSvg) => {
          this.pending$.next(false);
          this.optimizedSvg$.next(optimizedSvg);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  download() {
    saveAs(
      new Blob([this.optimizedSvg$.getValue()?.data!]),
      `${this.svgName}.svg`
    );
  }
}
