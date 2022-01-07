/// <reference lib="webworker" />

import { optimize } from 'svgo';

addEventListener('message', ({ data: { svgString, fileName } }) => {
  postMessage({
    optimizedSvg: optimize(svgString, {
      multipass: true,
      plugins: [{ name: 'removeViewBox', active: false }],
    }),
    fileName,
  });
});
