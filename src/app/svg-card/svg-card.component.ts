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
import { encodeSVG } from '../util/encodeSvg';
import { InputToSubject } from '../util/input-to-subject';
import { inView } from '../util/intersection-observer';

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

  svgName$ = this.handle$.pipe(
    map((handle) => handle.name.replace('.svg', '')),
    takeUntil(this.destroy$),
    shareReplay(1)
  );

  loadingDelay = `${Math.random() * 3}s`;

  invert = false;

  constructor(
    private readonly host: ElementRef<HTMLElement>,
    private readonly domSanitizer: DomSanitizer
  ) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
