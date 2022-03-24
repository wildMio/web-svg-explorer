import { Injectable } from '@angular/core';

import { BehaviorSubject, debounceTime, map } from 'rxjs';
import { OptimizedSvg } from 'svgo';

@Injectable({
  providedIn: 'root',
})
export class SvgStateService {
  private optimizeSvgMap: { [name: string]: OptimizedSvg } = {};

  private optimizedSvgMapSubject = new BehaviorSubject<{
    [name: string]: OptimizedSvg;
  }>(this.optimizeSvgMap);

  optimizedSvgMap$ = this.optimizedSvgMapSubject.pipe();

  hasOptimizedSvgMap$ = this.optimizedSvgMap$.pipe(
    debounceTime(200),
    map((svgMap) => !!Object.keys(svgMap).length)
  );

  updateOptimizedSvg(name: string, svg: OptimizedSvg) {
    this.optimizeSvgMap[name] = svg;
    this.optimizedSvgMapSubject.next(this.optimizeSvgMap);
  }

  updateOptimizedSvgMap(svgMap: { [name: string]: OptimizedSvg }) {
    this.optimizeSvgMap = { ...this.optimizeSvgMap, ...svgMap };
    this.optimizedSvgMapSubject.next(this.optimizeSvgMap);
  }
}
