/// <reference lib="webworker" />

import { optimize, OptimizeOptions } from 'svgo';

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
