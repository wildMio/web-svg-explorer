import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ElementRef,
  HostBinding,
} from '@angular/core';
import { FileWithDirectoryHandle } from 'browser-fs-access';
import {
  BehaviorSubject,
  concatMap,
  filter,
  from,
  ReplaySubject,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { inView } from '../util/intersection-observer';

@Component({
  selector: 'app-svg-card',
  templateUrl: './svg-card.component.html',
  styleUrls: ['./svg-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgCardComponent {
  @HostBinding('class') class = 'grid place-items-center';

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
      inView(this.host.nativeElement).pipe(
        filter((view) => view),
        take(1),
        concatMap(() => from(handle.text())),
        tap(() => this.loading$.next(false))
      )
    )
  );

  constructor(private readonly host: ElementRef<HTMLElement>) {}
}
