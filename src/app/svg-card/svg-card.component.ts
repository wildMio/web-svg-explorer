import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ElementRef,
  HostBinding,
  OnDestroy,
} from '@angular/core';
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
import { inView } from '../util/intersection-observer';

@Component({
  selector: 'app-svg-card',
  templateUrl: './svg-card.component.html',
  styleUrls: ['./svg-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgCardComponent implements OnDestroy {
  @HostBinding('class') class = 'grid';

  private readonly destroy$ = new Subject<void>();

  handle$ = new ReplaySubject<FileWithDirectoryHandle>(1);

  @Input()
  public get fileWithDirectoryHandle(): FileWithDirectoryHandle | undefined {
    return this._fileWithDirectoryHandle;
  }
  public set fileWithDirectoryHandle(
    value: FileWithDirectoryHandle | undefined
  ) {
    this._fileWithDirectoryHandle = value;
    if (value) {
      this.handle$.next(value);
    }
  }
  private _fileWithDirectoryHandle?: FileWithDirectoryHandle | undefined;

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
        concatMap(() => from(handle.text())),
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

  constructor(private readonly host: ElementRef<HTMLElement>) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
