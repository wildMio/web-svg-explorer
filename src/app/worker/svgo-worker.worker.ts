/// <reference lib="webworker" />

import { optimize } from 'svgo';

addEventListener('message', ({ data: { svgString, fileName } }) => {
  postMessage({ optimizedSvg: optimize(svgString), fileName });
});
