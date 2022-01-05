import { Injectable } from '@angular/core';
import {
  defer,
  filter,
  fromEvent,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  throwError,
} from 'rxjs';
import { OptimizedSvg } from 'svgo';

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

  cacheMap: { [fileName: string]: Observable<OptimizedSvg> } = {};

  constructor() {}

  optimize$(svgString: string, fileName: string) {
    if (this.cacheMap[fileName]) {
      return this.cacheMap[fileName];
    }
    this.cacheMap[fileName] = this.worker$.pipe(
      switchMap((worker) => {
        worker.postMessage({ svgString, fileName });
        return fromEvent<MessageEvent>(worker, 'message').pipe(
          filter(({ data: { fileName: name } }) => name === fileName),
          map(({ data: { optimizedSvg } }) => optimizedSvg)
        );
      }),
      shareReplay(1)
    );
    return this.cacheMap[fileName];
  }
}
