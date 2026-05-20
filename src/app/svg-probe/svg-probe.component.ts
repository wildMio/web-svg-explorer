import { Clipboard } from '@angular/cdk/clipboard';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { DomSanitizer, type SafeResourceUrl } from '@angular/platform-browser';

import { FileWithDirectoryHandle } from 'browser-fs-access';
import { firstValueFrom } from 'rxjs';

import { I18nService } from '../service/i18n.service';
import { SvgoService } from '../service/svgo.service';
import { ToastService } from '../service/toast.service';
import { formatBytes, sliceSvgSuffix } from '../util/general';
import {
  createPreviewSvgDataUri,
  createSvgVisualFingerprint,
} from '../util/svg-preview';

type SvgProbeState = {
  hasValue: boolean;
  valid: boolean;
  normalized: string;
  message: string;
};

type SvgProbeMatchItem = {
  handle: FileWithDirectoryHandle;
  name: string;
  optimized: boolean;
  active: boolean;
  uri: SafeResourceUrl;
};

type SvgProbeOptimizationDetails = {
  originalSizeLabel: string;
  optimizedSizeLabel: string;
  compressionRatioLabel: string;
  sizeChangeLabel: string;
  sizeChangeTone: 'neutral' | 'positive' | 'warning';
  markup: string;
};

type OptimizedSvgMap = Record<string, { data?: string }>;

const EMPTY_PROBE_STATE: SvgProbeState = {
  hasValue: false,
  valid: false,
  normalized: '',
  message: '',
};

@Component({
  selector: 'app-svg-probe',
  templateUrl: './svg-probe.component.html',
  styleUrls: ['./svg-probe.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'svg-probe',
  },
})
export class SvgProbeComponent {
  private readonly clipboard = inject(Clipboard);
  private readonly domSanitizer = inject(DomSanitizer);
  readonly i18n = inject(I18nService);
  private readonly svgoService = inject(SvgoService);
  private readonly toastService = inject(ToastService);

  readonly handles = input<readonly FileWithDirectoryHandle[]>([]);
  readonly optimizedSvgMap = input<OptimizedSvgMap | null>(null);
  readonly activeHandle = input<FileWithDirectoryHandle | null>(null);
  readonly currentColor = input<string | null>('white');
  readonly contrastPreview = input(false);
  readonly previewToneLabel = input<string | null>(null);

  readonly hasHandles = computed(() => this.handles().length > 0);
  readonly svgText = signal('');
  readonly state = computed(() => this.describePastedSvg(this.svgText()));
  readonly previewUri = computed(() => {
    const state = this.state();

    if (!state.valid) {
      return null;
    }

    return this.createPreviewUri(
      state.normalized,
      this.currentColor(),
      this.contrastPreview(),
    );
  });
  readonly optimizePending = signal(false);
  readonly optimizeAttempted = signal(false);
  readonly optimizeFailed = signal(false);
  readonly optimizedSvgText = signal<string | null>(null);
  readonly optimizedPreviewUri = computed(() => {
    const optimizedSvgText = this.optimizedSvgText();

    if (!optimizedSvgText) {
      return null;
    }

    return this.createPreviewUri(
      optimizedSvgText,
      this.currentColor(),
      this.contrastPreview(),
    );
  });
  readonly optimizedDetails = computed<SvgProbeOptimizationDetails | null>(
    () => {
      const state = this.state();
      const optimizedMarkup = this.optimizedSvgText();
      const language = this.i18n.language();

      if (!state.valid || !optimizedMarkup) {
        return null;
      }

      const originalSize = new Blob([state.normalized]).size;
      const optimizedSize = new Blob([optimizedMarkup]).size;
      const compressionRatio =
        originalSize > 0 ? (optimizedSize / originalSize) * 100 : 100;
      const sizeChange = originalSize - optimizedSize;
      const sizeChangePercent =
        originalSize > 0 ? (Math.abs(sizeChange) / originalSize) * 100 : 0;

      return {
        originalSizeLabel: formatBytes(originalSize),
        optimizedSizeLabel: formatBytes(optimizedSize),
        compressionRatioLabel: `${this.formatPercent(compressionRatio, language)}%`,
        sizeChangeLabel:
          sizeChange > 0
            ? this.i18n.t('app.svgProbe.metric.saved', {
                size: formatBytes(sizeChange),
                percent: this.formatPercent(sizeChangePercent, language),
              })
            : sizeChange < 0
              ? this.i18n.t('app.svgProbe.metric.larger', {
                  size: formatBytes(Math.abs(sizeChange)),
                  percent: this.formatPercent(sizeChangePercent, language),
                })
              : this.i18n.t('app.svgProbe.metric.sizeUnchanged'),
        sizeChangeTone:
          sizeChange > 0 ? 'positive' : sizeChange < 0 ? 'warning' : 'neutral',
        markup: optimizedMarkup,
      };
    },
  );
  readonly searchStarted = signal(false);
  readonly searchPending = signal(false);
  readonly matchItems = signal<SvgProbeMatchItem[]>([]);
  readonly matchCount = computed(() => this.matchingHandles().length);

  readonly statusLabel = computed(() => {
    if (this.searchPending()) {
      return this.i18n.t('app.svgProbe.status.searching');
    }

    if (!this.searchStarted()) {
      return this.i18n.t('app.svgProbe.status.idle');
    }

    if (!this.matchCount()) {
      return this.i18n.t('app.svgProbe.status.noMatches');
    }

    return this.i18n.t('app.svgProbe.status.matches', {
      count: this.matchCount(),
    });
  });
  readonly accentStatus = computed(
    () => this.searchStarted() && this.matchCount() > 0,
  );

  readonly matchSelected = output<FileWithDirectoryHandle>();

  private readonly matchingHandles = signal<readonly FileWithDirectoryHandle[]>(
    [],
  );
  private optimizeRequestId = 0;
  private searchRequestId = 0;
  private handlesSignature = '';

  private readonly resetSearchOnHandlesChange = effect(() => {
    const signature = this.handles()
      .map((handle) => handle.name)
      .join('\n');

    if (signature === this.handlesSignature) {
      return;
    }

    this.handlesSignature = signature;
    this.resetSearch();
  });

  private readonly syncMatchItems = effect((onCleanup) => {
    const matches = this.matchingHandles();
    const optimizedSvgMap = this.optimizedSvgMap() ?? {};
    const activeHandle = this.activeHandle();
    const currentColor = this.currentColor();
    const contrastPreview = this.contrastPreview();
    let cancelled = false;

    if (!matches.length) {
      this.matchItems.set([]);
      return;
    }

    void Promise.all(
      matches.map(async (handle) => ({
        handle,
        name: sliceSvgSuffix(handle.name),
        optimized: !!optimizedSvgMap[sliceSvgSuffix(handle.name)],
        active: activeHandle?.name === handle.name,
        uri: this.createPreviewUri(
          await handle.text(),
          currentColor,
          contrastPreview,
        ),
      })),
    ).then((items) => {
      if (!cancelled) {
        this.matchItems.set(items);
      }
    });

    onCleanup(() => {
      cancelled = true;
    });
  });

  updateSvgText(value: string) {
    this.svgText.set(value);
    this.resetSearch();
    this.resetOptimizedOutput();
  }

  requestSearch() {
    const state = this.state();
    const handles = this.handles();

    if (!state.valid || !handles.length || this.searchPending()) {
      return;
    }

    const requestId = ++this.searchRequestId;

    this.searchStarted.set(true);
    this.searchPending.set(true);

    void Promise.all([
      createSvgVisualFingerprint(state.normalized),
      this.collectHandleFingerprints(handles),
    ])
      .then(([svgFingerprint, fingerprints]) => {
        if (requestId !== this.searchRequestId) {
          return;
        }

        const matchingHandles = fingerprints
          .filter(({ fingerprint }) => fingerprint === svgFingerprint)
          .map(({ handle }) => handle)
          .sort((left, right) => left.name.localeCompare(right.name));

        this.matchingHandles.set(matchingHandles);
      })
      .catch(() => {
        if (requestId !== this.searchRequestId) {
          return;
        }

        this.matchingHandles.set([]);
      })
      .finally(() => {
        if (requestId === this.searchRequestId) {
          this.searchPending.set(false);
        }
      });
  }

  async optimizeSvg() {
    const state = this.state();

    if (!state.valid || this.optimizePending()) {
      return;
    }

    const requestId = ++this.optimizeRequestId;

    this.optimizeAttempted.set(true);
    this.optimizeFailed.set(false);
    this.optimizePending.set(true);

    try {
      const optimizedSvg = await firstValueFrom(
        this.svgoService.optimize$(state.normalized, 'svg-probe'),
      );

      if (requestId !== this.optimizeRequestId) {
        return;
      }

      this.optimizedSvgText.set(optimizedSvg.data);
    } catch {
      if (requestId !== this.optimizeRequestId) {
        return;
      }

      this.optimizedSvgText.set(null);
      this.optimizeFailed.set(true);
    } finally {
      if (requestId === this.optimizeRequestId) {
        this.optimizePending.set(false);
      }
    }
  }

  clearSvgText() {
    this.svgText.set('');
    this.resetSearch();
    this.resetOptimizedOutput();
  }

  copyOptimizedSvg() {
    const optimizedSvgText = this.optimizedSvgText();

    if (!optimizedSvgText) {
      return;
    }

    this.clipboard.copy(optimizedSvgText);
    this.toastService.success(
      this.i18n.t('app.svgProbe.toast.copiedOptimized'),
    );
  }

  selectMatch(handle: FileWithDirectoryHandle) {
    this.matchSelected.emit(handle);
  }

  private createPreviewUri(
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

  private describePastedSvg(svgText: string): SvgProbeState {
    const normalized = svgText.trim();

    if (!normalized) {
      return {
        ...EMPTY_PROBE_STATE,
        message: this.i18n.t('app.svgProbe.validation.idle'),
      };
    }

    const parsedDocument = new DOMParser().parseFromString(
      normalized,
      'image/svg+xml',
    );
    const hasParserError = !!parsedDocument.querySelector('parsererror');
    const isSvgRoot =
      parsedDocument.documentElement.nodeName.toLowerCase() === 'svg';

    if (hasParserError || !isSvgRoot) {
      return {
        hasValue: true,
        valid: false,
        normalized,
        message: this.i18n.t('app.svgProbe.validation.invalid'),
      };
    }

    return {
      hasValue: true,
      valid: true,
      normalized,
      message: this.i18n.t('app.svgProbe.validation.ready'),
    };
  }

  private resetSearch() {
    this.searchRequestId += 1;
    this.searchStarted.set(false);
    this.searchPending.set(false);
    this.matchingHandles.set([]);
    this.matchItems.set([]);
  }

  private resetOptimizedOutput() {
    this.optimizeRequestId += 1;
    this.optimizeAttempted.set(false);
    this.optimizeFailed.set(false);
    this.optimizePending.set(false);
    this.optimizedSvgText.set(null);
  }

  private collectHandleFingerprints(
    handles: readonly FileWithDirectoryHandle[],
  ) {
    return Promise.all(
      handles.map(async (handle) => ({
        handle,
        fingerprint: await createSvgVisualFingerprint(await handle.text()),
      })),
    );
  }

  private formatPercent(value: number, language: string) {
    return new Intl.NumberFormat(language, {
      maximumFractionDigits: 1,
    }).format(value);
  }
}
