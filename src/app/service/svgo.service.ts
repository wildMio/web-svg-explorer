import { Injectable } from '@angular/core';

import {
  auditTime,
  BehaviorSubject,
  combineLatest,
  defer,
  filter,
  fromEvent,
  map,
  mergeMap,
  Observable,
  of,
  shareReplay,
  take,
  throwError,
} from 'rxjs';

import type { Output as OptimizedSvg } from 'svgo/browser';

export type CompressionPresetId = 'safe' | 'balanced' | 'extreme';
export type CompressionPresetState = CompressionPresetId | 'custom';
export type CompressionPreset = {
  id: CompressionPresetId;
  label: string;
  shortDescription: string;
  description: string;
  multipass: boolean;
  floatPrecision: number;
  transformPrecision: number;
  pretty: boolean;
  activePluginIds: string[];
};

type WorkerOptimizeRequest = {
  requestId: string;
  svgString: string;
  fileName: string;
  options: unknown;
};

type WorkerOptimizeResponse = {
  requestId: string;
  optimizedSvg: OptimizedSvg;
};

const setting = {
  plugins: [
    {
      id: 'removeDoctype',
      name: 'Remove doctype',
      active: true,
    },
    {
      id: 'removeXMLProcInst',
      name: 'Remove XML instructions',
      active: true,
    },
    {
      id: 'removeComments',
      name: 'Remove comments',
      active: true,
    },
    {
      id: 'removeMetadata',
      name: 'Remove <metadata>',
      active: true,
    },
    {
      id: 'removeXMLNS',
      name: 'Remove xmlns',
      active: false,
    },
    {
      id: 'removeEditorsNSData',
      name: 'Remove editor data',
      active: true,
    },
    {
      id: 'cleanupAttrs',
      name: 'Clean up attribute whitespace',
      active: true,
    },
    {
      id: 'mergeStyles',
      name: 'Merge styles',
      active: true,
    },
    {
      id: 'inlineStyles',
      name: 'Inline styles',
      active: true,
    },
    {
      id: 'minifyStyles',
      name: 'Minify styles',
      active: true,
    },
    {
      id: 'convertStyleToAttrs',
      name: 'Style to attributes',
      active: true,
    },
    {
      id: 'cleanupIds',
      name: 'Clean up IDs',
      active: true,
    },
    {
      id: 'removeRasterImages',
      name: 'Remove raster images',
      active: false,
    },
    {
      id: 'removeUselessDefs',
      name: 'Remove unused defs',
      active: true,
    },
    {
      id: 'cleanupNumericValues',
      name: 'Round/rewrite numbers',
      active: true,
    },
    {
      id: 'cleanupListOfValues',
      name: 'Round/rewrite number lists',
      active: false,
    },
    {
      id: 'convertColors',
      name: 'Minify colours',
      active: true,
    },
    {
      id: 'removeUnknownsAndDefaults',
      name: 'Remove unknowns & defaults',
      active: false,
    },
    {
      id: 'removeNonInheritableGroupAttrs',
      name: 'Remove unneeded group attrs',
      active: true,
    },
    {
      id: 'removeUselessStrokeAndFill',
      name: 'Remove useless stroke & fill',
      active: true,
    },
    {
      id: 'removeViewBox',
      name: 'Remove viewBox',
      active: false,
    },
    {
      id: 'cleanupEnableBackground',
      name: 'Remove/tidy enable-background',
      active: true,
    },
    {
      id: 'removeHiddenElems',
      name: 'Remove hidden elements',
      active: true,
    },
    {
      id: 'removeEmptyText',
      name: 'Remove empty text',
      active: true,
    },
    {
      id: 'convertShapeToPath',
      name: 'Shapes to (smaller) paths',
      active: true,
    },
    {
      id: 'moveElemsAttrsToGroup',
      name: 'Move attrs to parent group',
      active: true,
    },
    {
      id: 'moveGroupAttrsToElems',
      name: 'Move group attrs to elements',
      active: true,
    },
    {
      id: 'collapseGroups',
      name: 'Collapse useless groups',
      active: true,
    },
    {
      id: 'convertPathData',
      name: 'Round/rewrite paths',
      active: true,
    },
    {
      id: 'convertEllipseToCircle',
      name: 'Convert non-eccentric <ellipse> to <circle>',
      active: true,
    },
    {
      id: 'convertTransform',
      name: 'Round/rewrite transforms',
      active: true,
    },
    {
      id: 'removeEmptyAttrs',
      name: 'Remove empty attrs',
      active: true,
    },
    {
      id: 'removeEmptyContainers',
      name: 'Remove empty containers',
      active: true,
    },
    {
      id: 'mergePaths',
      name: 'Merge paths',
      active: true,
    },
    {
      id: 'removeUnusedNS',
      name: 'Remove unused namespaces',
      active: true,
    },
    {
      id: 'reusePaths',
      name: 'Replace duplicate elements with links',
      active: false,
    },
    {
      id: 'sortAttrs',
      name: 'Sort attrs',
      active: false,
    },
    {
      id: 'sortDefsChildren',
      name: 'Sort children of <defs>',
      active: true,
    },
    {
      id: 'removeTitle',
      name: 'Remove <title>',
      active: true,
    },
    {
      id: 'removeDesc',
      name: 'Remove <desc>',
      active: true,
    },
    {
      id: 'removeDimensions',
      name: 'Prefer viewBox to width/height',
      active: false,
    },
    {
      id: 'removeStyleElement',
      name: 'Remove style elements',
      active: false,
    },
    {
      id: 'removeScriptElement',
      name: 'Remove script elements',
      active: false,
    },
    {
      id: 'removeOffCanvasPaths',
      name: 'Remove out-of-bounds paths',
      active: false,
    },
  ],
};

const defaultActivePluginIds = setting.plugins
  .filter(({ active }) => active)
  .map(({ id }) => id);

const safeDisabledPluginIds = new Set<string>([
  'cleanupIds',
  'convertShapeToPath',
  'moveElemsAttrsToGroup',
  'moveGroupAttrsToElems',
  'collapseGroups',
  'mergePaths',
  'removeTitle',
  'removeDesc',
]);

const safeActivePluginIds = defaultActivePluginIds.filter(
  (id) => !safeDisabledPluginIds.has(id),
);

const extremeAdditionalPluginIds = [
  'removeXMLNS',
  'cleanupListOfValues',
  'removeUnknownsAndDefaults',
  'reusePaths',
  'sortAttrs',
  'removeDimensions',
];

const extremeActivePluginIds = setting.plugins
  .filter(({ id, active }) => active || extremeAdditionalPluginIds.includes(id))
  .filter(({ id }) => !['removeViewBox', 'removeStyleElement'].includes(id))
  .map(({ id }) => id);

const compressionPresets: CompressionPreset[] = [
  {
    id: 'safe',
    label: 'Safe',
    shortDescription: 'Preserve more structure and geometry detail.',
    description:
      'Higher precision, readable output, and fewer structural rewrites for sensitive artwork, product icons, and review-heavy batches.',
    multipass: false,
    floatPrecision: 5,
    transformPrecision: 6,
    pretty: true,
    activePluginIds: safeActivePluginIds,
  },
  {
    id: 'balanced',
    label: 'Balanced',
    shortDescription: 'Recommended starting point for most icon sets.',
    description:
      'The default workbench profile. It keeps the usual cleanup wins without pushing too hard on precision or risky transforms.',
    multipass: true,
    floatPrecision: 3,
    transformPrecision: 5,
    pretty: false,
    activePluginIds: defaultActivePluginIds,
  },
  {
    id: 'extreme',
    label: 'Max compression',
    shortDescription: 'Push harder for size reduction and review the result.',
    description:
      'Lower precision and a wider plugin set for the smallest practical output. Use it when bytes matter more than editability.',
    multipass: true,
    floatPrecision: 1,
    transformPrecision: 1,
    pretty: false,
    activePluginIds: extremeActivePluginIds,
  },
];

const compressionPresetMap = Object.fromEntries(
  compressionPresets.map((preset) => [preset.id, preset]),
) as Record<CompressionPresetId, CompressionPreset>;

const arePluginSelectionsEqual = (left: string[], right: string[]): boolean =>
  left.length === right.length &&
  left.every((pluginId, index) => pluginId === right[index]);

const createPluginState = (activePluginIds: string[]) => {
  const activePluginIdSet = new Set(activePluginIds);

  return setting.plugins.map((plugin) => ({
    ...plugin,
    active: activePluginIdSet.has(plugin.id),
  }));
};

const defaultProfile = {
  multipass: compressionPresetMap.balanced.multipass,
  floatPrecision: compressionPresetMap.balanced.floatPrecision,
  transformPrecision: compressionPresetMap.balanced.transformPrecision,
  pretty: compressionPresetMap.balanced.pretty,
};

const hashSvgCacheKey = (value: string) => {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return `${value.length}:${(hash >>> 0).toString(36)}`;
};

@Injectable({
  providedIn: 'root',
})
export class SvgoService {
  readonly presetOptions = compressionPresets;

  worker$ = defer(() => {
    if (typeof Worker !== 'undefined') {
      return of(
        new Worker(new URL('../worker/svgo-worker.worker.ts', import.meta.url)),
      );
    }
    return throwError(() => 'Not support');
  }).pipe(shareReplay(1));

  cacheMap: {
    [fingerprint: string]: { [cacheKey: string]: Observable<OptimizedSvg> };
  } = {};

  multipass$ = new BehaviorSubject(defaultProfile.multipass);
  floatPrecision$ = new BehaviorSubject(defaultProfile.floatPrecision);
  transformPrecision$ = new BehaviorSubject(defaultProfile.transformPrecision);
  pretty$ = new BehaviorSubject(defaultProfile.pretty);
  plugins$ = new BehaviorSubject(
    createPluginState(compressionPresetMap.balanced.activePluginIds),
  );

  settingsSnapshot$ = combineLatest([
    this.multipass$,
    this.floatPrecision$,
    this.transformPrecision$,
    this.pretty$,
    this.plugins$,
  ]).pipe(
    map(([multipass, floatPrecision, transformPrecision, pretty, plugins]) => ({
      multipass,
      floatPrecision,
      transformPrecision,
      pretty,
      activePluginIds: plugins
        .filter(({ active }) => active)
        .map(({ id }) => id),
    })),
    shareReplay(1),
  );

  activePreset$ = this.settingsSnapshot$.pipe(
    map(({ activePluginIds, ...snapshot }) => {
      const matchingPreset = compressionPresets.find(
        (preset) =>
          preset.multipass === snapshot.multipass &&
          preset.floatPrecision === snapshot.floatPrecision &&
          preset.transformPrecision === snapshot.transformPrecision &&
          preset.pretty === snapshot.pretty &&
          arePluginSelectionsEqual(preset.activePluginIds, activePluginIds),
      );

      return matchingPreset?.id ?? 'custom';
    }),
    shareReplay(1),
  );

  options$ = combineLatest([
    this.multipass$,
    this.floatPrecision$,
    this.transformPrecision$,
    this.pretty$,
    this.plugins$,
  ]).pipe(
    auditTime(0),
    map(([multipass, floatPrecision, transformPrecision, pretty, plugins]) => ({
      multipass,
      floatPrecision,
      transformPrecision,
      plugins: plugins
        .filter(({ active }) => active)
        .map(({ id }) => ({
          name: id,
          params: { floatPrecision, transformPrecision },
        })),
      js2svg: {
        indent: 2,
        pretty,
      },
    })),
  );

  fingerprint = '';
  private nextRequestId = 0;

  constructor() {
    this.monitorFingerprint();
  }

  applyPreset(presetId: CompressionPresetId) {
    const preset = compressionPresetMap[presetId];

    this.multipass$.next(preset.multipass);
    this.floatPrecision$.next(preset.floatPrecision);
    this.transformPrecision$.next(preset.transformPrecision);
    this.pretty$.next(preset.pretty);
    this.plugins$.next(createPluginState(preset.activePluginIds));
  }

  resetSettings() {
    this.applyPreset('balanced');
  }

  private monitorFingerprint() {
    this.options$.subscribe({
      next: ({
        multipass,
        floatPrecision,
        transformPrecision,
        js2svg,
        plugins,
      }) => {
        const activePluginIdSet = new Set(plugins?.map(({ name }) => name));
        const fingerprint = `${Number(
          multipass,
        )},${floatPrecision},${transformPrecision},${Number(
          js2svg?.pretty ?? 0,
        )},${setting.plugins
          .map(({ id }) => Number(activePluginIdSet.has(id)))
          .join(',')}`;
        this.fingerprint = fingerprint;
      },
    });
  }

  optimize$(svgString: string, fileName: string) {
    const cacheKey = `${fileName}:${hashSvgCacheKey(svgString)}`;

    if (!this.cacheMap[this.fingerprint]) {
      this.cacheMap[this.fingerprint] = {};
    }

    if (this.cacheMap[this.fingerprint][cacheKey]) {
      return this.cacheMap[this.fingerprint][cacheKey];
    }

    const requestId = `${this.fingerprint}:${cacheKey}:${this.nextRequestId++}`;

    this.cacheMap[this.fingerprint][cacheKey] = this.options$.pipe(
      take(1),
      mergeMap((options) => {
        return this.worker$.pipe(
          mergeMap((worker) => {
            worker.postMessage({
              requestId,
              svgString,
              fileName,
              options,
            } satisfies WorkerOptimizeRequest);

            return fromEvent<MessageEvent<WorkerOptimizeResponse>>(
              worker,
              'message',
            ).pipe(
              filter(({ data }) => data.requestId === requestId),
              map(({ data }) => data.optimizedSvg),
              take(1),
            );
          }),
        );
      }),
      shareReplay(1),
    );

    return this.cacheMap[this.fingerprint][cacheKey];
  }
}
