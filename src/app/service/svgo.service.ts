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
import { OptimizedSvg } from 'svgo';

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
      id: 'cleanupIDs',
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
  ],
};

@Injectable({
  providedIn: 'root',
})
export class SvgoService {
  worker$ = defer(() => {
    if (typeof Worker !== 'undefined') {
      return of(
        new Worker(new URL('../worker/svgo-worker.worker.ts', import.meta.url))
      );
    }
    return throwError(() => 'Not support');
  }).pipe(shareReplay(1));

  cacheMap: {
    [fingerprint: string]: { [fileName: string]: Observable<OptimizedSvg> };
  } = {};

  multipass$ = new BehaviorSubject(true);
  floatPrecision$ = new BehaviorSubject(3);
  pretty$ = new BehaviorSubject(false);
  plugins$ = new BehaviorSubject(setting.plugins);

  options$ = combineLatest([
    this.multipass$,
    this.floatPrecision$,
    this.pretty$,
    this.plugins$,
  ]).pipe(
    auditTime(0),
    map(([multipass, floatPrecision, pretty, plugins]) => ({
      multipass,
      floatPrecision,
      plugins: plugins
        .filter(({ active }) => active)
        .map(({ id }) => ({
          name: id,
          params: { floatPrecision: 3 },
        })),
      js2svg: {
        indent: 2,
        pretty,
      },
    }))
  );

  fingerprint = '';

  constructor() {
    this.monitorFingerprint();
  }

  private monitorFingerprint() {
    this.options$.subscribe({
      next: ({ multipass, floatPrecision, js2svg, plugins }) => {
        const activePluginIdSet = new Set(plugins?.map(({ name }) => name));
        const fingerprint = `${Number(multipass)},${floatPrecision},${Number(
          js2svg?.pretty ?? 0
        )},${setting.plugins
          .map(({ id }) => Number(activePluginIdSet.has(id)))
          .join(',')}`;
        this.fingerprint = fingerprint;
      },
    });
  }

  optimize$(svgString: string, fileName: string) {
    if (!this.cacheMap[this.fingerprint]) {
      this.cacheMap[this.fingerprint] = {};
    }
    if (this.cacheMap[this.fingerprint][fileName]) {
      return this.cacheMap[this.fingerprint][fileName];
    }
    this.cacheMap[this.fingerprint][fileName] = this.options$.pipe(
      take(1),
      mergeMap((options) => {
        return this.worker$.pipe(
          mergeMap((worker) => {
            worker.postMessage({
              svgString,
              fileName,
              options,
            });
            return fromEvent<MessageEvent>(worker, 'message').pipe(
              filter(({ data: { fileName: name } }) => name === fileName),
              map(({ data: { optimizedSvg } }) => optimizedSvg)
            );
          })
        );
      }),
      shareReplay(1)
    );
    return this.cacheMap[this.fingerprint][fileName];
  }
}
