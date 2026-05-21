import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewChildren,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import { FileWithDirectoryHandle } from 'browser-fs-access';
import {
  Subject,
  animationFrameScheduler,
  auditTime,
  fromEvent,
  merge,
  startWith,
  takeUntil,
} from 'rxjs';

import { SvgCardComponent } from '../svg-card/svg-card.component';

type QuickPreviewSelectionChange = {
  handle: FileWithDirectoryHandle;
  selected: boolean;
};

type VisibleVirtualItem = {
  handle: FileWithDirectoryHandle;
  duplicateGroupSize: number;
  quickPreviewSelected: boolean;
  active: boolean;
};

type PartitionedVirtualRow = {
  index: number;
  handles: readonly FileWithDirectoryHandle[];
};

type VisibleVirtualRow = {
  index: number;
  items: readonly VisibleVirtualItem[];
};

const GRID_GAP_PX = 16;
const OVERSCAN_ROWS = 3;
const DESKTOP_CARD_MIN_WIDTH_PX = 300;
const COMPACT_CARD_MIN_WIDTH_PX = 204;
const COMPACT_CARD_MIN_WIDTH_NARROW_PX = 168;
const NARROW_SCREEN_BREAKPOINT_PX = 720;
const DEFAULT_CARD_HEIGHT_PX = 276;
const DEFAULT_COMPACT_CARD_HEIGHT_PX = 196;

const rowPartitionCache = new WeakMap<
  readonly FileWithDirectoryHandle[],
  Map<number, readonly PartitionedVirtualRow[]>
>();

@Component({
  selector: 'app-svg-virtual-grid',
  templateUrl: './svg-virtual-grid.component.html',
  styleUrls: ['./svg-virtual-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SvgCardComponent],
})
export class SvgVirtualGridComponent implements AfterViewInit, OnDestroy {
  private readonly document = inject<Document>(DOCUMENT);
  private readonly zone = inject(NgZone);
  private readonly destroy$ = new Subject<void>();

  @ViewChild('virtualGridRoot')
  private viewportElement?: ElementRef<HTMLElement>;

  @ViewChildren('rowElement', { read: ElementRef })
  private rowElements?: QueryList<ElementRef<HTMLElement>>;

  private viewportResizeObserver?: ResizeObserver;
  private rowResizeObserver?: ResizeObserver;

  readonly handles = input<readonly FileWithDirectoryHandle[]>([]);
  readonly currentColor = input<string | null | undefined>(undefined);
  readonly colorInvert = input(false);
  readonly compactMode = input(false);
  readonly duplicateGroupSizeByName = input<ReadonlyMap<string, number>>(
    new Map(),
  );
  readonly quickPreviewHandleNames = input<ReadonlySet<string>>(new Set());
  readonly activeHandle = input<FileWithDirectoryHandle | null>(null);

  readonly handleSelected = output<FileWithDirectoryHandle>();
  readonly quickPreviewSelectionChanged = output<QuickPreviewSelectionChange>();

  private readonly columnCount = signal(1);
  private readonly rowHeightPx = signal(DEFAULT_CARD_HEIGHT_PX);
  private readonly visibleRange = signal({ start: 0, end: 0 });

  readonly partitionedRows = computed(() =>
    this.getOrCreatePartitionedRows(this.handles(), this.columnCount()),
  );
  readonly totalRows = computed(() => this.partitionedRows().length);
  readonly totalHeightPx = computed(() => {
    const totalRows = this.totalRows();

    if (!totalRows) {
      return 0;
    }

    return (
      totalRows * this.rowHeightPx() + Math.max(totalRows - 1, 0) * GRID_GAP_PX
    );
  });
  readonly offsetTopPx = computed(
    () => this.visibleRange().start * this.rowStridePx(),
  );
  readonly rowTemplateColumns = computed(
    () => `repeat(${this.columnCount()}, minmax(0, 1fr))`,
  );
  readonly visibleRows = computed<VisibleVirtualRow[]>(() => {
    const partitionedRows = this.partitionedRows();
    const duplicateGroupSizeByName = this.duplicateGroupSizeByName();
    const quickPreviewHandleNames = this.quickPreviewHandleNames();
    const activeHandleName = this.activeHandle()?.name ?? null;
    const { start, end } = this.visibleRange();
    const atLeastTwoRowsEnd = Math.max(end, start + 2);

    return partitionedRows.slice(start, atLeastTwoRowsEnd).map((row) => ({
      index: row.index,
      items: row.handles.map((handle) => ({
        handle,
        duplicateGroupSize: duplicateGroupSizeByName.get(handle.name) ?? 0,
        quickPreviewSelected: quickPreviewHandleNames.has(handle.name),
        active: activeHandleName === handle.name,
      })),
    }));
  });

  private readonly syncLayoutOnCompactModeChange = effect(() => {
    this.rowHeightPx.set(this.defaultRowHeight());
    queueMicrotask(() => this.measureViewportState());
  });

  private readonly syncLayoutOnHandleChange = effect(() => {
    this.handles();
    queueMicrotask(() => this.measureViewportState());
  });

  ngAfterViewInit() {
    const viewportElement = this.viewportElement?.nativeElement;

    if (!viewportElement) {
      return;
    }

    const view = this.document.defaultView;

    if (view) {
      this.zone.runOutsideAngular(() => {
        merge(fromEvent(view, 'scroll'), fromEvent(view, 'resize'))
          .pipe(
            startWith(null),
            auditTime(0, animationFrameScheduler),
            takeUntil(this.destroy$),
          )
          .subscribe(() => this.measureViewportState());
      });
    }

    if (typeof ResizeObserver !== 'undefined') {
      this.zone.runOutsideAngular(() => {
        this.viewportResizeObserver = new ResizeObserver(() =>
          this.measureViewportState(),
        );
        this.viewportResizeObserver.observe(viewportElement);
      });
    }

    this.rowElements?.changes
      .pipe(startWith(this.rowElements), takeUntil(this.destroy$))
      .subscribe(() => this.observeFirstRow());

    this.measureViewportState();
  }

  ngOnDestroy() {
    this.viewportResizeObserver?.disconnect();
    this.rowResizeObserver?.disconnect();
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectHandle(handle: FileWithDirectoryHandle) {
    this.handleSelected.emit(handle);
  }

  updateQuickPreviewSelection(
    handle: FileWithDirectoryHandle,
    selected: boolean,
  ) {
    this.quickPreviewSelectionChanged.emit({
      handle,
      selected,
    });
  }

  private defaultRowHeight() {
    return this.compactMode()
      ? DEFAULT_COMPACT_CARD_HEIGHT_PX
      : DEFAULT_CARD_HEIGHT_PX;
  }

  private rowStridePx() {
    return this.rowHeightPx() + GRID_GAP_PX;
  }

  private observeFirstRow() {
    this.rowResizeObserver?.disconnect();

    const rowElement = this.rowElements?.first?.nativeElement;

    if (!rowElement || typeof ResizeObserver === 'undefined') {
      return;
    }

    this.zone.runOutsideAngular(() => {
      this.rowResizeObserver = new ResizeObserver((entries) => {
        const nextRowHeight = Math.ceil(entries[0]?.contentRect.height ?? 0);

        if (!nextRowHeight || nextRowHeight === this.rowHeightPx()) {
          return;
        }

        this.zone.run(() => {
          this.rowHeightPx.set(nextRowHeight);
          this.measureViewportState();
        });
      });

      this.rowResizeObserver.observe(rowElement);
    });
  }

  private measureViewportState() {
    const viewportElement = this.viewportElement?.nativeElement;
    const view = this.document.defaultView;

    if (!viewportElement || !view) {
      return;
    }

    const nextColumnCount = this.computeColumnCount(
      viewportElement.clientWidth,
      view.innerWidth,
    );
    const nextVisibleRange = this.computeVisibleRange(
      viewportElement.getBoundingClientRect(),
      nextColumnCount,
      view.innerHeight,
    );
    const columnCount = this.columnCount();
    const visibleRange = this.visibleRange();
    const columnCountChanged = nextColumnCount !== columnCount;
    const visibleRangeChanged =
      nextVisibleRange.start !== visibleRange.start ||
      nextVisibleRange.end !== visibleRange.end;

    if (!columnCountChanged && !visibleRangeChanged) {
      return;
    }

    const commit = () => {
      if (columnCountChanged) {
        this.columnCount.set(nextColumnCount);
      }

      if (visibleRangeChanged) {
        this.visibleRange.set(nextVisibleRange);
      }
    };

    if (NgZone.isInAngularZone()) {
      commit();
      return;
    }

    this.zone.run(commit);
  }

  private computeColumnCount(containerWidth: number, viewportWidth: number) {
    const minCardWidth = this.compactMode()
      ? viewportWidth <= NARROW_SCREEN_BREAKPOINT_PX
        ? COMPACT_CARD_MIN_WIDTH_NARROW_PX
        : COMPACT_CARD_MIN_WIDTH_PX
      : DESKTOP_CARD_MIN_WIDTH_PX;

    return Math.max(
      1,
      Math.floor((containerWidth + GRID_GAP_PX) / (minCardWidth + GRID_GAP_PX)),
    );
  }

  // The grid stays responsive, so virtualization tracks rows instead of cards.
  private computeVisibleRange(
    viewportRect: DOMRect,
    columnCount: number,
    viewportHeight: number,
  ) {
    const totalRows = Math.ceil(this.handles().length / columnCount);

    if (!totalRows) {
      return { start: 0, end: 0 };
    }

    const totalHeight =
      totalRows * this.rowHeightPx() + Math.max(totalRows - 1, 0) * GRID_GAP_PX;
    const visibleTopPx = Math.max(-viewportRect.top, 0);
    const visibleBottomPx = Math.min(
      viewportHeight - viewportRect.top,
      totalHeight,
    );

    if (
      visibleBottomPx <= 0 ||
      visibleTopPx >= totalHeight ||
      visibleBottomPx <= visibleTopPx
    ) {
      return { start: 0, end: 0 };
    }

    const rowStride = this.rowStridePx();
    const start = Math.max(
      Math.floor(visibleTopPx / rowStride) - OVERSCAN_ROWS,
      0,
    );
    const end = Math.min(
      Math.ceil(visibleBottomPx / rowStride) + OVERSCAN_ROWS,
      totalRows,
    );

    return {
      start,
      end: Math.max(end, start + 1),
    };
  }

  private getOrCreatePartitionedRows(
    handles: readonly FileWithDirectoryHandle[],
    columnCount: number,
  ) {
    const cachedByColumnCount = rowPartitionCache.get(handles);
    const cachedRows = cachedByColumnCount?.get(columnCount);

    if (cachedRows) {
      return cachedRows;
    }

    const nextRows: PartitionedVirtualRow[] = [];

    for (
      let rowIndex = 0, sliceStart = 0;
      sliceStart < handles.length;
      rowIndex += 1, sliceStart += columnCount
    ) {
      nextRows.push({
        index: rowIndex,
        handles: handles.slice(sliceStart, sliceStart + columnCount),
      });
    }

    const nextCachedByColumnCount = cachedByColumnCount ?? new Map();

    nextCachedByColumnCount.set(columnCount, nextRows);

    if (!cachedByColumnCount) {
      rowPartitionCache.set(handles, nextCachedByColumnCount);
    }

    return nextRows;
  }
}
