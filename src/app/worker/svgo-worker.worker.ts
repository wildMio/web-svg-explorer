/// <reference lib="webworker" />

import { optimize } from 'svgo';

addEventListener('message', ({ data: { svgString, fileName } }) => {
  postMessage({
    optimizedSvg: optimize(svgString, {
      multipass: true,
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              removeViewBox: false,
              removeUnknownsAndDefaults: {
                keepDataAttrs: false,
              },
              cleanupIDs: {
                force: true,
              },
            },
          },
        },
        {
          name: 'convertStyleToAttrs',
          active: true,
        },
      ],
    }),
    fileName,
  });
});
