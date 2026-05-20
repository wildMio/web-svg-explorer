/// <reference lib="webworker" />

import { optimize } from 'svgo/browser';

import type { Config as OptimizeOptions } from 'svgo/browser';

interface SVGOMessage {
  requestId: string;
  svgString: string;
  fileName: string;
  options: OptimizeOptions;
}

addEventListener(
  'message',
  ({
    data: { requestId, svgString, fileName, options },
  }: {
    data: SVGOMessage;
  }) => {
    postMessage({
      requestId,
      optimizedSvg: optimize(svgString, options),
      fileName,
    });
  },
);
