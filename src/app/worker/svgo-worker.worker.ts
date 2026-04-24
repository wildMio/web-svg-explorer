/// <reference lib="webworker" />

import { optimize } from 'svgo/dist/svgo.browser.js';

import type { Config as OptimizeOptions } from 'svgo';

interface SVGOMessage {
  svgString: string;
  fileName: string;
  options: OptimizeOptions;
}

addEventListener(
  'message',
  ({ data: { svgString, fileName, options } }: { data: SVGOMessage }) => {
    postMessage({
      optimizedSvg: optimize(svgString, options),
      fileName,
    });
  }
);
